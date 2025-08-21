# Sophie Uwase Portfolio - Local Development Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup (Optional)](#database-setup-optional)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Check your version
   node --version
   npm --version
   
   # Install from https://nodejs.org if needed
   ```

2. **Git** (for version control)
   ```bash
   # Check installation
   git --version
   
   # Install from https://git-scm.com if needed
   ```

3. **Code Editor** (recommended: VS Code)
   - Download from https://code.visualstudio.com
   - Recommended extensions:
     - TypeScript and JavaScript Language Features
     - Tailwind CSS IntelliSense
     - ES7+ React/Redux/React-Native snippets
     - Auto Rename Tag
     - Prettier - Code formatter

### Optional Tools

1. **PostgreSQL** (for database integration)
   - Download from https://postgresql.org/download
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Postman or Insomnia** (for API testing)
   - Postman: https://postman.com
   - Insomnia: https://insomnia.rest

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd sophie-portfolio

# Or if starting from scratch
mkdir sophie-portfolio
cd sophie-portfolio
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - React, TypeScript, Vite (frontend)
# - Express, Drizzle ORM (backend)
# - Tailwind CSS, Shadcn/UI (styling)
# - OpenAI, SendGrid (services)
# - All development tools
```

### 3. Verify Installation

```bash
# Check that all packages installed correctly
npm list --depth=0

# Verify TypeScript compilation
npx tsc --noEmit

# Check linting (if configured)
npx eslint . --ext .ts,.tsx
```

## Environment Configuration

### 1. Create Environment File

```bash
# Create environment file
cp .env.example .env

# Or create manually
touch .env
```

### 2. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Development Configuration
NODE_ENV=development
PORT=5000

# Database Configuration (if using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/sophie_portfolio
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=sophie_portfolio
PGHOST=localhost

# Email Service (Optional - for contact form)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# AI Service (Optional - for Q&A feature)
OPENAI_API_KEY=your_openai_api_key_here

# Security (for production)
SESSION_SECRET=your_random_session_secret
BCRYPT_ROUNDS=10
```

### 3. Get API Keys (Optional)

#### SendGrid Setup (for email functionality)
1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy the key to `SENDGRID_API_KEY`
5. Verify a sender email in Settings → Sender Authentication

#### OpenAI Setup (for AI chat)
1. Sign up at https://platform.openai.com
2. Go to API Keys
3. Create a new secret key
4. Copy the key to `OPENAI_API_KEY`
5. Add billing information and credits

## Database Setup (Optional)

The application works with in-memory storage by default, but you can set up PostgreSQL for persistent data.

### Option 1: Local PostgreSQL Installation

#### Install PostgreSQL

**On macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create user and database
createuser -s your_username
createdb sophie_portfolio
```

**On Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser --interactive your_username
sudo -u postgres createdb sophie_portfolio
```

**On Windows:**
1. Download from https://postgresql.org/download/windows
2. Run installer and follow setup wizard
3. Use pgAdmin or command line to create database

#### Configure Database Connection

```bash
# Update your .env file
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/sophie_portfolio
```

### Option 2: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name sophie-postgres \
  -e POSTGRES_USER=sophie \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sophie_portfolio \
  -p 5432:5432 \
  -d postgres:15

# Update .env file
DATABASE_URL=postgresql://sophie:password@localhost:5432/sophie_portfolio
```

### Option 3: Cloud Database (Neon, Supabase, etc.)

#### Using Neon (Recommended for production)
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update your `.env` file:
   ```bash
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

### Database Schema Setup

Once you have PostgreSQL running:

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Push schema to database
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

### Database Management Commands

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Running the Application

### 1. Development Mode

```bash
# Start the development server
npm run dev

# This starts:
# - Vite dev server on http://localhost:3000 (frontend)
# - Express server on http://localhost:5000 (backend)
# - Both servers with hot reload enabled
```

### 2. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

### 3. Available Scripts

```bash
# Development
npm run dev          # Start development servers
npm run build        # Build for production
npm run preview      # Preview production build
npm start            # Start production server

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with sample data

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Linting and Formatting
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier

# Type Checking
npm run type-check   # Check TypeScript types
```

## Development Workflow

### 1. Project Structure

```
sophie-portfolio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── data/           # Static data and constants
│   │   └── App.tsx         # Main application component
│   ├── dist/               # Built frontend files
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route handlers
│   ├── storage.ts          # Data storage interface
│   └── vite.ts             # Vite integration
├── api/                    # Vercel serverless functions
│   └── server.ts           # Serverless API handler
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema and types
├── docs/                   # Documentation
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── drizzle.config.ts       # Database configuration
```

### 2. Making Changes

#### Adding New Features

1. **Update Database Schema** (if needed)
   ```bash
   # Edit shared/schema.ts
   # Generate migration
   npm run db:generate
   # Apply migration
   npm run db:migrate
   ```

2. **Add API Endpoints**
   ```bash
   # Edit server/routes.ts
   # Update storage interface in server/storage.ts
   ```

3. **Create Frontend Components**
   ```bash
   # Add components in client/src/components/
   # Update routing in client/src/App.tsx
   ```

4. **Test Changes**
   ```bash
   # Run development server
   npm run dev
   # Test functionality
   # Run tests
   npm test
   ```

#### Adding New Dependencies

```bash
# Add frontend dependency
npm install package-name

