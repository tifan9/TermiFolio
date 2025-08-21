import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import seed from './seed';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function reset() {
  console.log('🔄 Resetting database...');

  try {
    // Delete all data (in correct order to handle foreign keys)
    console.log('🗑️  Deleting existing data...');
    
    // Delete in reverse dependency order
    await db.delete(schema.analytics);
    await db.delete(schema.contacts);
    await db.delete(schema.journalEntries);
    await db.delete(schema.cvData);
    await db.delete(schema.users);

    console.log('✅ All data deleted');

    // Re-seed the database
    console.log('🌱 Re-seeding database...');
    await seed();

    console.log('✅ Database reset and seeded successfully!');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run reset if called directly
if (require.main === module) {
  const confirm = process.argv.includes('--confirm');
  
  if (!confirm) {
    console.log('⚠️  This will delete ALL data in the database!');
    console.log('Run with --confirm flag to proceed: npm run db:reset -- --confirm');
    process.exit(0);
  }

  reset().catch((error) => {
    console.error('Reset failed:', error);
    process.exit(1);
  });
}