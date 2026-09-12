import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorldPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-10 text-center">
      <div className="glass-panel p-12 max-w-2xl w-full">
        <h1 className="fantasy-heading text-4xl mb-4">The Kingdom of {user?.displayName}</h1>
        <p className="text-slate-300 text-lg mb-8">
          Class: <span className="text-amber-400 font-bold">{user?.class}</span>
        </p>
        
        <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4 text-amber-500">World Map</h2>
          <p className="text-slate-400 mb-2">The world is currently peaceful. Your quests will shape its future.</p>
          <div className="h-32 bg-slate-800 rounded flex items-center justify-center border border-slate-700/50">
             <span className="text-slate-500 italic">Map loading...</span>
          </div>
        </div>

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
