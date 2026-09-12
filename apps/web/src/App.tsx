import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 rounded-none px-6 py-4 flex justify-between items-center">
      <Link to={user ? "/world" : "/"} className="flex items-center gap-2 group">
        <Compass className="w-6 h-6 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
        <span className="fantasy-heading text-xl font-bold tracking-wider">LIFECRAFT</span>
      </Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login" className="glass-button">Log In</Link>
            <Link to="/signup" className="glass-button border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20">Start Journey</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-amber-500 font-medium">{user.displayName}</span>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">Lv 1</span>
          </div>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen flex flex-col">
          <Navigation />

          {/* Main Content Area */}
          <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center relative z-10">
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
          
          {/* Fantasy World Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-end opacity-20">
              <div className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] -bottom-1/2"></div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
