import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, UserPlus, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  
  const { signup, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    try {
      await signup({ 
        email: formData.email, 
        password: formData.password, 
        displayName: formData.displayName 
      });
      navigate('/world');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="glass-panel max-w-md w-full p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-8 relative z-10">
        <h1 className="fantasy-heading text-3xl font-bold mb-2">Create Identity</h1>
        <p className="text-slate-400">Begin your legacy</p>
      </div>

      {(error || validationError) && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 flex items-start gap-2 text-sm relative z-10">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{validationError || error}</span>
          <button onClick={() => { clearError(); setValidationError(''); }} className="ml-auto text-red-400/70 hover:text-red-400">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Hero Name (Display Name)</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            required
            minLength={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full glass-button bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 py-3 mt-4 flex items-center justify-center gap-2 group"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <UserPlus className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />}
          <span>Awaken</span>
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400 relative z-10">
        Already have an identity?{' '}
        <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
          Enter Realm
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
