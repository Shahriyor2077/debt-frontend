# Qarz Boshqaruvi - Debt Management System

## Overview

A comprehensive debt management system designed for small businesses to track customer debts, payments, and generate reports. The application is built as a full-stack web application with a modern UI that emphasizes data-intensive operations and efficient business workflows.

**Core Purpose**: Enable shop owners to manage customer credit relationships by tracking debt records, payment history, and generating business insights through reports and statistics.

**Primary Language**: Uzbek (Latin script) - all UI labels, navigation, and data fields use Uzbek terminology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- shadcn/ui components built on Radix UI primitives
- "New York" style variant with custom theme configuration
- Material Design-inspired system optimized for data-intensive applications
- Tailwind CSS for styling with custom design tokens

**State Management**:
- TanStack Query (React Query) for server state management
- React Hook Form with Zod validation for form state
- No global client-side state management (relies on server-side state)

**Routing**: 
- Wouter for lightweight client-side routing
- Five main routes: Dashboard (/), Customers (/mijozlar), Debts (/qarzlar), Payments (/tolovlar), Reports (/hisobotlar)

**Design System Decisions**:
- Fixed sidebar navigation (256px width) with collapsible mobile variant
- Typography: Inter font for readability in tables and forms
- Consistent spacing scale using Tailwind's 2/4/6/8/12/16 unit system
- Status badges with color coding (green=paid, yellow=partial, red=overdue)
- Form-heavy interface with validation feedback

**Key Design Patterns**:
- Dialog-based CRUD operations for customers and debts
- Separate payment dialog for recording debt payments
- Confirmation dialogs for destructive actions
- Search and filter capabilities on list views
- Real-time statistics dashboard with card-based metrics

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**:
- RESTful API structure with `/api/*` prefix
- Resource-based endpoints for customers, debts, payments, and stats
- Request/response logging middleware for debugging
- JSON body parsing with raw body capture for potential webhook support

**Architecture Pattern**:
- Storage layer abstraction (IStorage interface)
- DatabaseStorage implementation using Drizzle ORM
- Separation of concerns: routes → storage → database

**Key Endpoints**:
- `/api/stats` - Dashboard statistics aggregation
- `/api/customers` - CRUD operations for customer management
- `/api/debts` - Debt tracking with overdue detection
- `/api/payments` - Payment recording with automatic debt status updates

**Business Logic Highlights**:
- Soft delete for customers (faol/inactive flag)
- Archive functionality for completed debts
- Automatic debt status calculation (to'lanmagan, qisman, to'langan)
- Payment tracking updates parent debt records

### Data Storage

**Database**: PostgreSQL via Neon serverless

**ORM**: Drizzle ORM with WebSocket connection pooling

**Schema Design**:

1. **Customers (mijozlar)**:
   - Core fields: name (ism), phone (telefon), address (manzil), notes (izoh)
   - Soft delete flag (faol)
   - Created timestamp (yaratilganSana)

2. **Debts (qarzlar)**:
   - Foreign key to customers
   - Product/item name (tovarNomi)
   - Financial tracking: total amount, paid amount
   - Temporal data: issue date, due date (qaytarishMuddati)
   - Status field (holati): to'lanmagan, qisman, to'langan
   - Archive flag for completed debts

3. **Payments (to'lovlar)**:
   - Foreign key to debts
   - Payment amount and date
   - Optional notes

**Relationships**:
- One-to-many: Customer → Debts
- One-to-many: Debt → Payments

**Data Integrity**:
- Drizzle schema validation with Zod integration
- Foreign key constraints enforced at database level
- Decimal precision (12,2) for monetary values

### Validation & Type Safety

**Approach**: Schema-first design using Drizzle + Zod

**Implementation**:
- Database schema defined in shared/schema.ts
- Auto-generated Zod schemas for insert operations
- Type inference from database schema to TypeScript
- Frontend and backend share validation logic

**Validation Points**:
- API request body validation (server-side)
- Form input validation (client-side via React Hook Form)
- Database constraint validation (PostgreSQL level)

### Development & Build

**Dev Server**: 
- Vite dev server with HMR
- Express middleware mode for API integration
- Replit-specific plugins for error overlay and development tools

**Production Build**:
- Vite builds frontend to dist/public
- esbuild bundles server code to dist/index.js
- ESM module format throughout

**Type Checking**: Incremental TypeScript compilation with strict mode enabled

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL with WebSocket support for connection pooling
- **Drizzle Kit**: Database migration and schema management tool

### UI Component Libraries
- **Radix UI**: Headless component primitives for accessible UI components
- **shadcn/ui**: Pre-styled component system built on Radix
- **Lucide React**: Icon library for consistent iconography

### Form & Data Management
- **React Hook Form**: Performant form state management
- **Zod**: Schema validation and type inference
- **TanStack Query**: Server state synchronization and caching

### Date Handling
- **date-fns**: Date formatting and manipulation utilities

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variant management
- **tailwind-merge**: Utility for merging Tailwind classes

### Build Tools
- **Vite**: Fast frontend build tool with HMR
- **esbuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and compilation

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation tools
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Routing
- **wouter**: Lightweight client-side routing library (2KB alternative to React Router)