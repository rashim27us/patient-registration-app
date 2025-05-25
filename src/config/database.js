import { createPGlite } from '@pglite/sqlite-wasm';

let db = null;

export const initDatabase = async () => {
  try {
    // Initialize PGlite instance
    db = await createPGlite();
    
    // Initialize connection
    await db.connect({
      // Using in-memory database for this example
      // For persistence, we'll use IndexedDB integration later
      connectionString: 'postgresql://postgres:postgres@localhost:5432/patientdb'
    });
    
    console.log('PGlite database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize PGlite database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};