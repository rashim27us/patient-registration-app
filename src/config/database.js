import { PGlite } from '@electric-sql/pglite';

let pgLiteDb = null;

export const initDatabase = async () => {
  try {
    pgLiteDb = new PGlite({
      inMemory: false
    });
    if (pgLiteDb.ready && typeof pgLiteDb.ready.then === 'function') {
      await pgLiteDb.ready;
    }
    
    console.log('PGlite database initialized successfully');
    return pgLiteDb;
  } catch (error) {
    console.error('Failed to initialize PGlite database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!pgLiteDb) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return pgLiteDb;
};

export const getRawPGlite = getDatabase;