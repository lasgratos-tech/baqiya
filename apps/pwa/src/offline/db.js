import { openDB } from 'idb';

export const db = openDB('baqiya-db', 1, {
  upgrade(db) {
    db.createObjectStore('tickets', { keyPath: 'id' });
    db.createObjectStore('pending_tasks', { keyPath: 'offline_id' });
  }
});
