import { db } from '../db';

export const syncLocalDataToServer = async (userEmail: string) => {
  const unsynced = await db.gameStates
    .where({ userId: userEmail, synced: false })
    .toArray();

  console.log("Unsynced records found:", unsynced.length); // Add this line

  if (unsynced.length === 0) return { success: true, count: 0 };
  try {
    // 2. Push to your API (Replace with your actual endpoint)
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userEmail, records: unsynced }),
    });

    if (response.ok) {
      // 3. Mark as synced in local DB to prevent duplicate uploads
      const ids = unsynced.map(r => r.id).filter((id): id is number => id !== undefined);
      await db.gameStates.bulkUpdate(ids.map(id => ({
        key: id,
        changes: { synced: true }
      })));
      
      return { success: true, count: unsynced.length };
    }
  } catch (error) {
    console.error("Sync failed:", error);
    return { success: false, count: 0 };
  }
};