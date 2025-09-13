// src/utils/db.js
import { openDB } from 'idb';

const DB_NAME = 'HarmonicDB';
const STORE_NAME = 'songs';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const saveSong = async (song) => {
  const db = await initDB();
  return db.put(STORE_NAME, song);
};

export const getAllSongs = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteSong = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const clearAllSongs = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  return tx.done;
};