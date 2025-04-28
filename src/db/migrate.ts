import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from '../configs/config';

async function connectWithRetry(maxRetries = 5, delay = 5000): Promise<Pool> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const pool = new Pool({
        connectionString: config.databaseUrl,
      });
      
      // Test the connection
      await pool.query('SELECT 1');
      Bun.stdout.write('✅ Database connection established\n');
      return pool;
    } catch (error) {
      retries++;
      Bun.stderr.write(`⚠️ Failed to connect to database (attempt ${retries}/${maxRetries}): ${error}\n`);
      
      if (retries >= maxRetries) {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
      }
      
      Bun.stdout.write(`Retrying in ${delay/1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to connect to database');
}

async function runMigrations(): Promise<void> {
  Bun.stdout.write('🔄 Running database migrations...\n');
  Bun.stdout.write(`Database URL: ${config.databaseUrl}\n`);

  let pool;
  
  try {
    pool = await connectWithRetry();
    const db = drizzle(pool);

    Bun.stdout.write('Starting migration with folder: ./drizzle\n');
    await migrate(db, { migrationsFolder: './drizzle' });
    Bun.stdout.write('✅ Migrations completed successfully!\n');
  } catch (error) {
    Bun.stderr.write(`❌ Migration failed: ${error}\n`);
    process.exit(1);
  } finally {
    if (pool) await pool.end();
  }
}

if (import.meta.path === Bun.main.toString()) {
  await runMigrations();
}

export { runMigrations }; 