import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from '../configs/config';

async function runMigrations(): Promise<void> {
  console.log('🔄 Running database migrations...');

  const pool = new Pool({
    connectionString: config.databaseUrl,
  });

  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === Bun.main) {
  await runMigrations();
}

export { runMigrations }; 