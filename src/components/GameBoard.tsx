import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, Activity, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordleLite } from './puzzles/WordleLite';
import { MemoryMatch } from './puzzles/MemoryMatch';
import { HeatmapGrid } from './HeatmapGrid'; 
import { getDailySeed } from '../engine/puzzleEngine'; 
import { db } from '../db';

export const GameBoard: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [activityData, setActivityData] = useState<Record<string, any>>({});
  const [startTime] = useState(Date.now()); 
  const today = new Date().toLocaleDateString();

  // Deterministic Game Selection 
  const seed = getDailySeed("daily-key-v1");
  const CurrentGame = seed % 2 === 0 ? WordleLite : MemoryMatch;

  useEffect(() => {
    const loadAppData = async () => {
      const record = await db.gameStates.where({ userId: userEmail, date: today }).first();
      if (record?.status === 'completed') setIsCompleted(true);

      const allRecords = await db.gameStates.where({ userId: userEmail }).toArray();
      const heatmapMap: Record<string, any> = {};
      allRecords.forEach((rec: any) => {
        heatmapMap[rec.date] = { level: 4, score: rec.score };
      });
      setActivityData(heatmapMap);
    };
    loadAppData();
  }, [userEmail, today]);

    const handleWin = async () => {
        confetti();
        const secondsTaken = Math.floor((Date.now() - startTime) / 1000);
        const calculatedScore = Math.max(100, 1000 - (secondsTaken * 2));

    setIsCompleted(true);
    
    await db.gameStates.add({
        userId: userEmail,
        date: today,
        status: 'completed' as const,
        score: calculatedScore,
        puzzleType: seed % 2 === 0 ? 'Wordle' : 'Memory',
        timeTaken: secondsTaken 
    });
    };

  return (
    
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-gray-400 font-mono">{today}</span>
          <div className="flex items-center gap-1 text-green-400 border border-green-900/50 px-2 py-1 rounded bg-green-900/10">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Module 1 Active</span>
          </div>
        </div>

        {isCompleted ? (
          <div className="text-center py-10 space-y-4">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Daily Goal Met!</h2>
          </div>
        ) : (
          <CurrentGame onWin={handleWin} />
        )}
      </div>

      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Activity size={18} className="text-blue-400" />
          <h2 className="text-xl font-bold">Activity Heatmap</h2>
        </div>
        <HeatmapGrid activityData={activityData} />
      </div>
    </div>
  );
};