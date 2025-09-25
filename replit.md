# Overview

This is a comprehensive job board and career development platform built with React, TypeScript, Express, and PostgreSQL. The platform provides job listings, internships, learning roadmaps, coding problems, articles, and portfolio building tools. It features AI-powered content generation using Google's Gemini API and resume analysis capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for client-side routing with lazy-loaded components for performance
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod schema validation for type-safe forms
- **Styling**: Tailwind CSS with CSS custom properties for theming and design tokens

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Uploads**: Multer middleware for handling multipart form data
- **Development**: Vite middleware integration for hot module replacement in development

## Database Design
- **Database**: PostgreSQL with connection via Neon serverless adapter
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Tables**: Users, jobs, articles, roadmaps, DSA problems, portfolios, and resume analyses
- **Data Types**: JSON fields for arrays (skills, tags, technologies) and structured data (project details, roadmap steps)

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Role-based Access**: User roles (admin/user) for content management permissions
- **File Security**: Type and size validation for uploaded files

## API Architecture
- **REST Endpoints**: RESTful API design with CRUD operations for all entities
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom logging middleware for API request tracking
- **File Processing**: Support for multiple file formats (PDF, DOC, images) with size limits

## AI Integration
- **Content Generation**: Google Gemini API for automated job postings, articles, and roadmaps
- **Resume Analysis**: AI-powered resume parsing and ATS compatibility scoring
- **Text Processing**: File content extraction and analysis capabilities

## Development Environment
- **Monorepo Structure**: Shared types and schemas between frontend and backend
- **Hot Reload**: Vite development server with Express middleware integration
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **Type Safety**: End-to-end TypeScript with shared schema validation

## Component Architecture
- **Design System**: Atomic design principles with reusable UI components
- **Animations**: Custom animation components for parallax effects, scrolling animations, and stacked cards
- **Form Components**: Specialized components for content management and portfolio building
- **Layout Components**: Responsive design with mobile-first approach

# External Dependencies

## Core Technologies
- **Database**: PostgreSQL via Neon serverless platform for scalable data storage
- **AI Services**: Google Gemini API for content generation and text analysis
- **UI Components**: Radix UI primitives for accessible, unstyled component foundations

## Development Tools
- **Build Tools**: Vite for frontend bundling, esbuild for server compilation
- **Validation**: Zod for runtime type validation and schema definition
- **Styling**: Tailwind CSS with PostCSS for utility-first styling

## File Handling
- **Upload Processing**: Multer for multipart form handling
- **Storage**: Local file system storage with type validation

## Session & State
- **Client State**: TanStack React Query for server state caching and synchronization
- **Session Store**: PostgreSQL-based session storage for user authentication

## Replit Integration
- **Development**: Replit-specific Vite plugins for enhanced development experience
- **Error Handling**: Runtime error overlay plugin for better debugging