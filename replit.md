# Sophie Uwase - Terminal Portfolio

## Overview

This is a personal portfolio website for Sophie Uwase built as an interactive terminal-style interface. The application simulates a command-line environment where visitors can explore Sophie's professional experience, contact information, journal entries, and more through typed commands. The project showcases a unique approach to portfolio presentation with a retro terminal aesthetic while maintaining modern web development practices.

**Latest Updates (January 2025)**:
- ✅ Vercel deployment configuration with serverless API functions
- ✅ SendGrid email integration for contact form functionality  
- ✅ OpenAI GPT-4 integration for AI-powered Q&A with intelligent fallback system
- ✅ Enhanced mobile responsiveness across all screen sizes
- ✅ Interactive video player simulation for introduction command
- ✅ Improved typewriter animation with proper cursor positioning
- ✅ Comprehensive testing and documentation for production deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with custom terminal-themed color variables and Shadcn/UI components
- **UI Philosophy**: Terminal-style interface with monospace fonts (JetBrains Mono) and retro computing aesthetics
- **State Management**: React hooks for local state with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints
- **Architecture Pattern**: RESTful API design with clear separation of concerns
- **Storage Layer**: In-memory storage implementation (MemStorage) for development/demo purposes
- **Data Models**: Structured schemas for CV data, journal entries, contacts, and user management
- **API Endpoints**: Well-defined REST endpoints for CV data, journal entries, contact submission, and AI Q&A functionality

### Database Schema Design
The application uses Drizzle ORM with PostgreSQL-compatible schema definitions:
- **Users Table**: Basic user authentication with username/password
- **Contacts Table**: Contact form submissions with timestamps
- **Journal Entries Table**: Blog-style posts with title, content, and dates
- **CV Data Table**: Structured professional information stored as JSONB

### Terminal Interface Features
- **Command System**: Implements commands like /help, /cv, /profiles, /contact, /journal, /ask, /clear, /intro
- **Auto-suggestions**: Real-time command completion with zsh-style behavior and mobile optimization
- **Command History**: Arrow key navigation through previously entered commands
- **Typewriter Effect**: Improved animated text display with proper cursor positioning
- **Modal System**: Context-appropriate modals for contact forms and interactive video player
- **Mobile Responsive**: Fully responsive design optimized for all screen sizes
- **AI Integration**: Intelligent Q&A system powered by OpenAI GPT-4 with contextual fallback responses

### Component Architecture
- **Modular Design**: Reusable UI components following atomic design principles
- **Custom Hooks**: Terminal-specific hooks for command history and mobile detection
- **Component Library**: Comprehensive Shadcn/UI components adapted for terminal theme

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod validation
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Modern build tool with hot module replacement
- **Express.js**: Node.js web framework for API layer

### Database & ORM
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Connection Pooling**: Built-in connection management for scalability

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom terminal theme
- **Shadcn/UI**: High-quality React components with Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI elements
- **Class Variance Authority**: Component variant management
- **Lucide React**: Modern icon library

### State Management & Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **Wouter**: Minimalist routing library for single-page application navigation

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **Drizzle Kit**: Database migration and schema management tools

### Deployment & Development
- **Vercel Integration**: Production deployment with serverless functions and static hosting
- **Replit Integration**: Development environment with live preview capabilities
- **Environment Variables**: Configuration management for database connections, email, and AI services
- **Development Scripts**: Automated build and development workflows
- **Email Service**: SendGrid integration for contact form functionality
- **AI Service**: OpenAI GPT-4 integration for intelligent Q&A responses

### Production Services
- **Vercel**: Static site hosting with serverless API functions
- **SendGrid**: Transactional email service for contact form submissions
- **OpenAI**: AI-powered conversational interface for portfolio inquiries
- **Environment Configuration**: Secure handling of API keys and service credentials

The architecture prioritizes developer experience, type safety, and performance while maintaining the unique terminal aesthetic that sets this portfolio apart from traditional web portfolios.