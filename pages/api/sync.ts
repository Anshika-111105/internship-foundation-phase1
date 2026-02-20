import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/lib/prisma';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { userId, records } = req.body;

  if (!userId || !records) return res.status(400).json({ message: 'Missing data' });

  try {
    const results = await Promise.all(
      records.map(async (rec: any) => {
        // --- MODULE 4 SECURITY RULES ---
        
        // 1. Reject Future Dates
        if (dayjs(rec.date).isAfter(dayjs(), 'day')) return null;

        // 2. Reject Invalid Scores (0-1000)
        if (rec.score < 0 || rec.score > 1000) return null;

        // 3. Reject Unrealistic Completion Times (< 2 seconds)
        if (rec.timeTaken < 2) return null;

        // --- PRISMA UPSERT (Prevent Duplicates) ---
        return prisma.gameScore.upsert({
          where: {
            userId_date: { userId, date: rec.date }
          },
          update: {
            score: rec.score,
            timeTaken: rec.timeTaken,
          },
          create: {
            userId,
            date: rec.date,
            score: rec.score,
            timeTaken: rec.timeTaken,
            puzzleType: rec.puzzleType,
          },
        });
      })
    );

    return res.status(200).json({ 
      success: true, 
      count: results.filter(Boolean).length 
    });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error syncing to database' });
  }
}