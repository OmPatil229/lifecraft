import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Map as MapIcon, Loader2, Coins } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

const WorldPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<any>(null);
  const [activeQuests, setActiveQuests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [charData, questsData] = await Promise.all([
          apiFetch('/character'),
          apiFetch('/quests')
        ]);
        setCharacter(charData);
        setActiveQuests(questsData.filter((q: any) => q.status === 'active').length);
      } catch (error) {
        console.error('Failed to load world data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full relative z-10">
      <div className="glass-panel p-12 w-full text-center relative overflow-hidden">
        {/* World Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="fantasy-heading text-4xl mb-4 text-white relative z-10">
          The Kingdom of {user?.displayName}
        </h1>
        
        <div className="flex justify-center gap-6 mb-8 relative z-10">
          <div className="text-slate-300">
            Class: <span className="text-amber-400 font-bold">{user?.class}</span>
          </div>
          <div className="text-slate-300">
            Level: <span className="text-amber-400 font-bold">{character?.level || 1}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 font-bold">{character?.gold || 0}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
          {/* Active Quests Panel */}
          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 text-left hover:border-amber-500/30 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-amber-500" />
              Active Quests
            </h2>
            <p className="text-slate-400 mb-6">
              You have <span className="text-amber-500 font-bold">{activeQuests}</span> active objectives.
            </p>
            <Link 
              to="/quests"
              className="inline-block w-full text-center glass-button bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
            >
              Open Quest Log
            </Link>
          </div>

          {/* Character Attributes */}
          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 text-left hover:border-amber-500/30 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-white">Attributes</h2>
            <div className="space-y-3">
              {['intelligence', 'strength', 'wisdom', 'focus', 'vitality'].map(attr => (
                <div key={attr} className="flex justify-between items-center">
                  <span className="text-slate-400 capitalize text-sm">{attr}</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {character?.attributes?.[attr] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="glass-button text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 inline-flex items-center gap-2 relative z-10"
        >
          <LogOut className="w-4 h-4" />
          <span>Leave Realm</span>
        </button>
      </div>
    </div>
  );
};

export default WorldPage;
