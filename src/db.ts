import Dexie, { type EntityTable } from 'dexie';

// Define the interfaces that were missing
export interface LocalUser {
  id?: number;
  email: string;
  name?: string;
}

export interface GameState {
  id?: number;
  userId: string;
  date: string;
  status: 'completed' | 'in-progress';
  score: number;
  puzzleType: string;
}

const db = new Dexie('InternAppDB') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
  gameStates: EntityTable<GameState, 'id'>;
};

// Schema declaration
db.version(1).stores({
  users: '++id, email',
  gameStates: '++id, userId, date'
});

// IMPORTANT: You must EXPORT db so GameBoard.tsx can use it
export { db };