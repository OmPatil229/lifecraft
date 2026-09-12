// Calculates the total XP required to reach the NEXT level from the current level
export const calculateXpRequirement = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
};

/**
 * Returns the XP multiplier based on streak length.
 * 0-2 days  → 1.00x (no bonus)
 * 3-6 days  → 1.25x
 * 7-29 days → 1.50x
 * 30+ days  → 2.00x
 */
export const getStreakMultiplier = (streakDays: number): number => {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 7)  return 1.5;
  if (streakDays >= 3)  return 1.25;
  return 1.0;
};

/**
 * Determines the new streak value based on the last activity date.
 * - Same day as today  → streak unchanged (already active today)
 * - Yesterday          → streak increments
 * - Older / null       → streak resets to 1
 */
export const calculateNewStreak = (
  currentStreak: number,
  lastActivityDate: Date | null
): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastActivityDate) return 1;

  const last = new Date(lastActivityDate);
  last.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak;     // already active today
  if (diffDays === 1) return currentStreak + 1; // yesterday → extend
  return 1;                                     // gap → reset
};

export interface QuestReward {
  xp: number;
  gold: number;
}

export const calculateQuestReward = (difficulty: string): QuestReward => {
  switch (difficulty) {
    case 'Easy':
      return { xp: 50, gold: 10 };
    case 'Hard':
      return { xp: 200, gold: 50 };
    case 'Epic':
      return { xp: 500, gold: 200 };
    case 'Medium':
    default:
      return { xp: 100, gold: 25 };
  }
};

export const mapCategoryToAttribute = (category: string): string => {
  switch (category) {
    case 'Work':
    case 'Coding':
      return 'intelligence';
    case 'Studying':
    case 'Reading':
      return 'wisdom';
    case 'Fitness':
      return 'strength';
    case 'Meditation':
      return 'focus';
    case 'Health':
    case 'Personal':
    default:
      return 'vitality';
  }
};

export interface LevelUpResult {
  newLevel: number;
  levelsGained: number;
}

export const getCumulativeXpRequirement = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXpRequirement(i);
  }
  return total;
};

export const MAX_LEVEL = 100;

// Processes level ups to handle multi-level gains within system boundaries
export const processLevelUps = (currentLevel: number, totalXp: number): LevelUpResult => {
  let tempLevel = Math.min(currentLevel, MAX_LEVEL);
  let levelsGained = 0;
  
  while (tempLevel < MAX_LEVEL) {
    const requiredForNext = getCumulativeXpRequirement(tempLevel + 1);
    // If we have enough cumulative XP to surpass the threshold for the NEXT level
    if (totalXp >= requiredForNext) {
      tempLevel++;
      levelsGained++;
    } else {
      break;
    }
  }

  return { newLevel: tempLevel, levelsGained };
};
