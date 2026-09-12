import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Quest, QuestCard } from '../components/QuestCard';
import { Plus, Loader2, Sparkles, Coins, ArrowUpCircle, Sword, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCharacter } from '../contexts/CharacterContext';

type Tab = 'active' | 'completed';

const QuestsPage = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [rewardToast, setRewardToast] = useState<any>(null);
  const navigate = useNavigate();
  const { applyReward } = useCharacter();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/quests');
      setQuests(data);
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    // Optimistic UI update
    setQuests(q => q.map(quest => quest._id === id ? { ...quest, status: 'completed' } : quest));

    try {
      const response = await apiFetch(`/quests/${id}/complete`, { method: 'POST' });

      // Push reward into CharacterContext so nav XP bar updates instantly
      if (response.character) {
        applyReward({ character: response.character });
      }

      // Show reward toast
      setRewardToast({
        xp: response.reward.xp,
        gold: response.reward.gold,
        levelUp: response.levelUp,
        newLevel: response.newLevel,
      });

      setTimeout(() => setRewardToast(null), 5000);
    } catch (error) {
      // Revert optimistic update on failure
      fetchQuests();
    }
  };

  const filtered = quests.filter(q => q.status === (activeTab === 'active' ? 'active' : 'completed'));

  const activeCount = quests.filter(q => q.status === 'active').length;
  const completedCount = quests.filter(q => q.status === 'completed').length;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 relative">

      {/* Reward Toast */}
      {rewardToast && (
        <div className="fixed top-24 right-6 z-50">
          <div className="glass-panel p-5 border-amber-500/40 shadow-[0_0_40px_-5px_rgba(245,158,11,0.3)] min-w-[220px]">
            {rewardToast.levelUp && (
              <div className="text-amber-400 font-bold text-base mb-3 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5" />
                Level Up! → Level {rewardToast.newLevel}
              </div>
            )}
            <div className="flex items-center gap-5 text-sm font-semibold">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Sparkles className="w-4 h-4" />
                +{rewardToast.xp} XP
              </div>
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Coins className="w-4 h-4" />
                +{rewardToast.gold} Gold
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="fantasy-heading text-4xl mb-1 text-white">Quest Log</h1>
          <p className="text-slate-400 text-sm">Complete objectives to earn XP and Gold.</p>
        </div>
        <button
          onClick={() => navigate('/quests/new')}
          className="glass-button bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25 text-amber-400 flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-900/60 rounded-xl border border-slate-700/50 w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'active'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sword className="w-4 h-4" />
          Active
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-700 text-slate-400'}`}>
            {activeCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'completed'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'completed' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* Quest Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-4xl mb-3">{activeTab === 'active' ? '⚔️' : '🏆'}</div>
          {activeTab === 'active' ? (
            <>
              <p className="text-slate-400 mb-4 text-lg">No active quests. What will you conquer next?</p>
              <button
                onClick={() => navigate('/quests/new')}
                className="glass-button bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              >
                Forge your first quest
              </button>
            </>
          ) : (
            <p className="text-slate-400 text-lg">No completed quests yet. Start your journey!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(quest => (
            <QuestCard
              key={quest._id}
              quest={quest}
              onComplete={quest.status === 'active' ? handleComplete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
