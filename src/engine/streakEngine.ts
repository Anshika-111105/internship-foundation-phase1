import dayjs from 'dayjs';
import { GameState } from '../db';

/**
 * Calculates the current daily streak by checking consecutive days backwards.
 */
export const calculateStreak = (allRecords: GameState[]): number => {
  if (!allRecords || allRecords.length === 0) return 0;

  // Create a quick-lookup map of solved dates
  const solvedDates = new Set(
    allRecords
      .filter(r => r.status === 'completed')
      .map(r => r.date)
  );

  let streak = 0;
  let current = dayjs();

  // If they haven't solved today yet, start checking from yesterday
  const todayStr = dayjs().toLocaleDateString();
  if (!solvedDates.has(todayStr)) {
    current = dayjs().subtract(1, 'day');
  }

  while (solvedDates.has(current.toLocaleDateString())) {
    streak++;
    current = current.subtract(1, 'day');
  }

  return streak;
};

/**
 * Maps Intensity Level based on score
 * 0: Not Played, 1-4: Progressive Intensity
 */
export const getIntensity = (score: number): number => {
  if (!score) return 0;
  if (score < 300) return 1;
  if (score < 600) return 2;
  if (score < 900) return 3;
  return 4;
};