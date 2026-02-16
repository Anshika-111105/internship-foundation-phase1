import dayjs from 'dayjs';
import { useMemo } from 'react';

interface HeatmapGridProps {
  activityData: Record<string, { level: number; score?: number }>;
}

export const HeatmapGrid = ({ activityData }: HeatmapGridProps) => {
  const days = useMemo(() => {
    const start = dayjs().startOf('year');
    const today = dayjs();
    
    return Array.from({ length: 365 }, (_, i) => {
      const dateObj = start.add(i, 'day');
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

  const intensityMap: Record<number, string> = {
    0: "bg-gray-800", 
    1: "bg-green-900",
    2: "bg-green-700",
    3: "bg-green-500",
    4: "bg-green-300",
  };

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-1 overflow-x-auto custom-scrollbar">
      {days.map((day) => (
        <div
          key={day.date}
          title={`${day.date}${day.score ? `: Score ${day.score}` : ''}`}
          className={`
            w-3 h-3 rounded-[2px] transition-all duration-200 cursor-help
            hover:scale-150 hover:z-10
            ${intensityMap[day.level]}
            ${day.isToday ? 'ring-1 ring-blue-400' : ''}
          `}
        />
      ))}
    </div>
  );
};