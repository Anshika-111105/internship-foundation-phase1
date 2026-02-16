import dayjs from 'dayjs';

export const getDailySeed = (secretKey: string): number => {
  const date = dayjs().format("YYYY-MM-DD");
  let hash = 0;
  const input = date + secretKey;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};
/**
 * Picks an item from an array using a seed to ensure daily consistency.
 */
export const getSeededItem = (items: string[], seed: number): string => {
  const index = seed % items.length;
  return items[index];
};

export const DAILY_WORDS = ["NEON", "VITE", "NODE", "DATA", "FLOW", "GRID", "BASE", "REACT", "AUTH"];