import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';

export interface CharacterAttributes {
  intelligence: number;
  strength: number;
  wisdom: number;
  focus: number;
  vitality: number;
}

export interface CharacterData {
  _id: string;
  level: number;
  totalXp: number;
  gold: number;
  attributes: CharacterAttributes;
  unlockedSkills: string[];
}

/**
 * Returns how much XP is needed to advance from `level` to `level + 1`.
 * Mirrors the server-side engine formula exactly: floor(100 * level^1.5)
 */
export const xpForLevel = (level: number): number => Math.floor(100 * Math.pow(level, 1.5));

/**
 * Returns cumulative XP required to reach a given level from scratch.
 */
export const cumulativeXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
};

interface CharacterContextType {
  character: CharacterData | null;
  isLoading: boolean;
  /** XP earned within the current level (0 to xpRequired) */
  currentLevelXp: number;
  /** Total XP required to advance from current level to next */
  xpRequired: number;
  /** 0–100 progress percentage for the XP bar */
  xpPercent: number;
  /** Reload character from the server */
  refresh: () => Promise<void>;
  /** Optimistically apply a reward returned by completeQuest */
  applyReward: (data: { character: CharacterData }) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await apiFetch('/character');
      setCharacter(data);
    } catch (err) {
      console.error('Failed to load character:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setCharacter(null);
    }
  }, [user, refresh]);

  const applyReward = (data: { character: CharacterData }) => {
    setCharacter(data.character);
  };

  // Derived XP bar values
  const level = character?.level ?? 1;
  const totalXp = character?.totalXp ?? 0;
  const levelStartXp = cumulativeXpForLevel(level);
  const levelEndXp = cumulativeXpForLevel(level + 1);
  const xpRequired = levelEndXp - levelStartXp;
  const currentLevelXp = Math.max(0, totalXp - levelStartXp);
  const xpPercent = xpRequired > 0 ? Math.min(100, Math.round((currentLevelXp / xpRequired) * 100)) : 0;

  return (
    <CharacterContext.Provider
      value={{ character, isLoading, currentLevelXp, xpRequired, xpPercent, refresh, applyReward }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
