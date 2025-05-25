import { initDatabase, getDatabase } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    const pgLite = await initDatabase();
    
    console.log('Running migrations...');
    
    // Read and execute migration files
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Begin transaction
    await pgLite.query('BEGIN;');
    
    for (const file of migrationFiles) {
      console.log(`Applying migration: ${file}`);
      const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const statements = migration.split('--> statement-breakpoint')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      for (let i = 0; i < statements.length; i++) {
        console.log(`  Executing statement ${i + 1} of ${statements.length}`);
        try {
          await pgLite.query(statements[i]);
          console.log(`  Statement ${i + 1} executed successfully`);
        } catch (statementError) {
          await pgLite.query('ROLLBACK;');
          console.error(`  Error executing statement ${i + 1}:`, statementError);
          throw statementError;
        }
      }
    }
    
    await pgLite.query('COMMIT;');
    
    console.log('Migrations completed successfully');

    const tables = await pgLite.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log('Tables created:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    setTimeout(() => process.exit(0), 500);
  }
}

runMigrations();