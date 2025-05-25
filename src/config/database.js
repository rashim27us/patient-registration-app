import { PGlite } from '@electric-sql/pglite';
import { PGlite } from '@electric-sql/pglite';

let db;

// This function is what your index.js is trying to import
export async function initDatabase() {
  try {
    console.log('Starting database initialization...');
    if (!db) {
      db = new PGlite();
      // Create patients table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          dateOfBirth TEXT NOT NULL,
          phoneNumber TEXT,
          address TEXT
        );
      `);
      console.log('Database initialized successfully');
    }
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error.message}`);
  }
}

export async function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// Mock query method to support our SQL interface
export async function query(sql, params = []) {
  try {
    const db = await getDatabase();
    
    // Very basic SQL parsing - in production use a proper SQL parser
    const trimmedSql = sql.trim().toUpperCase();
    console.log(`Executing query: ${trimmedSql}`);
    
    if (trimmedSql.startsWith('SELECT * FROM PATIENTS')) {
      // Get all patients
      const patients = await db.query('SELECT * FROM patients');
      console.log(`Query returned ${patients.length} results`);
      
      return { rows: patients };
    }
    
    // Return empty result for unsupported queries
    console.log('Unsupported query, returning empty result set');
    return { rows: [] };
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// This is a placeholder function to get table schema
export async function getTableSchema() {
  return [
    {
      tableName: 'patients',
      columns: [
        { name: 'id', type: 'INTEGER', isPrimaryKey: true, notNull: true },
        { name: 'firstName', type: 'TEXT', notNull: true },
        { name: 'lastName', type: 'TEXT', notNull: true },
        { name: 'email', type: 'TEXT', notNull: true },
        { name: 'dateOfBirth', type: 'TEXT', notNull: true },
        { name: 'phoneNumber', type: 'TEXT', notNull: false },
        { name: 'address', type: 'TEXT', notNull: false },
      ]
    }
  ];
}

// Add this function to src/config/database.js

export async function syncLocalStorageToIndexedDB() {
  const db = await getDatabase();
  const localPatients = JSON.parse(localStorage.getItem('patients') || '[]');
  const tx = db.transaction('patients', 'readwrite');
  const store = tx.objectStore('patients');
  for (const patient of localPatients) {
    await store.put(patient);
  }
  await tx.done;
  console.log('Synced localStorage patients to IndexedDB');
}

export async function syncLocalStorageToPGlite() {
  const db = await getDatabase();
  const localPatients = JSON.parse(localStorage.getItem('patients') || '[]');
  for (const patient of localPatients) {
    await db.query(
      `INSERT INTO patients (id, firstName, lastName, email, dateOfBirth, phoneNumber, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         firstName = EXCLUDED.firstName,
         lastName = EXCLUDED.lastName,
         email = EXCLUDED.email,
         dateOfBirth = EXCLUDED.dateOfBirth,
         phoneNumber = EXCLUDED.phoneNumber,
         address = EXCLUDED.address;`,
      [
        patient.id,
        patient.firstName,
        patient.lastName,
        patient.email,
        patient.dateOfBirth,
        patient.phoneNumber,
        patient.address
      ]
    );
  }
  console.log('Synced localStorage patients to pglite');
}