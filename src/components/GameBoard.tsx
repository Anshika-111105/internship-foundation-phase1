import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordleLite } from './puzzles/WordleLite';
import { HeatmapGrid } from './HeatmapGrid'; // Ensure this path is correct
import { db } from '../db';

interface GameBoardProps {
  userEmail: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ userEmail }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [activityData, setActivityData] = useState<Record<string, any>>({});
  const today = new Date().toLocaleDateString();

  // Load both Game Status and Heatmap Data
  useEffect(() => {
    const loadAppData = async () => {
      // 1. Check if today is completed
      const record = await db.gameStates
        .where({ userId: userEmail, date: today })
        .first();
      if (record?.status === 'completed') setIsCompleted(true);

      // 2. Fetch all activity for the Heatmap
      const allRecords = await db.gameStates
        .where({ userId: userEmail })
        .toArray();
      
      // Convert array to the Record format the Heatmap expects
      const heatmapMap: Record<string, any> = {};
      allRecords.forEach(rec => {
        // level 4 for completion, you can customize this logic
        heatmapMap[rec.date] = { level: rec.status === 'completed' ? 4 : 1 };
      });
      setActivityData(heatmapMap);
    };

    loadAppData();
  }, [userEmail, today]);

  // src/components/GameBoard.tsx

const handleWin = async () => {
  setIsCompleted(true);
  confetti({ particleCount: 150, spread: 60 });

  const newRecord = {
    userId: userEmail,
    date: today,
    status: 'completed' as const, // The "as const" tells TS this is exactly 'completed'
    score: 100,
    puzzleType: 'WordleLite'
  };

  await db.gameStates.add(newRecord);
  
  // Update heatmap instantly without refresh
  setActivityData(prev => ({
    ...prev,
    [today]: { level: 4 }
  }));  
};

  return (
    <div className="w-full max-w-md mx-auto p-1 space-y-6">
      {/* Main Puzzle Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/30 rounded-t-2xl">
          <span className="text-xs text-gray-400 font-mono tracking-tighter">{today}</span>
          <div className="flex items-center gap-1 text-green-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase">Engine Active</span>
          </div>
        </div>
        
        <div className="p-8">
          {isCompleted ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-700">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Daily Puzzle Cleared!</h2>
              <p className="text-gray-400 text-sm italic">"Persistence is the path to greatness."</p>
            </div>
          ) : (
            <WordleLite onWin={handleWin} />
          )}
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Activity size={18} className="text-blue-400" />
          <h2 className="text-xl font-bold">Your Activity</h2>
        </div>
        <HeatmapGrid activityData={activityData} />
        <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-800"></div>
            <div className="w-2 h-2 bg-green-900"></div>
            <div className="w-2 h-2 bg-green-700"></div>
            <div className="w-2 h-2 bg-green-500"></div>
            <div className="w-2 h-2 bg-green-300"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};