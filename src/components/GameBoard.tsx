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
  const [elapsed, setElapsed] = useState(0); // For the live Clock UI
  const today = new Date().toLocaleDateString();

  // Deterministic Game Selection (Module 1 Requirement)
  const seed = getDailySeed("daily-key-v1");
  const CurrentGame = seed % 2 === 0 ? WordleLite : MemoryMatch;

  // Live Timer logic to make the Clock icon useful
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, startTime]);

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

    // Refresh heatmap data immediately after win
    setActivityData(prev => ({
      ...prev,
      [today]: { level: 4, score: calculatedScore }
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Main Game Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-mono tracking-tighter">{today}</span>
            {/* Functional Clock UI */}
            {!isCompleted && (
              <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                <Clock size={14} className="animate-pulse" />
                <span className="text-sm font-bold">{elapsed}s</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-green-400 border border-green-900/50 px-2 py-1 rounded bg-green-900/10">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Engine Active</span>
          </div>
        </div>

        <div className="min-h-[300px] flex flex-col justify-center">
          {isCompleted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-[10px] px-1.5 py-0.5 rounded-full text-white font-bold">
                  DONE
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Daily Goal Met!</h2>
              <p className="text-gray-400 text-sm italic">"Persistence is the path to greatness."</p>
            </div>
          ) : (
            <CurrentGame onWin={handleWin} />
          )}
        </div>
      </div>

      {/* Activity Heatmap Card */}
      <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Activity size={18} className="text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-tight">Your Activity</h2>
        </div>
        <div className="overflow-x-auto pb-2">
          <HeatmapGrid activityData={activityData} />
        </div>
      </div>
    </div>
  );
};