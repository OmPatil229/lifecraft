import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Sword } from 'lucide-react';

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

const difficultyColors: Record<string, string> = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Hard: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Epic: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const diffColor = difficultyColors[quest.difficulty] || difficultyColors.Medium;

  return (
    <div className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
      {/* Decorative glow based on difficulty */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20 rounded-full ${diffColor.split(' ')[0]}`}></div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{quest.category}</span>
          <h3 className="text-lg font-bold text-slate-200 mt-1">{quest.title}</h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${diffColor}`}>
          {quest.difficulty}
        </span>
      </div>
      
      {quest.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{quest.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {quest.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(quest.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(quest.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {quest.status === 'active' && onComplete && (
            <button 
              onClick={() => onComplete(quest._id)}
              className="text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-sm"
            >
              <Sword className="w-4 h-4" />
              Complete
            </button>
          )}
          <Link 
            to={`/quests/${quest._id}`}
            className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
