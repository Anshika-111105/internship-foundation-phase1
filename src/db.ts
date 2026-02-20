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
  timeTaken: number;
  puzzleType: string;
  synced?: boolean; 
}

const db = new Dexie('InternAppDB') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
  gameStates: EntityTable<GameState, 'id'>;
};

// Version 2 upgrade: adding 'synced' to the index
db.version(2).stores({
  users: '++id, email',
  gameStates: '++id, userId, date, synced' // Added synced index here
});

export { db };