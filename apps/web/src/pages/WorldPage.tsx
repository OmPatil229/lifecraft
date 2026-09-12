import React, { useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { Coins, Dumbbell, Brain, Leaf, Eye, Loader2, Flame, Shield, Sword, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────
// Map pin definitions – each pin maps to a
// screen-percentage coordinate on the bg image.
// ─────────────────────────────────────────────
const PINS = [
  {
    id: 'castle',
    label: 'The Castle',
    sublabel: 'Your HQ',
    description: 'The seat of your power. Level up to unlock new abilities.',
    type: 'level' as const,
    x: 49,  y: 15,
    icon: Shield,
    accent: '#f59e0b', // amber
    glowClass: 'shadow-[0_0_30px_4px_rgba(245,158,11,0.4)]',
    route: '/world',
  },
  {
    id: 'observatory',
    label: 'Observatory',
    sublabel: 'Focus',
    description: 'Train your concentration here. Complete Meditation quests to power this up.',
    type: 'attribute' as const,
    attribute: 'focus',
    x: 83, y: 22,
    icon: Eye,
    accent: '#34d399', // emerald
    glowClass: 'shadow-[0_0_30px_4px_rgba(52,211,153,0.35)]',
    route: '/quests',
    categoryFilter: 'Meditation',
  },
  {
    id: 'forest',
    label: 'Ancient Forest',
    sublabel: 'Wisdom',
    description: 'Ancient trees hold deep knowledge. Study quests strengthen wisdom.',
    type: 'attribute' as const,
    attribute: 'wisdom',
    x: 15, y: 40,
    icon: Leaf,
    accent: '#4ade80', // green
    glowClass: 'shadow-[0_0_30px_4px_rgba(74,222,128,0.35)]',
    route: '/quests',
    categoryFilter: 'Studying',
  },
  {
    id: 'training',
    label: 'Training Grounds',
    sublabel: 'Strength',
    description: 'Forge your body into a weapon. Fitness quests build strength.',
    type: 'attribute' as const,
    attribute: 'strength',
    x: 74, y: 54,
    icon: Dumbbell,
    accent: '#f87171', // red
    glowClass: 'shadow-[0_0_30px_4px_rgba(248,113,113,0.35)]',
    route: '/quests',
    categoryFilter: 'Fitness',
  },
  {
    id: 'library',
    label: 'Grand Library',
    sublabel: 'Intelligence',
    description: 'Knowledge is power. Coding & Reading quests boost intelligence.',
    type: 'attribute' as const,
    attribute: 'intelligence',
    x: 34, y: 62,
    icon: Brain,
    accent: '#a78bfa', // purple
    glowClass: 'shadow-[0_0_30px_4px_rgba(167,139,250,0.35)]',
    route: '/quests',
    categoryFilter: 'Coding',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    sublabel: 'Treasury',
    description: 'The lifeblood of your kingdom. Earn Gold by completing quests.',
    type: 'gold' as const,
    x: 53, y: 82,
    icon: Coins,
    accent: '#facc15', // yellow
    glowClass: 'shadow-[0_0_30px_4px_rgba(250,204,21,0.35)]',
    route: '/quests',
  },
  {
    id: 'boss-arena',
    label: 'Boss Arena',
    sublabel: 'Battles',
    description: 'Challenge epic foes. Defeat bosses for legendary rewards.',
    type: 'boss' as const,
    x: 25, y: 78,
    icon: Skull,
    accent: '#f43f5e', // rose
    glowClass: 'shadow-[0_0_30px_4px_rgba(244,63,94,0.5)]',
    route: '/bosses',
  },
];

// ─────────────────────────────────────────────
// HUD Stat Card
// ─────────────────────────────────────────────
const HudStat: React.FC<{ label: string; value: string | number; accent: string }> = ({ label, value, accent }) => (
  <div className="flex flex-col items-center px-4 py-2 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md">
    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{label}</span>
    <span className="text-lg font-bold" style={{ color: accent }}>{value}</span>
  </div>
);

// ─────────────────────────────────────────────
// Pin Detail Panel (appears on pin click)
// ─────────────────────────────────────────────
const PinPanel: React.FC<{
  pin: typeof PINS[0];
  character: any;
  currentLevelXp: number;
  xpRequired: number;
  xpPercent: number;
  onNavigate: (route: string) => void;
  onClose: () => void;
}> = ({ pin, character, currentLevelXp, xpRequired, xpPercent, onNavigate, onClose }) => {
  const Icon = pin.icon;

  const renderStats = () => {
    if (pin.type === 'level') {
      return (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Level {character?.level || 1} Progress</span>
            <span className="font-bold" style={{ color: pin.accent }}>{xpPercent}%</span>
          </div>
          <div className="h-2.5 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${xpPercent}%`, background: `linear-gradient(to right, ${pin.accent}99, ${pin.accent})` }}
            />
          </div>
          <p className="text-right text-xs text-slate-500 mt-1">{currentLevelXp} / {xpRequired} XP</p>
        </div>
      );
    }
    if (pin.type === 'attribute') {
      const val = character?.attributes?.[pin.attribute as keyof typeof character.attributes] || 0;
      const lvl = Math.floor(val / 10) + 1;
      const pct = (val % 10) * 10;
      return (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Level {lvl}</span>
            <span className="font-bold" style={{ color: pin.accent }}>{val} pts</span>
          </div>
          <div className="h-2.5 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(to right, ${pin.accent}99, ${pin.accent})` }}
            />
          </div>
        </div>
      );
    }
    if (pin.type === 'gold') {
      return (
        <div className="mt-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="text-2xl font-bold text-yellow-400">{character?.gold || 0}</span>
          <span className="text-slate-400 text-sm">Gold</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="absolute z-30 w-72 pointer-events-auto"
      style={{
        left: `${Math.min(pin.x + 5, 65)}%`,
        top: `${Math.max(pin.y - 5, 8)}%`,
        filter: `drop-shadow(0 0 40px ${pin.accent}33)`,
      }}
    >
      <div
        className="rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl p-5 relative overflow-hidden"
        style={{ boxShadow: `0 0 0 1px ${pin.accent}22, 0 25px 60px rgba(0,0,0,0.7)` }}
      >
        {/* Accent glow */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: pin.accent }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: `${pin.accent}20`, border: `1px solid ${pin.accent}40` }}
            >
              <Icon className="w-5 h-5" style={{ color: pin.accent }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{pin.label}</h3>
              <span className="text-xs font-semibold" style={{ color: pin.accent }}>{pin.sublabel}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none mt-0.5"
          >×</button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed relative z-10">{pin.description}</p>

        <div className="relative z-10">{renderStats()}</div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate(pin.route)}
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 relative z-10"
          style={{
            background: `linear-gradient(135deg, ${pin.accent}30, ${pin.accent}15)`,
            border: `1px solid ${pin.accent}50`,
            color: pin.accent,
          }}
        >
          <Sword className="w-4 h-4" />
          {pin.type === 'level' ? 'View Dashboard' : pin.type === 'boss' ? 'Enter Arena' : `Go to ${pin.label}`}
        </button>
      </div>

      {/* Arrow pointing left */}
      <div
        className="absolute top-8 -left-2 w-4 h-4 rotate-45 rounded-sm border-l border-b border-white/15 bg-slate-950/80"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Main WorldPage
// ─────────────────────────────────────────────
const WorldPage = () => {
  const { character, isLoading, currentLevelXp, xpRequired, xpPercent, streakLabel, streakMultiplier } = useCharacter();
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }

  const activePin = PINS.find(p => p.id === selectedPin);

  return (
    <div className="fixed inset-0 z-0 bg-slate-950 overflow-hidden">
      {/* ── Background Map ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/world-map-bg.jpg')",
          filter: 'brightness(0.80) saturate(1.1)',
        }}
      />
      {/* Darkening vignette at bottom for HUD readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

      {/* ── Top HUD ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-auto">
        <HudStat label="Level" value={character?.level ?? 1} accent="#f59e0b" />
        <div className="flex flex-col items-center px-4 py-2 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md min-w-[140px]">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">XP</span>
          <div className="w-full h-1.5 bg-slate-900/60 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-blue-400 font-semibold">{currentLevelXp} / {xpRequired}</span>
        </div>
        <HudStat label="Gold" value={character?.gold ?? 0} accent="#facc15" />
        {(character?.streakDays ?? 0) > 0 && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-black/30 backdrop-blur-md ${
            (character?.streakDays ?? 0) >= 3 ? 'border-orange-500/40' : 'border-white/10'
          }`}>
            <Flame className={`w-4 h-4 ${(character?.streakDays ?? 0) >= 3 ? 'text-orange-400' : 'text-slate-500'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Streak</span>
              <span className="text-sm font-bold text-orange-400">{character?.streakDays}d</span>
            </div>
            {streakMultiplier > 1 && (
              <span className="text-xs font-bold text-orange-300 bg-orange-500/20 px-1.5 py-0.5 rounded-md">
                {streakMultiplier}×
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Dismiss overlay when panel is open ── */}
      {selectedPin && (
        <div
          className="absolute inset-0 z-10"
          onClick={() => setSelectedPin(null)}
        />
      )}

      {/* ── Detail Panel ── */}
      {activePin && (
        <PinPanel
          pin={activePin}
          character={character}
          currentLevelXp={currentLevelXp}
          xpRequired={xpRequired}
          xpPercent={xpPercent}
          onNavigate={(route) => { setSelectedPin(null); navigate(route); }}
          onClose={() => setSelectedPin(null)}
        />
      )}

      {/* ── Interactive Map Pins ── */}
      <div className="absolute inset-0 pt-16">
        {PINS.map((pin) => {
          const Icon = pin.icon;
          const isSelected = selectedPin === pin.id;
          const isHovered = hoveredPin === pin.id;
          const isActive = isSelected || isHovered;

          return (
            <div
              key={pin.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={(e) => { e.stopPropagation(); setSelectedPin(isSelected ? null : pin.id); }}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Label chip (always visible, scales on hover/select) */}
              <div
                className="mb-2 px-3 py-1.5 rounded-xl border backdrop-blur-xl flex items-center gap-2 transition-all duration-300"
                style={{
                  background: isActive ? `${pin.accent}25` : 'rgba(0,0,0,0.55)',
                  borderColor: isActive ? `${pin.accent}80` : 'rgba(255,255,255,0.15)',
                  boxShadow: isActive ? `0 0 24px ${pin.accent}40` : 'none',
                  transform: isActive ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: pin.accent }} />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-bold text-white whitespace-nowrap">{pin.label}</span>
                  <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: pin.accent }}>
                    {pin.sublabel}
                  </span>
                </div>
              </div>

              {/* Pin dot with pulse animation */}
              <div className="relative flex items-center justify-center">
                {/* Outer pulse ring */}
                {isSelected && (
                  <div
                    className="absolute w-8 h-8 rounded-full animate-ping opacity-40"
                    style={{ background: pin.accent }}
                  />
                )}
                <div
                  className="w-4 h-4 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300 z-10"
                  style={{
                    background: isActive ? pin.accent : 'rgba(30,30,50,0.9)',
                    borderColor: isActive ? pin.accent : 'rgba(255,255,255,0.3)',
                    boxShadow: isActive ? `0 0 16px 4px ${pin.accent}60` : '0 2px 8px rgba(0,0,0,0.5)',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Stem line */}
              <div
                className="w-0.5 h-6 mt-0.5 rounded-full pointer-events-none transition-all duration-300"
                style={{
                  background: isActive
                    ? `linear-gradient(to bottom, ${pin.accent}80, transparent)`
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Day Counter bottom-left ── */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 pointer-events-none">
        <div className="px-4 py-2 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Day</span>
          <div className="text-2xl font-bold text-white">
            {character?.streakDays ?? 0}
          </div>
        </div>
        {streakLabel && (
          <p className="text-xs text-slate-400 italic max-w-[160px] leading-relaxed">
            "{streakMultiplier > 1 ? 'Consistency builds legends.' : 'A small step today builds a greater tomorrow.'}"
          </p>
        )}
      </div>

      {/* ── Quick nav bottom-right ── */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => navigate('/quests')}
          className="px-5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-400 font-bold text-sm hover:bg-amber-500/25 transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md flex items-center gap-2"
        >
          <Sword className="w-4 h-4" /> Quest Log
        </button>
        <button
          onClick={() => navigate('/bosses')}
          className="px-5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-400 font-bold text-sm hover:bg-rose-500/25 transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md flex items-center gap-2"
        >
          <Skull className="w-4 h-4" /> Boss Arena
        </button>
      </div>
    </div>
  );
};

export default WorldPage;
