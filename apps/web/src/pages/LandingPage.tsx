import { Link } from 'react-router-dom';
import { Sword, Sparkles, Book, Target } from 'lucide-react';

const features = [
  {
    icon: <Sword className="w-6 h-6 text-red-400" />,
    title: "Epic Quests",
    description: "Transform daily tasks into rewarding missions with real stakes."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    title: "Level Up",
    description: "Gain XP, unlock skills, and watch your character grow."
  },
  {
    icon: <Book className="w-6 h-6 text-purple-400" />,
    title: "Attribute Mastery",
    description: "Build Intelligence, Strength, and Focus through diverse challenges."
  },
  {
    icon: <Target className="w-6 h-6 text-green-400" />,
    title: "Boss Battles",
    description: "Conquer long-term goals by dealing damage with consistent effort."
  }
];

export default function LandingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-16 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="fantasy-heading text-5xl md:text-7xl font-bold tracking-tight">
          Turn Your Real Life Into<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">A World You Build</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
          LIFECRAFT is a productivity RPG where your real-world actions forge a living fantasy kingdom. Complete tasks, earn gold, and level up your life.
        </p>
        <div className="flex gap-4 mt-4">
          <Link to="/signup" className="glass-button px-8 py-4 text-lg bg-blue-500/20 border-blue-400/50 hover:bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Begin Your Journey
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
        {features.map((feature, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col items-start text-left gap-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-100">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
