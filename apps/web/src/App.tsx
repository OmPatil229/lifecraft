import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Compass, Sparkles, Coins, Flame } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorldPage from './pages/WorldPage';
import QuestsPage from './pages/QuestsPage';
import QuestDetailPage from './pages/QuestDetailPage';
import BossesPage from './pages/BossesPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const Navigation = () => {
  const { user } = useAuth();
  const { character, xpPercent, currentLevelXp, xpRequired, streakLabel } = useCharacter();
  const streak = character?.streakDays ?? 0;
  const location = window.location.pathname;

  const navLink = (to: string, label: string, activeStyle: string) => {
    const isActive = location === to || location.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isActive ? activeStyle : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-4 h-0.5 bg-current rounded-full opacity-60" />
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-0 flex justify-between items-center h-16">
      {/* Logo */}
      <Link to={user ? '/world' : '/'} className="flex items-center gap-2 group flex-shrink-0">
        <Compass className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
        <span className="text-base font-black tracking-[0.15em] text-white">LIFECRAFT</span>
      </Link>

      {user ? (
        <>
          {/* Center nav links */}
          <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLink('/world', '🗺 World', 'text-amber-400 bg-amber-500/10')}
            {navLink('/quests', '⚔️ Quests', 'text-blue-400 bg-blue-500/10')}
            {navLink('/bosses', '👹 Bosses', 'text-rose-400 bg-rose-500/10')}
          </div>

          {/* Right: stats + avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Streak */}
            {streak >= 3 && (
              <div
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400"
                title={streakLabel}
              >
                <Flame className="w-3.5 h-3.5" />
                {streak}d
              </div>
            )}

            {/* Gold */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              {character?.gold ?? 0}
            </div>

            {/* XP bar */}
            <div className="hidden md:flex items-center gap-2 min-w-[140px]">
              <span className="text-xs font-bold text-amber-400 whitespace-nowrap">Lv {character?.level ?? 1}</span>
              <div
                className="relative flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"
                title={`${currentLevelXp} / ${xpRequired} XP`}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-slate-500 whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                {currentLevelXp}
              </div>
            </div>

            {/* Avatar */}
            <Link
              to="/world"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-sm font-black text-slate-950 hover:scale-110 transition-transform"
              title={user.displayName}
            >
              {user.displayName?.[0]?.toUpperCase() ?? '?'}
            </Link>
          </div>
        </>
      ) : (
        <div className="flex gap-3">
          <Link to="/login" className="glass-button py-1.5 text-sm">Log In</Link>
          <Link to="/signup" className="glass-button py-1.5 text-sm border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20">
            Start Journey
          </Link>
        </div>
      )}
    </nav>
  );
};


function App() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col">
            <Navigation />

            {/* Main Content Area */}
            <main className="flex-grow pt-20 pb-12 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center relative z-10">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route path="/world" element={<ProtectedRoute><WorldPage /></ProtectedRoute>} />
                <Route path="/quests" element={<ProtectedRoute><QuestsPage /></ProtectedRoute>} />
                <Route path="/quests/:id" element={<ProtectedRoute><QuestDetailPage /></ProtectedRoute>} />
                <Route path="/bosses" element={<ProtectedRoute><BossesPage /></ProtectedRoute>} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Ambient background glow */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -bottom-1/3 -left-1/4" />
              <div className="absolute w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -top-1/4 -right-1/4" />
            </div>
          </div>
        </Router>
      </CharacterProvider>
    </AuthProvider>
  );
}

export default App;
