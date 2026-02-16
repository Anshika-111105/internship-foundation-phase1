import Dexie, { type EntityTable } from 'dexie';

interface LocalUser {
  id?: number;
  name: string;
  email: string;
}

interface GameState {
  id?: number;
  userId: string;
  date: string;
  status: 'playing' | 'completed';
  score: number;
  puzzleType: string;
}

const db = new Dexie('InternAppDB') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
  gameStates: EntityTable<GameState, 'id'>; 
};

db.version(1).stores({
  users: '++id, email'
});

db.version(2).stores({
  users: '++id, email',
  gameStates: '++id, userId, date, status' 
});

export { db };