# Add development dependency
npm install -D package-name

# Update types if needed
npm install -D @types/package-name
```

### 3. Code Style Guidelines

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Prefer `interface` over `type` for object shapes

#### React
- Use functional components with hooks
- Follow React Query patterns for data fetching
- Use proper error boundaries
- Implement loading states for better UX

#### Styling
- Use Tailwind CSS for all styling
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Maintain consistent spacing and typography

## Testing

### 1. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- terminal.test.tsx
```

### 2. Writing Tests

#### Component Tests
```typescript
// Example: client/src/components/__tests__/Terminal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Terminal } from '../Terminal';

describe('Terminal Component', () => {
  it('should display welcome message', () => {
    render(<Terminal />);
    expect(screen.getByText(/welcome to sophie/i)).toBeInTheDocument();
  });

  it('should handle command input', () => {
    render(<Terminal />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '/help' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/available commands/i)).toBeInTheDocument();
  });
});
```

#### API Tests
```typescript
// Example: server/__tests__/routes.test.ts
import request from 'supertest';
import app from '../index';

describe('API Routes', () => {
  it('should return CV data', async () => {
    const response = await request(app).get('/api/cv');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });

  it('should handle contact form submission', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    };
    
    const response = await request(app)
      .post('/api/contact')
      .send(contactData);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
```

### 3. Test Database Setup

```bash
# Create test database
createdb sophie_portfolio_test

# Set test environment variable
export DATABASE_URL_TEST=postgresql://username:password@localhost:5432/sophie_portfolio_test

# Run migrations for test database
npm run db:migrate -- --env=test
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Error: Port 5000 is already in use
# Solution: Kill the process or use different port
lsof -ti:5000 | xargs kill -9
# Or set PORT=5001 in .env
```

#### 2. Database Connection Issues
```bash
# Error: connection refused
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list postgresql     # macOS

# Check connection string
psql $DATABASE_URL
```

#### 3. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf client/dist
npm install

# Check TypeScript configuration
npx tsc --showConfig
```

#### 4. Missing Environment Variables
```bash
# Error: API key not found
# Check .env file exists and has correct variables
cat .env | grep API_KEY

# Restart development server after adding variables
npm run dev
```

#### 5. Build Errors
```bash
# Clear build cache
rm -rf client/dist
rm -rf node_modules/.cache

# Rebuild
npm run build
```

### Getting Help

#### Log Files
- Development logs: Check terminal output where `npm run dev` is running
- Production logs: Check your hosting provider's logs
- Database logs: Check PostgreSQL logs

#### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run dev

# Enable specific debug namespace
DEBUG=express:* npm run dev
```

#### Community Support
- GitHub Issues: Report bugs and feature requests
- Stack Overflow: Technical questions with tags `react`, `express`, `typescript`
- Discord/Slack: Real-time help from community

## Contributing

### 1. Development Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/sophie-portfolio.git
cd sophie-portfolio

# Add upstream remote
git remote add upstream https://github.com/original/sophie-portfolio.git

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# Test thoroughly
npm test
npm run type-check
npm run lint

# Commit with descriptive message
git add .
git commit -m "feat: add new terminal command for skills"

# Push to your fork
git push origin feature/your-feature-name
```

### 3. Submitting Changes

1. Create pull request on GitHub
2. Ensure all tests pass
3. Add description of changes
4. Wait for code review
5. Address feedback if needed

### 4. Code Review Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Ensure backward compatibility

## Production Deployment

### 1. Environment Setup

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=your_production_database_url
SENDGRID_API_KEY=your_production_sendgrid_key
OPENAI_API_KEY=your_production_openai_key
```

### 2. Build and Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to your hosting provider
# (See DEPLOYMENT.md for specific instructions)
```

### 3. Health Checks

```bash
# Check application health
curl https://your-domain.com/api/health

# Monitor logs and performance
# Set up alerts for errors and downtime
```

---

## Quick Start Summary

For developers who want to get started quickly:

```bash
# 1. Clone and install
git clone <repo-url>
cd sophie-portfolio
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Start development
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

The application will work with in-memory storage. Add database configuration only if you need persistent data.

---

*For deployment to Vercel, see DEPLOYMENT.md*  
*For testing details, see TEST_REPORT.md*