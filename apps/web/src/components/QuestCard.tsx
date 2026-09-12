import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sword, Terminal, BookOpen, Dumbbell, Book, Brain, Heart, User, CheckCircle2, Sparkles, Coins, Zap } from 'lucide-react';

export interface Quest {
  _id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  status: string;
  dueDate?: string;
  createdAt: string;
}

interface QuestCardProps {
  quest: Quest;
  onComplete?: (id: string) => void;
  /** If true, plays a flash animation (used after completion) */
  flash?: boolean;
}

// ── Config maps ──────────────────────────────
const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; xp: number; gold: number }> = {
  Easy:   { label: 'Easy',   color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30',  xp: 50,  gold: 20 },
  Medium: { label: 'Medium', color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30',   xp: 100, gold: 40 },
  Hard:   { label: 'Hard',   color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30',  xp: 200, gold: 80 },
  Epic:   { label: 'Epic',   color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', xp: 500, gold: 200 },
};

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; glow: string }> = {
  Coding:     { icon: Terminal,  color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', glow: 'rgba(167,139,250,0.15)' },
  Studying:   { icon: Brain,     color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   glow: 'rgba(96,165,250,0.15)'  },
  Fitness:    { icon: Dumbbell,  color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20',    glow: 'rgba(248,113,113,0.15)' },
  Reading:    { icon: Book,      color: 'text-emerald-400',bg: 'bg-emerald-400/10',border: 'border-emerald-400/20',glow: 'rgba(52,211,153,0.15)'  },
  Meditation: { icon: BookOpen,  color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/20',   glow: 'rgba(34,211,238,0.15)'  },
  Health:     { icon: Heart,     color: 'text-pink-400',   bg: 'bg-pink-400/10',   border: 'border-pink-400/20',   glow: 'rgba(244,114,182,0.15)' },
  Personal:   { icon: User,      color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  glow: 'rgba(251,191,36,0.15)'  },
};

const FALLBACK_CATEGORY = { icon: User, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', glow: 'rgba(148,163,184,0.1)' };
const FALLBACK_DIFF = DIFFICULTY_CONFIG.Medium;

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, flash }) => {
  const [completing, setCompleting] = useState(false);

  const diff = DIFFICULTY_CONFIG[quest.difficulty] ?? FALLBACK_DIFF;
  const cat = CATEGORY_CONFIG[quest.category] ?? FALLBACK_CATEGORY;
  const CategoryIcon = cat.icon;
  const isCompleted = quest.status === 'completed';

  const handleComplete = async () => {
    if (!onComplete || completing) return;
    setCompleting(true);
    await onComplete(quest._id);
    // completing state stays true – the parent list will remove/dim this card
  };

  // Compute relative date
  const relativeDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.round((d.getTime() - now.getTime()) / 86400000);
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays > 0) return `Due in ${diffDays}d`;
    return `${Math.abs(diffDays)}d overdue`;
  };

  const isOverdue = quest.dueDate && new Date(quest.dueDate) < new Date() && !isCompleted;

  return (
    <div
      className={`
        group relative rounded-2xl border overflow-hidden transition-all duration-300
        ${isCompleted
          ? 'opacity-50 bg-slate-900/40 border-slate-800/50'
          : `bg-slate-900/60 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)]`
        }
        ${flash ? 'animate-pulse' : ''}
        ${completing ? 'scale-95 opacity-70' : ''}
      `}
      style={{
        borderColor: isCompleted ? 'rgba(100,116,139,0.2)' : `rgba(255,255,255,0.08)`,
        boxShadow: !isCompleted ? `inset 0 0 80px -40px ${cat.glow}` : 'none',
      }}
    >
      {/* Category color stripe at top */}
      {!isCompleted && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
          style={{ background: `linear-gradient(to right, transparent, ${cat.glow.replace('0.15', '1')}, transparent)` }}
        />
      )}

      {/* Difficulty glow blob */}
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl pointer-events-none opacity-20 ${diff.color}`}
      />

      <div className="p-5 relative z-10">
        {/* ── Row 1: Category + Difficulty ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${cat.bg} ${cat.border} border`}>
              <CategoryIcon className={`w-3.5 h-3.5 ${cat.color}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${cat.color}`}>{quest.category}</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${diff.color} ${diff.bg} ${diff.border}`}>
            {diff.label}
          </span>
        </div>

        {/* ── Row 2: Title + Description ── */}
        <div className="mb-4">
          <h3 className={`text-base font-bold leading-snug mb-1 ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
            {quest.title}
          </h3>
          {quest.description && (
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{quest.description}</p>
          )}
        </div>

        {/* ── Row 3: Reward Preview ── */}
        {!isCompleted && (
          <div className="flex items-center gap-4 mb-4 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3 h-3" />
              +{diff.xp} XP
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400">
              <Coins className="w-3 h-3" />
              +{diff.gold} Gold
            </div>
            {quest.dueDate && (
              <div className={`flex items-center gap-1.5 text-xs font-semibold ml-auto ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                <Calendar className="w-3 h-3" />
                {relativeDate(quest.dueDate)}
              </div>
            )}
          </div>
        )}

        {/* ── Row 4: Actions ── */}
        <div className="flex items-center justify-between gap-2">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
          ) : (
            onComplete && (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: completing ? 'rgba(245,158,11,0.05)' : 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#f59e0b',
                  boxShadow: completing ? 'none' : '0 0 20px rgba(245,158,11,0.15)',
                }}
              >
                {completing ? (
                  <Zap className="w-4 h-4 animate-spin" />
                ) : (
                  <Sword className="w-4 h-4" />
                )}
                {completing ? 'Completing…' : 'Mark Complete'}
              </button>
            )
          )}
          <Link
            to={`/quests/${quest._id}`}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 transition-all duration-200 hover:scale-105"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
