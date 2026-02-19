import dayjs from 'dayjs';
import type { GameState } from '../db'; 

export const calculateStreak = (records: GameState[]): number => {
  if (records.length === 0) return 0;
  const completedDates = Array.from(new Set(records.map((r) => r.date)))
    .sort((a, b) => dayjs(b).diff(dayjs(a)));

  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  if (!completedDates.includes(today) && !completedDates.includes(yesterday)) return 0;

  let streak = 0;
  let curr = completedDates.includes(today) ? dayjs() : dayjs().subtract(1, 'day');
  while (completedDates.includes(curr.format('YYYY-MM-DD'))) {
    streak++;
    curr = curr.subtract(1, 'day');
  }
  return streak;
};

export const getIntensityLevel = (score: number): number => {
  if (score >= 900) return 4;
  if (score >= 600) return 3;
  if (score >= 300) return 2;
  return score > 0 ? 1 : 0;
};