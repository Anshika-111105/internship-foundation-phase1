/**
 * Generates a unique numeric seed based on the current date (YYYYMMDD).
 */
export const getDailySeed = (): number => {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
};

/**
 * Picks an item from an array using a seed to ensure daily consistency.
 */
export const getSeededItem = (items: string[], seed: number): string => {
  const index = seed % items.length;
  return items[index];
};

export const DAILY_WORDS = ["NEON", "VITE", "NODE", "DATA", "FLOW", "GRID", "BASE", "REACT", "AUTH"];