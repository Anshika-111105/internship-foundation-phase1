import React, { useState } from 'react';
import { getDailySeed, getSeededItem, DAILY_WORDS } from '../../engine/puzzleEngine';

interface WordleProps {
  onWin: () => void;
}

export const WordleLite: React.FC<WordleProps> = ({ onWin }) => {
  const [guess, setGuess] = useState("");
  const [isError, setIsError] = useState(false);

  // Logic: Get today's secret word
  const seed = getDailySeed("wordle-secret-v1");
  const solution = getSeededItem(DAILY_WORDS, seed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toUpperCase() === solution) {
      onWin();
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500); // Reset shake effect
      setGuess("");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-blue-400">Word Quest</h3>
        <p className="text-sm text-gray-400">Today's secret is a {solution.length}-letter word</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          maxLength={solution.length}
          placeholder="TYPE HERE"
          className={`w-full p-4 bg-gray-900 border-2 rounded-xl text-center text-2xl font-mono tracking-widest outline-none transition-all ${
            isError ? 'border-red-500 animate-pulse' : 'border-gray-700 focus:border-blue-500'
          }`}
        />
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors"
        >
          VALIDATE
        </button>
      </form>
    </div>
  );
};