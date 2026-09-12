import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Plus, Loader2, Skull, Swords, Shield, Trash2, Trophy } from 'lucide-react';
import { useCharacter } from '../contexts/CharacterContext';

interface Boss {
  _id: string;
  title: string;
  description?: string;
  category: string;
  maxHp: number;
  currentHp: number;
  status: 'alive' | 'defeated';
  reward: { xp: number; gold: number };
  defeatedAt?: string;
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Coding: 'from-purple-900/50 to-purple-800/20 border-purple-500/30',
  Studying: 'from-blue-900/50 to-blue-800/20 border-blue-500/30',
  Fitness: 'from-red-900/50 to-red-800/20 border-red-500/30',
  Reading: 'from-emerald-900/50 to-emerald-800/20 border-emerald-500/30',
  Meditation: 'from-cyan-900/50 to-cyan-800/20 border-cyan-500/30',
  Health: 'from-pink-900/50 to-pink-800/20 border-pink-500/30',
  Personal: 'from-amber-900/50 to-amber-800/20 border-amber-500/30',
};

const HP_COLOR = (pct: number) => {
  if (pct > 50) return 'from-emerald-600 to-green-400';
  if (pct > 25) return 'from-amber-600 to-yellow-400';
  return 'from-red-700 to-red-400';
};

