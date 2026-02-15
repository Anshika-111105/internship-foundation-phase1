import Dexie, { type EntityTable } from 'dexie';

interface LocalUser {
  id?: number;
  name: string;
  email: string;
}

const db = new Dexie('InternAppDB') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
};

// Schema definition
db.version(1).stores({
  users: '++id, email'
});

export { db };