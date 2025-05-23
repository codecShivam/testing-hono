import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../configs/config';
import * as schema from './schema';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle(pool, { schema });

export { schema }; 