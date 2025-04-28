import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from '../configs/config';

async function runMigrations(): Promise<void> {
  Bun.stdout.write('🔄 Running database migrations...\n');
  Bun.stdout.write(`Database URL: ${config.databaseUrl}\n`);

  const pool = new Pool({
    connectionString: config.databaseUrl,
  });

  const db = drizzle(pool);

  try {
    Bun.stdout.write('Starting migration with folder: ./drizzle\n');
    await migrate(db, { migrationsFolder: './drizzle' });
    Bun.stdout.write('✅ Migrations completed successfully!\n');
  } catch (error) {
    Bun.stderr.write(`❌ Migration failed: ${error}\n`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (import.meta.path === Bun.main.toString()) {
  await runMigrations();
}

export { runMigrations }; 