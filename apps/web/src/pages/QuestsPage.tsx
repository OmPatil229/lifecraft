import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { type Quest, QuestCard } from '../components/QuestCard';
import {
  Plus, Loader2, Sparkles, Coins, Sword,
  Flame, Star, X, Brain, Dumbbell, BookOpen, Book, Heart, User, Briefcase
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCharacter } from '../contexts/CharacterContext';

import { StreakHeatmap } from '../components/StreakHeatmap';

// ── Category filter config ───────────────────
const CATEGORIES = [
  { label: 'All', value: '', icon: Star },
  { label: 'Work', value: 'Work', icon: Briefcase },
  { label: 'Studying', value: 'Studying', icon: Brain },
  { label: 'Fitness', value: 'Fitness', icon: Dumbbell },
  { label: 'Reading', value: 'Reading', icon: Book },
  { label: 'Meditation', value: 'Meditation', icon: BookOpen },
  { label: 'Health', value: 'Health', icon: Heart },
  { label: 'Personal', value: 'Personal', icon: User },
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Epic'];

type Tab = 'active' | 'completed';

// ── Quest Complete Modal ─────────────────────
const QuestCompleteModal: React.FC<{
  reward: any;
  onClose: () => void;
}> = ({ reward, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-sm mx-4 rounded-3xl border border-amber-500/30 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,10,5,0.97), rgba(20,15,5,0.97))',
        boxShadow: '0 0 80px 10px rgba(245,158,11,0.25), 0 30px 80px rgba(0,0,0,0.8)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 p-8 text-center">
        {/* Icon */}
        <div className="text-6xl mb-3">⚔️</div>
        <h2 className="text-2xl font-bold text-white mb-1">Quest Complete!</h2>
        <p className="text-slate-400 text-sm mb-6">Your legend grows stronger.</p>

        {/* Rewards */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xl font-bold text-blue-400">+{reward.xp}</span>
            <span className="text-xs text-slate-500">XP</span>
            {reward.bonusXp > 0 && (
              <span className="text-[10px] text-orange-400 font-bold">(+{reward.bonusXp} streak)</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Coins className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xl font-bold text-yellow-400">+{reward.gold}</span>
            <span className="text-xs text-slate-500">Gold</span>
          </div>
        </div>

        {/* Streak */}
        {reward.streakDays > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-300">
              {reward.streakDays} Day Streak
            </span>
            {reward.multiplier > 1 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                {reward.multiplier}× XP
              </span>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 transition-all duration-200 hover:scale-105"
        >
          Continue Journey
        </button>
      </div>
    </div>
  </div>
);

// ── Level Up Modal ───────────────────────────
const LevelUpModal: React.FC<{
  newLevel: number;
  onClose: () => void;
}> = ({ newLevel, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(10,5,25,0.98), rgba(20,10,40,0.98))',
        boxShadow: '0 0 120px 20px rgba(139,92,246,0.35), 0 30px 80px rgba(0,0,0,0.9)',
        border: '1px solid rgba(139,92,246,0.4)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Purple glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
      {/* Stars */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-ping pointer-events-none opacity-60"
          style={{
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 15}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}

      <div className="relative z-10 p-8">
        <div className="text-5xl mb-4">✨</div>

        <div className="text-xs uppercase tracking-[0.4em] text-purple-400 font-bold mb-2">Level Up!</div>

        <div
          className="text-8xl font-black my-4 tabular-nums"
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8, #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.5))',
          }}
        >
          {newLevel}
        </div>

        <p className="text-slate-300 mb-2 font-semibold">A new chapter begins.</p>
        <p className="text-slate-500 text-sm mb-8">Your kingdom grows stronger with every effort.</p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3))',
            border: '1px solid rgba(139,92,246,0.5)',
            boxShadow: '0 0 30px rgba(139,92,246,0.2)',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  </div>
);

// ── Create Quest Modal ───────────────────────
const CreateQuestModal: React.FC<{
  onClose: () => void;
  onCreate: (quest: Quest) => void;
}> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Personal', difficulty: 'Medium', dueDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const quest = await apiFetch('/quests', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          category: form.category,
          difficulty: form.difficulty,
          dueDate: form.dueDate || undefined,
        }),
      });
      onCreate(quest);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(10,12,20,0.97)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Forge New Quest</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Quest Title</label>
              <input
                value={form.title} required
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="glass-input"
                placeholder="What will you conquer?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="glass-input resize-none" rows={2}
                placeholder="Describe your objective..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="glass-input">
                  {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} className="glass-input">
                  {DIFFICULTIES.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Due Date (optional)</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="glass-input" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={isSaving}
                className="flex-1 py-3 rounded-xl font-bold text-amber-400 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.4)' }}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sword className="w-4 h-4" />}
                {isSaving ? 'Forging…' : 'Forge Quest'}
              </button>
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 bg-slate-800/60 border border-slate-700/40 hover:bg-slate-700/60 font-semibold transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── QuestsPage ───────────────────────────────
const QuestsPage = () => {
  const [searchParams] = useSearchParams();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') || '');
  const [diffFilter, setDiffFilter] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);
  const [questModal, setQuestModal] = useState(false);
  const [completeModal, setCompleteModal] = useState<any>(null);
  const [levelUpModal, setLevelUpModal] = useState<number | null>(null);
  const { applyReward } = useCharacter();

  const fetchQuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/quests');
      setQuests(data);
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuests(); }, [fetchQuests]);

  const handleComplete = async (id: string) => {
    setQuests(q => q.map(quest => quest._id === id ? { ...quest, status: 'completed' } : quest));
    try {
      const response = await apiFetch(`/quests/${id}/complete`, { method: 'POST' });
      if (response.character) applyReward({ character: response.character });

      // Show level-up modal first if applicable, then quest complete modal
      if (response.levelUp) {
        setLevelUpModal(response.newLevel);
      } else {
        setCompleteModal({
          xp: response.reward.xp,
          baseXp: response.reward.baseXp,
          bonusXp: response.reward.bonusXp ?? 0,
          multiplier: response.reward.multiplier ?? 1,
          gold: response.reward.gold,
          streakDays: response.streak?.days ?? 0,
        });
      }
    } catch {
      fetchQuests();
    }
  };

  const handleLevelUpClose = () => {
    setLevelUpModal(null);
    // After closing level-up, show the regular reward modal if we have a pending one
    setCompleteModal((prev: any) => prev || null);
  };

  const filtered = quests
    .filter(q => q.status === (activeTab === 'active' ? 'active' : 'completed'))
    .filter(q => !categoryFilter || q.category === categoryFilter)
    .filter(q => diffFilter === 'All' || q.difficulty === diffFilter);

  const activeCount = quests.filter(q => q.status === 'active').length;
  const completedCount = quests.filter(q => q.status === 'completed').length;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 relative">
      {/* Modals */}
      {levelUpModal && <LevelUpModal newLevel={levelUpModal} onClose={handleLevelUpClose} />}
      {completeModal && <QuestCompleteModal reward={completeModal} onClose={() => setCompleteModal(null)} />}
      {questModal && <CreateQuestModal onClose={() => setQuestModal(false)} onCreate={q => setQuests(p => [q, ...p])} />}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Quest Log
          </h1>
          <p className="text-slate-400 text-sm">Complete real-world objectives to earn XP and Gold.</p>
        </div>
        <button
          onClick={() => setQuestModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))',
            border: '1px solid rgba(245,158,11,0.4)',
            color: '#f59e0b',
            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
          }}
        >
          <Plus className="w-4 h-4" />
          Forge Quest
        </button>
      </div>

      {/* ── GitHub-Style Streak Maintainer Heatmap ── */}
      <div className="mb-8">
        <StreakHeatmap />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-5 p-1 bg-slate-900/60 rounded-xl border border-slate-800/50 w-fit backdrop-blur-sm">
        {([['active', '⚔️', activeCount], ['completed', '🏆', completedCount]] as const).map(([tab, emoji, count]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === tab
                ? tab === 'active'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{emoji}</span>
            {tab === 'active' ? 'Active' : 'Completed'}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab
                ? tab === 'active' ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 text-slate-500'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {/* Category chips */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.value}
                onClick={() => setCategoryFilter(c.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                  categoryFilter === c.value
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty chips */}
        <div className="flex gap-1.5 flex-wrap sm:ml-auto">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                diffFilter === d
                  ? 'bg-slate-700/80 text-slate-200 border-slate-600/50'
                  : 'text-slate-500 border-slate-800/50 hover:text-slate-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quest Grid ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-slate-500 text-sm">Loading your quests…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-slate-800/50 bg-slate-900/30">
          <div className="text-5xl mb-4">{activeTab === 'active' ? '⚔️' : '🏆'}</div>
          {activeTab === 'active' ? (
            <>
              <p className="text-slate-300 font-semibold text-lg mb-1">No quests match your filters</p>
              <p className="text-slate-500 text-sm mb-6">
                {categoryFilter || diffFilter !== 'All' ? 'Try clearing your filters.' : 'What will you conquer next?'}
              </p>
              <button
                onClick={() => setQuestModal(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-amber-400 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 transition-all"
              >
                Forge your first quest
              </button>
            </>
          ) : (
            <p className="text-slate-400">No completed quests here yet. Keep going!</p>
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
