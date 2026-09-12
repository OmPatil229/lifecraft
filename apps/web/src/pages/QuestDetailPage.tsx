import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react';

const QuestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    difficulty: 'Medium',
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchQuest();
    }
  }, [id]);

  const fetchQuest = async () => {
    try {
      // The backend returns a list in /quests, so if we don't have a GET /quests/:id,
      // we can fetch all and find it, or we should add GET /quests/:id.
      // Since we didn't add GET /quests/:id, let's fetch all and filter.
      const quests = await apiFetch('/quests');
      const quest = quests.find((q: any) => q._id === id);
      
      if (quest) {
        setFormData({
          title: quest.title,
          description: quest.description || '',
          category: quest.category,
          difficulty: quest.difficulty,
          dueDate: quest.dueDate ? new Date(quest.dueDate).toISOString().split('T')[0] : '',
        });
      } else {
        setError('Quest not found');
      }
    } catch (err) {
      setError('Failed to load quest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      if (isNew) {
        await apiFetch('/quests', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/quests/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      }
      navigate('/quests');
    } catch (err: any) {
      setError(err.message || 'Failed to save quest');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to abandon this quest?')) return;
    
    setIsSaving(true);
    try {
      await apiFetch(`/quests/${id}`, { method: 'DELETE' });
      navigate('/quests');
    } catch (err: any) {
      setError(err.message || 'Failed to delete quest');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <button 
        onClick={() => navigate('/quests')}
        className="text-slate-400 hover:text-slate-200 flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quests
      </button>

      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <h1 className="fantasy-heading text-3xl mb-6 text-white relative z-10">
          {isNew ? 'Forge New Quest' : 'Edit Quest'}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
              required
              placeholder="e.g. Defeat the Math Exam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
              placeholder="Details about your objective..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
              >
                <option value="Coding">Coding</option>
                <option value="Studying">Studying</option>
                <option value="Fitness">Fitness</option>
                <option value="Reading">Reading</option>
                <option value="Meditation">Meditation</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Epic">Epic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Due Date (Optional)</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 glass-button bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 py-3 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Save className="w-5 h-5 text-amber-500" />}
              <span>{isNew ? 'Create Quest' : 'Save Changes'}</span>
            </button>

            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="px-6 glass-button bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestDetailPage;
