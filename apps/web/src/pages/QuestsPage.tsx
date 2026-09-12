import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Quest, QuestCard } from '../components/QuestCard';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestsPage = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
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
    try {
      // Optimistic update
      setQuests(q => q.map(quest => quest._id === id ? { ...quest, status: 'completed' } : quest));
      await apiFetch(`/quests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed', completedAt: new Date().toISOString() }),
      });
    } catch (error) {
      // Revert on failure
      fetchQuests();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="fantasy-heading text-4xl mb-2 text-white">Your Quests</h1>
          <p className="text-slate-400">Complete quests to earn XP and Gold.</p>
        </div>
        <button 
          onClick={() => navigate('/quests/new')}
          className="glass-button bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30 text-amber-400 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Quest</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : quests.length === 0 ? (
        <div className="glass-panel p-12 text-center border-dashed">
          <p className="text-slate-400 mb-4">Your quest log is empty.</p>
          <button 
            onClick={() => navigate('/quests/new')}
            className="text-amber-500 hover:text-amber-400 underline"
          >
            Create your first quest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map(quest => (
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
