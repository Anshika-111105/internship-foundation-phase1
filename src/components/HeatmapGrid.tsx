import React, { useMemo } from 'react';
import dayjs from 'dayjs';

interface HeatmapGridProps {
  // This expects the formatted data from your GameBoard
  activityData: Record<string, { level: number; score?: number }>;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ activityData }) => {
  const days = useMemo(() => {
    const start = dayjs().startOf('year');
    
    // Create an array for the full year (365 days)
    return Array.from({ length: 365 }, (_, i) => {
      const dateObj = start.add(i, 'day');
      const dateStr = dateObj.format('YYYY-MM-DD');
      const dayData = activityData[dateStr];
      
      return {
        date: dateStr,
        level: dayData?.level || 0,
        score: dayData?.score || 0,
      };
    });
  }, [activityData]);

  // Tailwind classes for the 0-4 intensity levels
  const intensityMap: Record<number, string> = {
    0: "bg-gray-800/50", // Not played
    1: "bg-green-900",    // Low score
    2: "bg-green-700",    // Medium score
    3: "bg-green-500",    // High score
    4: "bg-green-300 shadow-[0_0_10px_rgba(74,222,128,0.5)]", // Perfect/Highest
  };

  return (
    <div className="w-full space-y-2">
      {/* The Grid: 7 rows high (one for each day of the week) */}
      <div className="grid grid-flow-col grid-rows-7 gap-1 h-32 overflow-x-auto custom-scrollbar p-1">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.score} pts`}
            className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 ${
              intensityMap[day.level] || intensityMap[0]
            }`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 font-mono">
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