import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCharacter } from '../contexts/CharacterContext';
import { LogOut, Map as MapIcon, Coins, Sparkles, BookOpen, Dumbbell, Brain, Leaf, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ATTRIBUTE_CONFIG = [
  { key: 'intelligence', label: 'Intelligence', icon: Brain,    color: 'text-purple-400', bar: 'bg-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  { key: 'strength',     label: 'Strength',     icon: Dumbbell, color: 'text-red-400',    bar: 'bg-red-500',    border: 'border-red-500/20',    bg: 'bg-red-500/10' },
  { key: 'wisdom',       label: 'Wisdom',       icon: BookOpen, color: 'text-blue-400',   bar: 'bg-blue-500',   border: 'border-blue-500/20',   bg: 'bg-blue-500/10' },
  { key: 'focus',        label: 'Focus',        icon: Eye,      color: 'text-emerald-400',bar: 'bg-emerald-500',border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  { key: 'vitality',     label: 'Vitality',     icon: Leaf,     color: 'text-amber-400',  bar: 'bg-amber-500',  border: 'border-amber-500/20',  bg: 'bg-amber-500/10' },
];

const WorldPage = () => {
  const { user, logout } = useAuth();
  const { character, isLoading, currentLevelXp, xpRequired, xpPercent } = useCharacter();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 relative z-10">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const maxAttr = Math.max(
    1,
    ...ATTRIBUTE_CONFIG.map(a => (character?.attributes as any)?.[a.key] ?? 0)
  );

  return (
    <div className="flex flex-col items-start justify-start w-full max-w-4xl mx-auto relative z-10 py-6 gap-6">

      {/* Hero Header */}
      <div className="glass-panel w-full p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-semibold">Kingdom of</p>
            <h1 className="fantasy-heading text-4xl font-bold text-white">{user?.displayName}</h1>
            <p className="text-slate-400 mt-1">Class: <span className="text-amber-400 font-semibold">{user?.class ?? 'Adventurer'}</span></p>
          </div>
          <div className="flex items-center gap-6">
            {/* Gold */}
            <div className="text-center">
              <div className="flex items-center gap-1.5 text-yellow-400 text-2xl font-bold">
                <Coins className="w-5 h-5" />
                {character?.gold ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Gold</p>
            </div>
            {/* Level */}
            <div className="text-center">
              <div className="text-amber-400 text-2xl font-bold">Lv {character?.level ?? 1}</div>
              <p className="text-xs text-slate-500 mt-0.5">Level</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative z-10 mt-6">
          <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Experience</span>
            </div>
            <span>{currentLevelXp} / {xpRequired} XP</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 rounded-full transition-all duration-1000 relative"
              style={{ width: `${xpPercent}%` }}
            >
              <div className="absolute inset-0 animate-pulse opacity-40 bg-white rounded-full" />
            </div>
          </div>
          <p className="text-right text-xs text-slate-500 mt-1">{xpPercent}% to Level {(character?.level ?? 1) + 1}</p>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        {/* Quests Panel */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
          <h2 className="text-lg font-bold mb-1 text-white flex items-center gap-2 relative z-10">
            <MapIcon className="w-5 h-5 text-amber-500" />
            Quest Log
          </h2>
          <p className="text-slate-400 text-sm mb-5 relative z-10">Track your active objectives.</p>
          <Link
            to="/quests"
            className="glass-button w-full text-center block bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-400 relative z-10"
          >
            Open Quest Log
          </Link>
        </div>

        {/* Attributes Panel */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Attributes</h2>
          <div className="space-y-3">
            {ATTRIBUTE_CONFIG.map(({ key, label, icon: Icon, color, bar, border, bg }) => {
              const val = (character?.attributes as any)?.[key] ?? 0;
              const pct = maxAttr > 0 ? Math.round((val / maxAttr) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </div>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${bg} ${border} border ${color}`}>{val}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleLogout}
          className="glass-button text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Leave Realm</span>
        </button>
      </div>
    </div>
  );
};

export default WorldPage;
