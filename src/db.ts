import Dexie, { type EntityTable } from 'dexie';

export interface LocalUser {
  id?: number;
  email: string;
}

export interface GameState {
  id?: number;
  userId: string;
  date: string;
  status: 'completed' | 'in-progress';
  score: number;
  puzzleType: string;
  timeTaken: number; // Add this line to resolve the "Object literal" error
}

const db = new Dexie('InternAppDB') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
  gameStates: EntityTable<GameState, 'id'>;
};

db.version(1).stores({
  users: '++id, email',
  gameStates: '++id, userId, date'
});

export { db };