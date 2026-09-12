import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sword, Terminal, BookOpen, Dumbbell, Book, Brain, Heart, User, CheckCircle2 } from 'lucide-react';

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
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy:   'text-green-400  bg-green-400/10  border-green-400/20',
  Medium: 'text-blue-400   bg-blue-400/10   border-blue-400/20',
  Hard:   'text-amber-400  bg-amber-400/10  border-amber-400/20',
  Epic:   'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Coding:     Terminal,
  Studying:   Brain,
  Fitness:    Dumbbell,
  Reading:    Book,
  Meditation: BookOpen,
  Health:     Heart,
  Personal:   User,
};

const CATEGORY_COLORS: Record<string, string> = {
  Coding:     'text-purple-400',
  Studying:   'text-blue-400',
  Fitness:    'text-red-400',
  Reading:    'text-emerald-400',
  Meditation: 'text-cyan-400',
  Health:     'text-pink-400',
  Personal:   'text-amber-400',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const diffStyle = DIFFICULTY_STYLES[quest.difficulty] ?? DIFFICULTY_STYLES.Medium;
  const CategoryIcon = CATEGORY_ICONS[quest.category] ?? User;
  const categoryColor = CATEGORY_COLORS[quest.category] ?? 'text-slate-400';
  const isCompleted = quest.status === 'completed';

  return (
    <div className={`glass-panel p-5 relative overflow-hidden group transition-all duration-300 ${isCompleted ? 'opacity-60' : 'hover:border-amber-500/30'}`}>
      {/* Subtle difficulty glow */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 blur-3xl opacity-15 rounded-full pointer-events-none ${diffStyle.split(' ')[0]}`} />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50`}>
            <CategoryIcon className={`w-4 h-4 ${categoryColor}`} />
          </div>
          <span className={`text-xs font-semibold tracking-wider uppercase ${categoryColor}`}>{quest.category}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${diffStyle}`}>
          {quest.difficulty}
        </span>
      </div>

      <div className="relative z-10 mb-3">
        <h3 className={`text-base font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {quest.title}
        </h3>
        {quest.description && (
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{quest.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 relative z-10">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {quest.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(quest.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isCompleted ? (
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Done</span>
            </div>
          ) : (
            onComplete && (
              <button
                onClick={() => onComplete(quest._id)}
                className="text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-sm font-semibold border border-amber-500/20"
              >
                <Sword className="w-3.5 h-3.5" />
                Complete
              </button>
            )
          )}
          <Link
            to={`/quests/${quest._id}`}
            className="text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors text-sm border border-slate-700/50"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};
