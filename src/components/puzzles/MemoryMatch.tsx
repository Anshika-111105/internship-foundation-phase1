import { useState, useEffect } from 'react';
import { getDailySeed } from '../../engine/puzzleEngine';

export const MemoryMatch = ({ onWin }: { onWin: () => void }) => {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  
  // Use getDailySeed here
  const seed = getDailySeed("memory-v1");

  const icons = ['🔥', '⭐', '🍀', '💎', '🍎', '👻'];
  const [cards] = useState(() => {
    const combined = [...icons, ...icons];
    return combined.sort(() => (seed % 10) - 5);
  });

  const handleClick = (index: number) => {
    if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched(prev => [...prev, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) onWin();
  }, [matched, cards.length, onWin]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((icon, i) => (
        <div 
          key={i} 
          onClick={() => handleClick(i)}
          className={`h-16 flex items-center justify-center text-2xl rounded-lg cursor-pointer transition-all ${
            matched.includes(i) || flipped.includes(i) ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          {(matched.includes(i) || flipped.includes(i)) ? icon : '?'}
        </div>
      ))}
    </div>
  );
};