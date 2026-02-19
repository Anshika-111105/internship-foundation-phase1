import dayjs from 'dayjs';
import { useMemo } from 'react';

interface HeatmapGridProps {
  // Level 0: Not played, 1: Easy, 2: Medium, 3: Hard, 4: Perfect
  activityData: Record<string, { level: number; score?: number }>;
}

export const HeatmapGrid = ({ activityData }: HeatmapGridProps) => {
  const days = useMemo(() => {
    const start = dayjs().startOf('year');
    const today = dayjs();
    
    return Array.from({ length: 365 }, (_, i) => {
      const dateObj = start.add(i, 'day');
      // Format must match how you store it in DB (Locale vs ISO)
      // Here we use YYYY-MM-DD for consistency
      const dateStr = dateObj.format('YYYY-MM-DD'); 
      const dayData = activityData[dateStr];
      
      return {
        date: dateStr,
        level: dayData?.level || 0,
        score: dayData?.score || 0,
        isToday: dateStr === today.format('YYYY-MM-DD'),
      };
    });
  }, [activityData]);

  // GitHub-style Intensity Logic
  const intensityMap: Record<number, string> = {
    0: "bg-gray-800/50",      // Not played
    1: "bg-green-900",       // Level 1: Solved
    2: "bg-green-700",       // Level 2: Good Score
    3: "bg-green-500",       // Level 3: High Score
    4: "bg-green-300 shadow-[0_0_8px_rgba(74,222,128,0.4)]", // Level 4: Perfect
  };

  return (
    <div className="w-full">
      {/* Grid container with fixed height to force 7 rows (one for each day of the week) */}
      <div className="grid grid-flow-col grid-rows-7 gap-1 h-28 overflow-x-auto custom-scrollbar">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}${day.score ? `: Score ${day.score}` : ' (No activity)'}`}
            className={`
              w-3 h-3 rounded-[2px] transition-all duration-300 cursor-help
              hover:ring-1 hover:ring-white/50 hover:scale-125 hover:z-10
              ${intensityMap[day.level] || intensityMap[0]}
              ${day.isToday ? 'ring-1 ring-blue-500 ring-offset-1 ring-offset-gray-900' : ''}
            `}
          />
        ))}
      </div>
      
      {/* Legend for intensity logic */}
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className={`w-2.5 h-2.5 rounded-sm ${intensityMap[lvl]}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};