import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Flame, CheckCircle2, Sparkles, Calendar } from 'lucide-react';
import { useCharacter } from '../contexts/CharacterContext';

interface StreakHeatmapProps {
  compact?: boolean;
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ compact = false }) => {
  const { character, streakMultiplier } = useCharacter();
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await apiFetch('/character/activity');
        setActivity(data.activity || {});
        setTotalCompleted(data.totalCompleted || 0);
      } catch (err) {
        console.error('Failed to fetch activity history', err);
      }
    };
    fetchActivity();
  }, []);

  const totalWeeks = compact ? 26 : 52;
  const totalDays = totalWeeks * 7;

  // Generate grid dates ending today
  const generateGridDates = () => {
    const dates: { dateStr: string; dateObj: Date; dayOfWeek: number }[] = [];
    const today = new Date();
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        dateStr,
        dateObj: d,
        dayOfWeek: d.getDay(),
      });
    }
    return dates;
  };

  const dates = generateGridDates();
  const streak = character?.streakDays ?? 0;

  // Level color mapping
  const getColorClass = (count: number) => {
    if (!count || count === 0) return 'bg-slate-900/90 border-slate-800/80 hover:border-slate-600';
    if (count === 1) return 'bg-emerald-950/90 border-emerald-700/60 shadow-[0_0_6px_rgba(16,185,129,0.25)]';
    if (count === 2) return 'bg-emerald-700/90 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.45)]';
    if (count <= 4) return 'bg-emerald-500 border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.7)]';
    return 'bg-emerald-400 border-white font-bold shadow-[0_0_18px_rgba(52,211,153,0.95)]';
  };

  // Group into columns of 7 days (weeks)
  const weeks: (typeof dates)[] = [];
  let currentWeek: typeof dates = [];
  dates.forEach((item) => {
    currentWeek.push(item);
    if (item.dayOfWeek === 6 || currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Calculate month labels positioned over exact column index
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthHeaders: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, colIdx) => {
    const firstDayOfWeek = week[0]?.dateObj;
    if (firstDayOfWeek) {
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        monthHeaders.push({ label: monthNames[month], colIndex: colIdx });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl p-6 relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl border flex items-center justify-center ${
            streak >= 3 ? 'bg-gradient-to-br from-orange-500/25 to-amber-500/15 border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.3)]' : 'bg-slate-900 border-slate-800'
          }`}>
            <Flame className={`w-7 h-7 ${streak >= 3 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-black tracking-wide text-white">
                {streak === 0 ? 'No Active Streak' : `${streak} Day Streak!`}
              </h3>
              {streakMultiplier > 1 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md">
                  {streakMultiplier}× XP BOOST
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Consistency Matrix • Daily Performance Momentum
            </p>
          </div>
        </div>

        {/* ── Right Stat Cards ── */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-2.5 text-xs shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Past {totalWeeks} Weeks</span>
              <span className="font-extrabold text-emerald-400 text-sm">{totalCompleted} Quests Completed</span>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-2.5 text-xs shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bonus Rate</span>
              <span className="font-extrabold text-amber-400 text-sm">{streakMultiplier}× Multiplier</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Heatmap Grid Container ── */}
      <div className="relative z-10 overflow-x-auto pb-3 scrollbar-thin">
        <div className="min-w-max flex flex-col gap-1.5">
          {/* Month Labels Header Row */}
          <div className="relative h-4 text-[10px] font-bold text-slate-400 ml-7">
            {monthHeaders.map((m, i) => (
              <span
                key={i}
                className="absolute top-0 transform -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${m.colIndex * 15}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-500 h-[102px] py-[2px] pr-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap Columns Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((item) => {
                    const count = activity[item.dateStr] || 0;
                    const colorClass = getColorClass(count);
                    return (
                      <div
                        key={item.dateStr}
                        className={`w-3.5 h-3.5 rounded-[3px] border transition-all duration-200 cursor-pointer ${colorClass}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            date: item.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                            count,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend & Footer ── */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-400">1 Year Activity History</span>
        </div>
        
        {/* Heatmap intensity legend */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-900 border border-slate-800" title="0 quests" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-950 border border-emerald-700" title="1 quest" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-700 border border-emerald-500" title="2 quests" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-500 border border-emerald-300" title="3-4 quests" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-400 border border-white" title="5+ quests" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2"
          style={{ left: hoveredDay.x, top: hoveredDay.y }}
        >
          <span className="text-emerald-400 font-extrabold">{hoveredDay.count} quest{hoveredDay.count === 1 ? '' : 's'}</span>
          <span className="text-slate-400">on {hoveredDay.date}</span>
        </div>
      )}
    </div>
  );
};
