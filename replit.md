# AI Image Enhancer Pro

## Overview

This is a full-stack web application for AI-powered image enhancement built with Express.js backend and React frontend. The application allows users to upload images and apply various AI enhancement techniques including upscaling, denoising, sharpening, and restoration.

## User Preferences

Preferred communication style: Simple, everyday language.
Layout preference: Compact side-by-side sections for upload and enhancement options.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **File Handling**: Multer for multipart file uploads
- **Database**: PostgreSQL with Drizzle ORM for database operations (DatabaseStorage implementation)
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Vite integration for hot module replacement in development

## Key Components

### Database Schema
The application uses two main tables:
- **users**: Basic user management (id, username, password)
- **enhancements**: Track image enhancement jobs (id, original/enhanced paths, type, status, processing time, user association)

### File Upload System
- Multer configuration with 50MB file size limit
- Support for JPEG, PNG, and WebP formats
- Files stored in local filesystem with organized directory structure
- Temporary upload directory for processing

### AI Processing Pipeline
- Simulated AI processing with configurable delays (2-5 seconds)
- Four enhancement types: upscale, denoise, sharpen, restore
- Status tracking through database (processing → completed/failed)
- Real-time status updates via polling

### Authentication
- Simple username/password authentication
- Session-based authentication with PostgreSQL storage
- Optional guest usage (enhancements without user accounts)

## Data Flow

1. **Image Upload**: User selects file → Frontend validation → Multer processes upload → File saved to uploads directory
2. **Enhancement Processing**: Enhancement record created in database → AI processing simulation → Enhanced image generated → Database updated with results
3. **Status Monitoring**: Frontend polls enhancement status → Real-time updates displayed → Download available when completed
4. **History Management**: Recent enhancements displayed in sidebar → User can download previous results

## External Dependencies

### Database
- **Neon Database**: PostgreSQL-compatible serverless database
- **Connection**: Uses @neondatabase/serverless driver
- **Environment**: Requires DATABASE_URL environment variable

### Frontend Libraries
- **Radix UI**: Comprehensive component primitives for accessibility
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation
- **Wouter**: Lightweight client-side routing
- **Date-fns**: Date formatting and manipulation

### Backend Libraries
- **Drizzle ORM**: Type-safe database operations
- **Multer**: File upload handling
- **Express Session**: Session management
- **Zod**: Schema validation for API requests

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Integrated development environment with backend and frontend running together

### Production Build
- **Frontend**: Vite builds optimized static assets to dist/public
- **Backend**: esbuild bundles server code to dist/index.js
- **Assets**: Static files served by Express in production

### Environment Configuration
- Development: NODE_ENV=development with tsx
- Production: NODE_ENV=production with compiled JavaScript
- Database: Requires DATABASE_URL for PostgreSQL connection
- File Storage: Local filesystem (uploads/ directory)

### Key Architectural Decisions

1. **Simulated AI Processing**: Uses setTimeout to simulate real AI processing, making it easy to integrate with actual AI services like Replicate later
2. **Polling Strategy**: Frontend polls server every 2 seconds for status updates instead of WebSockets for simplicity
3. **File Storage**: Local filesystem storage chosen for development simplicity, easily replaceable with cloud storage
4. **Database Integration**: PostgreSQL database with Drizzle ORM for persistent data storage, replacing in-memory storage
5. **Monorepo Structure**: Single repository with shared types and schemas between frontend and backend
6. **Component Architecture**: Heavily componentized React frontend with reusable UI components
7. **Type Safety**: Full TypeScript implementation with shared types between client and server
8. **Compact Layout**: Side-by-side upload and enhancement sections for efficient use of horizontal space

## Recent Enhancements (July 2025)

### Documentation Package
- **Comprehensive User Manual**: 32KB HTML document with complete interface guide and usage instructions
- **Professional Deployment Guide**: 17KB HTML document with Replit and manual deployment instructions
- **PDF Export Support**: Browser-based HTML to PDF conversion for professional documentation
- **Documentation Generator**: Automated script for creating styled HTML documentation from markdown

### Processing Pipeline Improvements
- **4-Stage Progress Tracking**: Upload & Validation → AI Enhancement → Quality Optimization → Final Rendering
- **Real-time Progress Updates**: Color-coded stages with dynamic status indicators (gray → blue → green)
- **Enhanced Progress Display**: Compact processing stages with proper height allocation (320px)
- **Time-based Progression**: Realistic progress timing with estimated completion times

### Storage Management Features
- **Clear Storage Button**: User-controlled cleanup of completed enhancements
- **Processing Protection**: Preserves active processing jobs during cleanup operations
- **File System Cleanup**: Removes both database records and associated files
- **Storage Optimization**: Efficient space management with user control

### Revenue Generation Features
- **Advertisement Integration**: Professional ad placement in sidebar with responsive design
- **Affiliate Marketing**: Curated tool recommendations with hover effects and conversion optimization
- **Monetization Strategy**: Freemium model with premium enhancement options
- **Professional Interface**: Dark theme optimized for revenue generation