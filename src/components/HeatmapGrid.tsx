import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(isLeapYear);

interface HeatmapGridProps {
  activityData: Record<string, { level: number; score?: number; timeTaken?: number }>;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ activityData }) => {
  const gridData = useMemo(() => {
    const startOfYear = dayjs().startOf('year');
    const totalDays = dayjs().isLeapYear() ? 366 : 365;
    const today = dayjs().format('YYYY-MM-DD');

    return Array.from({ length: totalDays }, (_, i) => {
      const dateObj = startOfYear.add(i, 'day');
      const dateStr = dateObj.format('YYYY-MM-DD');
      const data = activityData[dateStr];

      return {
        date: dateStr,
        level: data?.level || 0,
        score: data?.score || 0,
        time: data?.timeTaken || 0,
        isToday: dateStr === today,
      };
    });
  }, [activityData]);

  const intensityMap: Record<number, string> = {
    0: "bg-gray-800/40", // Not played
    1: "bg-green-900",    // Completed
    2: "bg-green-700",    // Medium
    3: "bg-green-500",    // Hard
    4: "bg-green-300 shadow-[0_0_10px_rgba(74,222,128,0.3)]", // Perfect
  };

  return (
    <div className="w-full space-y-3">
      {/* Scrollable Container for 365 days */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[800px] p-1">
          {gridData.map((day) => (
            <div
              key={day.date}
              className={`
                group relative w-3 h-3 rounded-sm transition-all duration-200
                ${intensityMap[day.level]}
                ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-gray-900' : ''}
                hover:scale-150 hover:z-50 cursor-crosshair
              `}
            >
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100]">
                <div className="bg-gray-950 text-white text-[10px] px-2 py-1.5 rounded border border-gray-700 whitespace-nowrap shadow-2xl pointer-events-none">
                  <p className="font-bold border-b border-gray-800 mb-1">{day.date}</p>
                  {day.level > 0 ? (
                    <div className="space-y-0.5">
                      <p className="text-green-400">Score: {day.score}</p>
                      <p className="text-blue-400">Time: {day.time}s</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No attempt</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 uppercase font-mono tracking-tighter">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`w-2.5 h-2.5 rounded-sm ${intensityMap[l]}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};