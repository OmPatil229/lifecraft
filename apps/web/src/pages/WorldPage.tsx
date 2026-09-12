import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCharacter } from '../contexts/CharacterContext';
import { Map as MapIcon, Coins, Sparkles, BookOpen, Dumbbell, Brain, Leaf, Eye, Loader2, Flame, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PINS = [
  {
    id: 'castle',
    label: 'The Castle',
    type: 'level',
    x: '50%',
    y: '25%',
    icon: Shield,
    color: 'text-amber-400',
    border: 'border-amber-400/50',
    bg: 'bg-amber-400/10',
  },
  {
    id: 'observatory',
    label: 'Observatory',
    type: 'attribute',
    attribute: 'focus',
    x: '82%',
    y: '28%',
    icon: Eye,
    color: 'text-emerald-400',
    border: 'border-emerald-400/50',
    bg: 'bg-emerald-400/10',
  },
  {
    id: 'forest',
    label: 'Ancient Forest',
    type: 'attribute',
    attribute: 'wisdom',
    x: '18%',
    y: '45%',
    icon: Leaf,
    color: 'text-green-400',
    border: 'border-green-400/50',
    bg: 'bg-green-400/10',
  },
  {
    id: 'training',
    label: 'Training Grounds',
    type: 'attribute',
    attribute: 'strength',
    x: '75%',
    y: '58%',
    icon: Dumbbell,
    color: 'text-red-400',
    border: 'border-red-400/50',
    bg: 'bg-red-400/10',
  },
  {
    id: 'library',
    label: 'Grand Library',
    type: 'attribute',
    attribute: 'intelligence',
    x: '35%',
    y: '65%',
    icon: Brain,
    color: 'text-purple-400',
    border: 'border-purple-400/50',
    bg: 'bg-purple-400/10',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    type: 'gold',
    x: '52%',
    y: '85%',
    icon: Coins,
    color: 'text-yellow-400',
    border: 'border-yellow-400/50',
    bg: 'bg-yellow-400/10',
  },
];

const WorldPage = () => {
  const { user } = useAuth();
  const { character, isLoading, currentLevelXp, xpRequired, xpPercent, streakLabel, streakMultiplier } = useCharacter();
  const navigate = useNavigate();
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  const renderPinContent = (pin: typeof PINS[0]) => {
    if (pin.type === 'level') {
      return (
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-1">Level {character?.level || 1}</span>
          <div className="w-24 h-1.5 bg-slate-900/60 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-amber-400" style={{ width: `${xpPercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-400">{currentLevelXp} / {xpRequired} XP</span>
        </div>
      );
    }
    if (pin.type === 'attribute') {
      const val = character?.attributes?.[pin.attribute as keyof typeof character.attributes] || 0;
      return (
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-lg text-white">Lv. {Math.floor(val / 10) + 1}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-sm ${pin.bg} ${pin.color}`}>{val} pts</span>
        </div>
      );
    }
    if (pin.type === 'gold') {
      return (
        <div className="flex items-center gap-1.5 font-bold text-yellow-400">
          <span className="text-lg">{character?.gold || 0}</span>
          <span className="text-xs text-yellow-500/70">Gold</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-0 bg-slate-950 overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/images/world-map-bg.jpg')", filter: 'brightness(0.85)' }}
      />

      {/* Floating HUD overlay (since we broke out of App.tsx padding, we need to add our own top padding to avoid the nav bar) */}
      <div className="absolute inset-0 pointer-events-none pt-24 px-6 flex justify-between items-start">
        {/* Streak Banner */}
        <div className="pointer-events-auto">
          {(character?.streakDays ?? 0) > 0 && (
            <div className={`flex flex-col gap-1 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
              (character?.streakDays ?? 0) >= 3
                ? 'bg-orange-950/40 border-orange-500/40'
                : 'bg-slate-900/60 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2">
                <Flame className={`w-6 h-6 ${ (character?.streakDays ?? 0) >= 3 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-lg font-bold text-slate-100">{streakLabel}</span>
              </div>
              {streakMultiplier > 1 && (
                <span className="text-xs font-bold text-orange-300">
                  {streakMultiplier}× Global XP Multiplier Active
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quest Shortcut */}
        <div className="pointer-events-auto flex flex-col gap-3">
          <button 
            onClick={() => navigate('/quests')}
            className="glass-panel p-4 flex items-center gap-3 hover:bg-white/10 transition-colors border-white/20 group cursor-pointer backdrop-blur-xl"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <MapIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-sm">Embark on Quests</h3>
              <p className="text-xs text-slate-300">Build your kingdom</p>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Map Pins */}
      <div className="absolute inset-0 pt-20">
        <div className="relative w-full h-full max-w-[1600px] mx-auto">
          {PINS.map((pin) => {
            const Icon = pin.icon;
            const isHovered = hoveredPin === pin.id;
            
            return (
              <div
                key={pin.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300"
                style={{ left: pin.x, top: pin.y }}
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* Hover/Active Glass Panel */}
                <div className={`
                  mb-2 glass-panel p-3 min-w-[140px] flex flex-col items-center border shadow-2xl backdrop-blur-xl
                  transition-all duration-300 transform origin-bottom
                  ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}
                  ${pin.border}
                `}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className={`w-4 h-4 ${pin.color}`} />
                    <span className="text-sm font-bold text-white whitespace-nowrap">{pin.label}</span>
                  </div>
                  {renderPinContent(pin)}
                </div>

                {/* Map Pin Anchor */}
                <div className={`
                  w-4 h-4 rounded-full border-2 bg-slate-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]
                  transition-colors duration-300
                  ${isHovered ? pin.border.replace('border-', 'bg-').replace('/50', '') : 'border-white/50'}
                `} />
                <div className="w-1 h-8 bg-gradient-to-b from-white/30 to-transparent -mt-1 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldPage;
