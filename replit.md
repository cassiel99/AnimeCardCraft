# Anime Card Creator App

## Overview

This is a full-stack web application for creating and managing anime-themed trading cards. Users can register, log in, create custom anime cards with various attributes, and manage their card collections. The app features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom anime-themed colors and animations
- **State Management**: TanStack Query (React Query) for server state and React hooks for local state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL session store
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend

## Key Components

### Database Schema
- **Users table**: Stores user credentials and metadata
- **Anime cards table**: Stores card data including name, type, rarity, stats, abilities, and user ownership
- **Session store**: PostgreSQL-based session storage for user authentication

### Authentication System
- Password-based authentication with secure hashing
- Session-based authentication with PostgreSQL persistence
- Protected routes on both frontend and backend
- Auth context provider for React components

### Card Management
- Create cards with various types (character, spell, artifact, summon)
- Multiple rarity levels (common, rare, legendary)
- Stat system (attack, defense, health, mana)
- Ability system with predefined options
- Real-time card preview during creation

### UI Components
- Responsive design with mobile support
- Dark anime-themed styling with custom CSS variables
- Reusable shadcn/ui components
- Form validation with error handling
- Toast notifications for user feedback

## Data Flow

1. **User Registration/Login**: Client sends credentials to `/api/register` or `/api/login`
2. **Authentication**: Server validates credentials and creates session
3. **Card Operations**: 
   - GET `/api/cards` - Fetch user's cards
   - POST `/api/cards` - Create new card
   - PUT `/api/cards/:id` - Update existing card
   - DELETE `/api/cards/:id` - Delete card
4. **Session Management**: Sessions stored in PostgreSQL and managed by connect-pg-simple

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- UI library (Radix UI components, shadcn/ui)
- State management (TanStack Query)
- Form handling (React Hook Form, Hookform resolvers)
- Styling (Tailwind CSS, class-variance-authority, clsx)
- Validation (Zod)
- Date utilities (date-fns)

### Backend Dependencies
- Express.js with middleware
- Authentication (Passport.js, passport-local)
- Database (Drizzle ORM, @neondatabase/serverless)
- Session management (express-session, connect-pg-simple)
- Validation (Zod, drizzle-zod)
- Security (crypto for password hashing)

### Build Tools
- Vite for frontend bundling and development
- esbuild for backend bundling
- TypeScript for type safety
- PostCSS with Tailwind CSS

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Development**: Uses Vite dev server with HMR and Express backend
- **Production**: Builds frontend to static files and bundles backend with esbuild
- **Database**: Configured to use Neon PostgreSQL with connection pooling
- **Environment**: Requires `DATABASE_URL` and `SESSION_SECRET` environment variables
- **Session Storage**: Uses PostgreSQL for session persistence in production

The build process creates a `dist` directory with the bundled backend and `dist/public` with the frontend assets, suitable for deployment on platforms that support Node.js applications.