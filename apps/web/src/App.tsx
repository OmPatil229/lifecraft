import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Compass, Sparkles, Coins } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorldPage from './pages/WorldPage';
import QuestsPage from './pages/QuestsPage';
import QuestDetailPage from './pages/QuestDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const Navigation = () => {
  const { user } = useAuth();
  const { character, xpPercent, currentLevelXp, xpRequired } = useCharacter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 rounded-none px-6 py-3 flex justify-between items-center gap-4">
      <Link to={user ? '/world' : '/'} className="flex items-center gap-2 group flex-shrink-0">
        <Compass className="w-6 h-6 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
        <span className="fantasy-heading text-xl font-bold tracking-wider">LIFECRAFT</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Gold display */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 font-bold">{character?.gold ?? 0}</span>
          </div>

          {/* XP bar + level */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              Lv <span className="text-amber-400">{character?.level ?? 1}</span>
            </span>
            <div
              className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"
              title={`${currentLevelXp} / ${xpRequired} XP`}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-0.5 text-xs text-slate-500 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{currentLevelXp}/{xpRequired}</span>
            </div>
          </div>

          {/* User name + nav links */}
          <div className="flex items-center gap-3">
            <Link to="/quests" className="glass-button py-1.5 text-sm hidden sm:block">
              Quests
            </Link>
            <Link to="/world" className="flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              {user.displayName}
            </Link>
          </div>
        </div>
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
