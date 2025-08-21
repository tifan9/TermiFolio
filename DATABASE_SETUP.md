# Database Setup and Migration Guide

## Overview

This guide covers setting up PostgreSQL database for the Sophie Uwase Portfolio, including schema design, migrations, and data seeding. The application uses Drizzle ORM for type-safe database operations.

## Table of Contents
1. [Database Schema](#database-schema)
2. [Migration Setup](#migration-setup)
3. [Local Development Database](#local-development-database)
4. [Production Database](#production-database)
5. [Data Seeding](#data-seeding)
6. [Database Operations](#database-operations)
7. [Troubleshooting](#troubleshooting)

## Database Schema

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Contacts Table
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Journal Entries Table
```sql
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);
```

#### 4. CV Data Table
```sql
CREATE TABLE cv_data (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Analytics Table (Optional)
```sql
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Migration Setup

### 1. Configure Drizzle

Update `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './shared/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### 2. Create Schema File

Update `shared/schema.ts`:

```typescript
import { pgTable, serial, varchar, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contacts table
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  status: varchar('status', { length: 20 }).default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Journal entries table
export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 20 }).default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// CV data table
export const cvData = pgTable('cv_data', {
  id: serial('id').primaryKey(),
  section: varchar('section', { length: 50 }).notNull(),
  data: jsonb('data').notNull(),
  version: integer('version').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Analytics table (optional)
export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventData: jsonb('event_data'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  sessionId: varchar('session_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertContactSchema = createInsertSchema(contacts).omit({ 
  id: true, 
  createdAt: true 
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCvDataSchema = createInsertSchema(cvData).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserSchema>;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = z.infer<typeof insertContactSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type CvData = typeof cvData.$inferSelect;
export type NewCvData = z.infer<typeof insertCvDataSchema>;
```

### 3. Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "tsx scripts/reset.ts",
    "db:backup": "tsx scripts/backup.ts",
    "db:restore": "tsx scripts/restore.ts"
  }
}
```

## Local Development Database

### Option 1: PostgreSQL Installation

#### macOS (Homebrew)
```bash
# Install PostgreSQL
brew install postgresql
brew services start postgresql

# Create user and database
createuser -s sophie
createdb sophie_portfolio -O sophie

# Set password (optional)
psql -c "ALTER USER sophie WITH PASSWORD 'password';"
```

#### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser --interactive sophie
sudo -u postgres createdb sophie_portfolio -O sophie

# Set password
sudo -u postgres psql -c "ALTER USER sophie WITH PASSWORD 'password';"
```

#### Windows
1. Download PostgreSQL from https://postgresql.org/download/windows
2. Run installer and follow setup wizard
3. Use pgAdmin or psql to create database:
   ```sql
   CREATE USER sophie WITH PASSWORD 'password';
   CREATE DATABASE sophie_portfolio OWNER sophie;
   ```

### Option 2: Docker Setup

```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: sophie
      POSTGRES_PASSWORD: password
      POSTGRES_DB: sophie_portfolio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
EOF

# Start PostgreSQL
docker-compose up -d postgres

# Check status
docker-compose ps
```

### Environment Configuration

Create `.env.local` for development:

```bash
# Database
DATABASE_URL=postgresql://sophie:password@localhost:5432/sophie_portfolio
PGPORT=5432
PGUSER=sophie
PGPASSWORD=password
PGDATABASE=sophie_portfolio
PGHOST=localhost

# Development flags
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

## Production Database

### Option 1: Neon (Recommended)

1. **Sign up** at https://neon.tech
2. **Create project** with PostgreSQL 15
3. **Get connection string**:
   ```bash
   postgresql://username:password@hostname/database?sslmode=require
   ```
4. **Set environment variable**:
   ```bash
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

### Option 2: Supabase

1. **Sign up** at https://supabase.com
2. **Create new project**
3. **Go to Settings → Database**
4. **Copy connection string**:
   ```bash
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Option 3: Railway

1. **Sign up** at https://railway.app
2. **Create new project**
3. **Add PostgreSQL service**
4. **Copy DATABASE_URL** from environment variables

### Option 4: Heroku Postgres

```bash
# Add Heroku Postgres addon
heroku addons:create heroku-postgresql:hobby-dev

# Get connection string
heroku config:get DATABASE_URL
```

## Data Seeding

### Create Seed Script

Create `scripts/seed.ts`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed CV data
    await db.insert(schema.cvData).values([
      {
        section: 'personal',
        data: {
          name: 'Sophie Uwase',
          title: 'Web Developer & IT Professional',
          email: 'uwasesophie101@gmail.com',
          phone: '+250783199810',
          location: 'Kigali, Rwanda',
          summary: 'Passionate Web Developer and IT Professional with expertise in full-stack development, network administration, and system troubleshooting.'
        }
      },
      {
        section: 'experience',
        data: [
          {
            role: 'Field Support Officer',
            organization: 'International Organization for Migration (IOM)',
            location: 'Kigali, Rwanda',
            period: 'Jan 2025 - Apr 2025',
            achievements: [
              'Assisted in logistical coordination, data collection, and reporting to support program implementation.',
              'Collaborated with teams to resolve operational challenges, leveraging IT skills to troubleshoot technical issues in field settings.',
              'Provided critical field support for operations in Kigali, ensuring compliance with IOM policies and procedures.'
            ]
          },
          {
            role: 'IT Support',
            organization: 'Career Access Africa',
            location: 'Kigali, Rwanda',
            period: 'May 2024 – Sept 2024',
            achievements: [
              'Designed, developed, and launched a user-friendly website tailored to meet Career Access Africa\'s branding and functional needs.',
              'Monitored network and system performance, identifying and resolving anomalies to ensure high availability.',
              'Oversaw IT infrastructure development, implementation, and maintenance for CAA.',
              'Provided strategic oversight for IT operations, including hardware, network configuration, and compliance with IT policies.'
            ]
          }
        ]
      },
      {
        section: 'education',
        data: [
          {
            degree: 'Bachelor of Networks and Communication Systems',
            institution: 'Adventist University of Central Africa (AUCA)',
            location: 'Kigali, Rwanda',
            period: 'Jan 2021 - Feb 2025',
            courses: [
              'Linux Administration',
              'Network Administration',
              'Network Security',
              'Java Programming',
              'Web Design',
              'Web Technology',
              'Cloud Technologies'
            ]
          }
        ]
      },
      {
        section: 'skills',
        data: {
          technical: [
            'Web development (HTML, CSS, PHP, Java, JavaScript)',
            'MySQL Database',
            'Computer Maintenance',
            'Network Configuration',
            'Troubleshooting',
            'Network Security',
            'Server Management'
          ],
          soft: [
            'Teamwork',
            'Time Management',
            'Problem-Solving',
            'Active Listening',
            'Communication Skills',
            'Adaptability'
          ],
          languages: ['Kinyarwanda (Fluent)', 'English (Fluent)']
        }
      }
    ]);

    // Seed journal entries
    await db.insert(schema.journalEntries).values([
      {
        title: 'My Journey into Web Development',
        content: 'Starting my career in web development has been an incredible journey. From learning HTML and CSS to mastering JavaScript frameworks, every day brings new challenges and opportunities to grow. I\'ve discovered that the key to success in this field is not just technical skills, but also the ability to understand user needs and translate them into intuitive digital experiences.',
        excerpt: 'Starting my career in web development has been an incredible journey.',
        slug: 'my-journey-into-web-development',
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'Building Networks, Building Futures',
        content: 'My education in Networks and Communication Systems has given me a solid foundation in understanding how technology connects us all. It\'s fascinating to see how networking principles apply to both technical systems and human relationships. Whether I\'m configuring a router or collaborating with a team, the same principles of clear communication and reliable connections apply.',
        excerpt: 'My education in Networks and Communication Systems has given me a solid foundation.',
        slug: 'building-networks-building-futures',
        publishedAt: new Date('2024-02-10'),
      },
      {
        title: 'The Power of Problem-Solving',
        content: 'Working in IT support has taught me that every problem has a solution. Whether it\'s troubleshooting a network issue or developing a new feature, the key is to approach challenges with patience and creativity. I\'ve learned to break down complex problems into smaller, manageable pieces and tackle them systematically.',
        excerpt: 'Working in IT support has taught me that every problem has a solution.',
        slug: 'the-power-of-problem-solving',
        publishedAt: new Date('2024-03-05'),
      }
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

export default seed;
```

### Create Reset Script

Create `scripts/reset.ts`:

```typescript
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
    await db.delete(schema.analytics);
    await db.delete(schema.contacts);
    await db.delete(schema.journalEntries);
    await db.delete(schema.cvData);
    await db.delete(schema.users);

    console.log('🗑️  All data deleted');

    // Re-seed the database
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
  reset().catch((error) => {
    console.error('Reset failed:', error);
    process.exit(1);
  });
}
```

## Database Operations

### Running Migrations

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (for development)
npm run db:push
```

### Seeding Data

```bash
# Seed database with initial data
npm run db:seed

# Reset and re-seed database
npm run db:reset
```

### Database GUI

```bash
# Open Drizzle Studio (web-based database GUI)
npm run db:studio

# Access at http://localhost:4983
```

### Backup and Restore

Create `scripts/backup.ts`:

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  
  try {
    await execAsync(`pg_dump ${process.env.DATABASE_URL} > backups/${filename}`);
    console.log(`✅ Backup created: backups/${filename}`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

backup();
```

### Connection Management

Create `lib/db.ts`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

let db: ReturnType<typeof drizzle>;
let pool: Pool;

export function getDatabase() {
  if (!db) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum number of connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
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
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list postgresql     # macOS

# Check port availability
lsof -i :5432

# Test connection
psql $DATABASE_URL
```

#### 2. Authentication Failed
```bash
# Check user permissions
psql -c "SELECT usename, usesuper FROM pg_user;"

# Reset password
psql -c "ALTER USER sophie WITH PASSWORD 'newpassword';"
```

#### 3. Database Does Not Exist
```bash
# Create database
createdb sophie_portfolio

# Or using SQL
psql -c "CREATE DATABASE sophie_portfolio;"
```

#### 4. Migration Errors
```bash
# Check migration status
npm run db:studio

# Reset migrations (DANGER: loses data)
rm -rf drizzle/migrations/*
npm run db:generate
npm run db:push
```

#### 5. Permission Denied
```bash
# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE sophie_portfolio TO sophie;"
psql -d sophie_portfolio -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sophie;"
```

### Performance Optimization

#### Indexes
```sql
-- Add indexes for better query performance
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_published_at ON journal_entries(published_at);
CREATE INDEX idx_cv_data_section ON cv_data(section);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
```

#### Connection Pooling
```typescript
// Optimize connection pool settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: true
});
```

### Monitoring

#### Query Performance
```sql
-- Enable query logging (PostgreSQL)
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log slow queries

-- Reload configuration
SELECT pg_reload_conf();
```

#### Database Size
```sql
-- Check database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Security Best Practices

#### Database Security
```sql
-- Create read-only user for analytics
CREATE USER analytics_reader WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE sophie_portfolio TO analytics_reader;
GRANT USAGE ON SCHEMA public TO analytics_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_reader;

-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO sophie;
```

#### Environment Variables
```bash
# Use strong passwords
DATABASE_URL=postgresql://user:$(openssl rand -base64 32)@host/db

# Enable SSL for production
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

---

## Summary

This database setup provides:

✅ **Robust Schema Design** with proper relationships and constraints  
✅ **Type-Safe Operations** using Drizzle ORM and Zod validation  
✅ **Migration System** for schema versioning and updates  
✅ **Comprehensive Seeding** with realistic development data  
✅ **Production-Ready Configuration** for various hosting providers  
✅ **Performance Optimization** with proper indexing and pooling  
✅ **Security Best Practices** for data protection  
✅ **Monitoring and Troubleshooting** tools for maintenance  

The database integrates seamlessly with the existing portfolio application while providing a foundation for future scalability and feature additions.