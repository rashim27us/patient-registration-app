import fs from 'fs';
import path from 'path';
import { initDatabase, getDatabase } from '../config/database';

const runMigrations = async () => {
  try {
    await initDatabase();
    const db = getDatabase();
    
    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get list of executed migrations
    const { rows: executedMigrations } = await db.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(migration => migration.name);
    
    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order
    
    // Execute new migrations
    for (const migrationFile of migrationFiles) {
      if (!executedMigrationNames.includes(migrationFile)) {
        console.log(`Executing migration: ${migrationFile}`);
        
        const migrationPath = path.join(migrationsDir, migrationFile);
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute migration in a transaction
        await db.query('BEGIN');
        try {
          await db.query(migrationSql);
          await db.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
          await db.query('COMMIT');
          console.log(`Migration ${migrationFile} completed successfully`);
        } catch (error) {
          await db.query('ROLLBACK');
          console.error(`Migration ${migrationFile} failed:`, error);
          throw error;
        }
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
};

runMigrations();