import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Flame, CheckCircle2 } from 'lucide-react';
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

  // Generate grid dates for past 16 weeks (112 days)
  const generateGridDates = () => {
    const dates: { dateStr: string; dateObj: Date; dayOfWeek: number }[] = [];
    const today = new Date();
    
    // Total days: 16 weeks * 7 = 112 days
    const totalDays = compact ? 56 : 112; 
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
    if (!count || count === 0) return 'bg-slate-900/80 border-slate-800/80 hover:border-slate-600';
    if (count === 1) return 'bg-emerald-950/90 border-emerald-800/60 text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.2)]';
    if (count === 2) return 'bg-emerald-700/90 border-emerald-500/80 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    if (count <= 4) return 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_14px_rgba(16,185,129,0.7)]';
    return 'bg-emerald-400 border-white text-slate-950 font-bold shadow-[0_0_18px_rgba(52,211,153,0.9)]';
  };

  // Group by weeks for GitHub grid display
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

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-5 relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Stat Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border flex items-center justify-center ${
            streak >= 3 ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]' : 'bg-slate-900 border-slate-800'
          }`}>
            <Flame className={`w-6 h-6 ${streak >= 3 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-wide text-white">
                {streak === 0 ? 'No Active Streak' : `${streak} Day Streak!`}
              </h3>
              {streakMultiplier > 1 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md">
                  {streakMultiplier}× XP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {streak > 0 ? 'Maintain your daily streak to earn up to 2.0× bonus XP!' : 'Complete a quest today to start your streak.'}
            </p>
          </div>
        </div>

        {/* Stats summary chips */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Past {compact ? '56' : '112'} Days:</span>
            <span className="font-bold text-emerald-400">{totalCompleted} Quests</span>
          </div>
        </div>
      </div>

      {/* GitHub Contribution Heatmap Grid */}
      <div className="relative z-10 overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex gap-[3px] text-[10px] font-semibold text-slate-400 mb-1.5 pl-6">
            {weeks.map((week, idx) => {
              const firstDay = week[0]?.dateObj;
              const isMonthStart = firstDay && (firstDay.getDate() <= 7 || idx === 0);
              return (
                <div key={idx} className="w-3.5 text-center">
                  {isMonthStart && firstDay ? monthNames[firstDay.getMonth()] : ''}
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[3px] text-[9px] font-bold text-slate-400 pt-0.5">
              <span className="h-3.5 leading-[14px]">Mon</span>
              <span className="h-3.5 leading-[14px]">Wed</span>
              <span className="h-3.5 leading-[14px]">Fri</span>
            </div>

            {/* Heatmap Grid */}
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
                            date: item.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

      {/* Legend & Info Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
        <span className="font-semibold text-slate-400">GitHub-Style Streak Maintainer</span>
        
        {/* Heatmap intensity legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-slate-900 border border-slate-800" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-700 border border-emerald-500" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-300" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-400 border border-white" />
          <span className="text-[10px]">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-slate-900/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-1.5"
          style={{ left: hoveredDay.x, top: hoveredDay.y }}
        >
          <span className="text-emerald-400 font-bold">{hoveredDay.count} quest{hoveredDay.count === 1 ? '' : 's'}</span>
          <span className="text-slate-400">on {hoveredDay.date}</span>
        </div>
      )}
    </div>
  );
};
