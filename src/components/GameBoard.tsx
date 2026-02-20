import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth animations
import { Trophy, ShieldCheck, Activity, Clock, Flame, Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import { WordleLite } from './puzzles/WordleLite';
import { MemoryMatch } from './puzzles/MemoryMatch';
import { HeatmapGrid } from './HeatmapGrid'; 
import { getDailySeed } from '../engine/puzzleEngine'; 
import { calculateStreak, getIntensityLevel } from '../engine/streakEngine';
import { syncLocalDataToServer } from '../engine/syncEngine';
import { db } from '../db';

export const GameBoard: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [activityData, setActivityData] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now()); 
  const [elapsed, setElapsed] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  const today = dayjs().format('YYYY-MM-DD');
  const seed = getDailySeed("daily-key-v1");
  const CurrentGame = seed % 2 === 0 ? WordleLite : MemoryMatch;

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [isCompleted, startTime]);

  useEffect(() => {
    const loadAppData = async () => {
      const allRecords = await db.gameStates.where({ userId: userEmail }).toArray();
      setStreak(calculateStreak(allRecords));
      const heatmapMap: Record<string, { level: number; score: number }> = {};
      allRecords.forEach((rec) => {
        heatmapMap[rec.date] = { level: getIntensityLevel(rec.score), score: rec.score };
      });
      setActivityData(heatmapMap);
      if (allRecords.some(r => r.date === today && r.status === 'completed')) setIsCompleted(true);
      triggerSync();
    };
    loadAppData();
  }, [userEmail, today]);

  const triggerSync = async () => {
    setSyncStatus('syncing');
    const result = await syncLocalDataToServer(userEmail);
    if (result?.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  const handleWin = async () => {
    const secondsTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.max(100, 1000 - (secondsTaken * 2));
    
    await db.gameStates.add({
      userId: userEmail, date: today, status: 'completed',
      score, puzzleType: seed % 2 === 0 ? 'Wordle' : 'Memory', timeTaken: secondsTaken,
      synced: false 
    });

    setIsCompleted(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    const updated = await db.gameStates.where({ userId: userEmail }).toArray();
    setStreak(calculateStreak(updated));
    setActivityData(prev => ({ ...prev, [today]: { level: getIntensityLevel(score), score } }));
    triggerSync();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4">
      {/* Sync Success Toast */}
      <AnimatePresence>
        {syncStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Cloud Synced!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl relative"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-mono">{today}</span>
            {!isCompleted && (
              <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                <Clock size={14} className="animate-pulse" />
                <span className="text-sm font-bold">{elapsed}s</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-green-400 border border-green-900/50 px-2 py-1 rounded bg-green-900/10">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Module 3</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={16} fill="currentColor" className="animate-pulse" />
                <span className="text-sm font-extrabold">{streak} DAY STREAK</span>
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[250px] flex flex-col justify-center">
          {isCompleted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 space-y-4"
            >
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
              <h2 className="text-3xl font-black text-white tracking-tight">MISSION COMPLETE</h2>
              <p className="text-gray-400">Your results are backed up to the cloud.</p>
            </motion.div>
          ) : (
            <CurrentGame onWin={handleWin} />
          )}
        </div>
      </motion.div>

      {/* Heatmap Section with Entrance Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <Activity size={18} className="text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-tight">Global Consistency</h2>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus === 'syncing' ? (
              <RefreshCw size={14} className="text-blue-400 animate-spin" />
            ) : syncStatus === 'error' ? (
              <CloudOff size={14} className="text-red-400" />
            ) : (
              <Cloud size={14} className="text-gray-500" />
            )}
          </div>
        </div>
        <HeatmapGrid activityData={activityData} /> 
      </motion.div>
    </div>
  );
};