const CreateBossModal: React.FC<{ onClose: () => void; onCreate: (boss: Boss) => void }> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Personal',
    maxHp: 100,
    rewardXp: 500,
    rewardGold: 200,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const boss = await apiFetch('/bosses', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          category: form.category,
          maxHp: form.maxHp,
          reward: { xp: form.rewardXp, gold: form.rewardGold },
        }),
      });
      onCreate(boss);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-panel w-full max-w-lg p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <h2 className="fantasy-heading text-2xl font-bold mb-6 relative z-10">Summon New Boss</h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Boss Name</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="glass-input" required placeholder="e.g. Conquer Data Structures" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="glass-input resize-none" rows={2} placeholder="The challenge you must overcome..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="glass-input">
                {['Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">HP Pool</label>
              <input type="number" value={form.maxHp} onChange={e => setForm(p => ({ ...p, maxHp: parseInt(e.target.value) || 100 }))} className="glass-input" min={10} max={10000} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Defeat Reward XP</label>
              <input type="number" value={form.rewardXp} onChange={e => setForm(p => ({ ...p, rewardXp: parseInt(e.target.value) || 500 }))} className="glass-input" min={0} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Defeat Reward Gold</label>
              <input type="number" value={form.rewardGold} onChange={e => setForm(p => ({ ...p, rewardGold: parseInt(e.target.value) || 200 }))} className="glass-input" min={0} />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={isSaving} className="flex-1 glass-button bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 py-3 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Skull className="w-5 h-5" />}
              Summon Boss
            </button>
            <button type="button" onClick={onClose} className="glass-button px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BossCard: React.FC<{ boss: Boss; onDelete: (id: string) => void }> = ({ boss, onDelete }) => {
  const hpPct = Math.round((boss.currentHp / boss.maxHp) * 100);
  const cardGradient = CATEGORY_COLORS[boss.category] ?? CATEGORY_COLORS.Personal;
  const isDefeated = boss.status === 'defeated';

  return (
    <div className={`glass-panel p-6 relative overflow-hidden border bg-gradient-to-br ${cardGradient} ${isDefeated ? 'opacity-60' : ''}`}>
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Skull className="w-32 h-32 text-red-400" />
      </div>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{boss.category}</span>
          <h3 className="text-xl font-bold text-white mt-1">{boss.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isDefeated && <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">Defeated</span>}
          <button onClick={() => onDelete(boss._id)} className="text-slate-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {boss.description && <p className="text-sm text-slate-400 mb-4 relative z-10">{boss.description}</p>}

      {/* HP Bar */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5" />
            <span>HP</span>
          </div>
          <span className={`font-bold ${hpPct <= 25 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            {boss.currentHp} / {boss.maxHp}
          </span>
        </div>
        <div className="h-4 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className={`h-full bg-gradient-to-r ${HP_COLOR(hpPct)} rounded-full transition-all duration-1000 relative`}
            style={{ width: `${hpPct}%` }}
          >
            {hpPct > 10 && (
              <div className="absolute inset-0 animate-pulse opacity-20 bg-white rounded-full" />
            )}
          </div>
        </div>
        {!isDefeated && (
          <p className="text-xs text-slate-500 mt-1">Complete <span className="text-slate-300 font-semibold">{boss.category}</span> quests to deal damage</p>
        )}
      </div>

      {/* Reward */}
      <div className="flex items-center gap-4 text-sm relative z-10">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Swords className="w-4 h-4" />
          <span className="font-semibold">{boss.reward.xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400">
          <Trophy className="w-4 h-4" />
          <span className="font-semibold">{boss.reward.gold} Gold</span>
        </div>
        <span className="text-slate-500 text-xs ml-auto">on defeat</span>
      </div>
    </div>
  );
};

const BossesPage = () => {
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [defeatedModal, setDefeatedModal] = useState<Boss | null>(null);

  useEffect(() => {
    fetchBosses();
  }, []);

  const fetchBosses = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/bosses');
      setBosses(data);
    } catch (err) {
      console.error('Failed to fetch bosses', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (boss: Boss) => {
    setBosses(prev => [boss, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Abandon this boss battle?')) return;
    try {
      await apiFetch(`/bosses/${id}`, { method: 'DELETE' });
      setBosses(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('Failed to delete boss', err);
    }
  };

  const alive = bosses.filter(b => b.status === 'alive');
  const defeated = bosses.filter(b => b.status === 'defeated');

  return (
    <div className="w-full max-w-4xl mx-auto py-8">

      {/* Boss Defeated Modal */}
      {defeatedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDefeatedModal(null)}>
          <div className="glass-panel p-12 text-center max-w-md w-full mx-4 border-amber-500/30 shadow-[0_0_80px_-10px_rgba(245,158,11,0.4)]">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="fantasy-heading text-3xl font-bold mb-2">Boss Defeated!</h2>
            <p className="text-slate-300 text-lg mb-1">{defeatedModal.title}</p>
            <p className="text-slate-400 text-sm mb-6">The battle is over. Victory is yours.</p>
            <div className="flex justify-center gap-6 text-lg font-bold">
              <span className="text-blue-400">+{defeatedModal.reward.xp} XP</span>
              <span className="text-yellow-400">+{defeatedModal.reward.gold} Gold</span>
            </div>
            <button onClick={() => setDefeatedModal(null)} className="glass-button mt-8 bg-amber-500/10 border-amber-500/30 text-amber-400">
              Claim Victory
            </button>
          </div>
        </div>
      )}

      {showModal && <CreateBossModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="fantasy-heading text-4xl mb-1 text-white">Boss Arena</h1>
          <p className="text-slate-400 text-sm">Summon long-term challenges. Slay them with quests.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button bg-red-500/15 border-red-500/30 hover:bg-red-500/25 text-red-400 flex items-center gap-2 flex-shrink-0">
          <Skull className="w-4 h-4" />
          Summon Boss
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>
      ) : bosses.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-5xl mb-4">👹</div>
          <p className="text-slate-400 mb-4 text-lg">No bosses yet. Summon a long-term challenge.</p>
          <button onClick={() => setShowModal(true)} className="glass-button bg-red-500/10 border-red-500/30 text-red-400">
            Summon your first boss
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {alive.length > 0 && (
            <div>
              <h2 className="text-slate-300 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Skull className="w-4 h-4 text-red-400" /> Active Battles ({alive.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alive.map(boss => <BossCard key={boss._id} boss={boss} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
          {defeated.length > 0 && (
            <div>
              <h2 className="text-slate-400 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500" /> Defeated ({defeated.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defeated.map(boss => <BossCard key={boss._id} boss={boss} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BossesPage;
