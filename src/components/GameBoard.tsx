import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordleLite } from './puzzles/WordleLite';
import { db } from '../db';

interface GameBoardProps {
  userEmail: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ userEmail }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const checkStatus = async () => {
      const record = await db.gameStates
        .where({ userId: userEmail, date: today })
        .first();
      if (record?.status === 'completed') setIsCompleted(true);
    };
    checkStatus();
  }, [userEmail, today]);

  const handleWin = async () => {
    setIsCompleted(true);
    confetti({ particleCount: 150, spread: 60 });

    await db.gameStates.add({
      userId: userEmail,
      date: today,
      status: 'completed',
      score: 100,
      puzzleType: 'WordleLite'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-1">
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
    </div>
  );
};