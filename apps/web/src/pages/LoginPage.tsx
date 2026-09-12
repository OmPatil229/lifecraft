import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/world');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="glass-panel max-w-md w-full p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-8 relative z-10">
        <h1 className="fantasy-heading text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-slate-400">Continue your journey</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 flex items-start gap-2 text-sm relative z-10">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
          <button onClick={clearError} className="ml-auto text-red-400/70 hover:text-red-400">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full glass-button bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 py-3 mt-4 flex items-center justify-center gap-2 group"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <LogIn className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />}
          <span>Enter Realm</span>
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400 relative z-10">
        Don't have an identity yet?{' '}
        <Link to="/signup" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
