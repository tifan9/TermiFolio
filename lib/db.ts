import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

let db: ReturnType<typeof drizzle>;
let pool: Pool;

export function getDatabase() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: process.env.NODE_ENV === 'production' ? 20 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      allowExitOnIdle: true,
    });

    db = drizzle(pool, { 
      schema,
      logger: process.env.NODE_ENV === 'development'
    });
  }

  return db;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
  }
}

// Handle graceful shutdown
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

export default getDatabase;