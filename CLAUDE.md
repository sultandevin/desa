# DESA - Village Administration System

## Project Overview

**DESA** (Desa = Village in Indonesian) is a **Village Administration System** built as a fullstack application for the "Projek Rekayasa Perangkat Lunak (PRPL)" university course at Universitas Gadjah Mada (UGM).

The system provides web-based administration for village management across three main modules:
- **Inventaris dan Kekayaan** (Inventory and Assets) - Group 2
- **Peraturan Desa** (Village Regulations) - Group 7
- **Keputusan Kepala Desa** (Village Head Decisions) - Group 8

## High-Level Architecture

This is a **monorepo** using **Turborepo** for build optimization and task orchestration. It follows a modern full-stack TypeScript architecture with clear separation of concerns.

### Directory Structure

```
desa/
├── apps/
│   └── web/                    # Next.js fullstack application (frontend + API routes)
│       ├── src/
│       │   ├── app/            # Next.js App Router pages and layouts
│       │   │   ├── (auth)/     # Authentication pages (login, sign-up)
│       │   │   ├── api/        # API route handlers
│       │   │   │   ├── rpc/    # oRPC endpoint for type-safe API calls
│       │   │   │   └── auth/   # Better-Auth endpoints
│       │   │   ├── dashboard/  # Protected dashboard pages
│       │   │   │   └── assets/ # Asset inventory pages
│       │   │   └── components/ # Shared UI components
│       │   ├── components/     # Reusable React components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utility functions and helpers
│       │   ├── utils/          # Additional utility functions
│       │   ├── proxy.ts        # Auth middleware for protected routes
│       │   └── index.css       # Global Tailwind CSS
│       ├── next.config.ts      # Next.js configuration
│       ├── package.json        # Web app dependencies
│       └── .env.example        # Environment variables template
│
├── packages/
│   ├── api/                    # API layer (oRPC routers)
│   │   ├── src/
│   │   │   ├── index.ts        # Procedure factories (publicProcedure, protectedProcedure)
│   │   │   ├── context.ts      # Request context with session
│   │   │   └── routers/        # API endpoint definitions
│   │   │       ├── index.ts    # Main router aggregation
│   │   │       └── asset.ts    # Asset CRUD operations
│   │   └── package.json
│   │
│   ├── db/                     # Database layer (Drizzle ORM)
│   │   ├── src/
│   │   │   ├── index.ts        # Database client initialization
│   │   │   ├── schema/         # Database schema definitions
│   │   │   │   ├── auth.ts     # Better-Auth schema
│   │   │   │   └── asset.ts    # Asset table schema
│   │   │   └── migrations/     # Drizzle migrations
│   │   ├── drizzle.config.ts   # Drizzle ORM configuration
│   │   └── package.json
│   │
│   └── auth/                   # Authentication configuration
│       ├── src/
│       │   └── index.ts        # Better-Auth setup
│       └── package.json
│
├── package.json                # Root workspace configuration
├── turbo.json                  # Turborepo task pipeline
├── tsconfig.base.json          # Shared TypeScript configuration
├── .prettierrc                 # Code formatting rules
└── bun.lock                    # Dependency lock file
```

## Core Technologies & Frameworks

### Frontend
- **Next.js 16.0.0** - React framework with App Router, SSR, and API routes
- **React 19.2.0** - UI library
- **TypeScript 5** - Static type checking
- **TailwindCSS 4.1.10** - Utility-first CSS framework
- **shadcn/ui + Radix UI** - Unstyled, accessible component primitives
- **TanStack Query (React Query)** - Data fetching and caching
- **TanStack React Form** - Form state management
- **TanStack React Table** - Data table component
- **next-themes** - Theme switching (dark/light mode)
- **sonner** - Toast notifications
- **lucide-react** - Icon library
- **Babel React Compiler** - Optimizing React compiler

### Backend/API
- **oRPC (Open RPC)** - End-to-end type-safe API framework
  - Uses Zod schemas for runtime validation and type inference
  - Automatic OpenAPI documentation generation
  - Works with HTTP and custom handlers
- **Next.js API Routes** - Server-side request handling

### Database
- **PostgreSQL** - Primary database
- **Drizzle ORM 0.44.2** - TypeScript-first ORM
  - Type-safe SQL queries
  - Automatic schema management with migrations
  - Zod schema generation from database schema
- **drizzle-kit** - CLI for migrations and database management
- **drizzle-seed** - Seeding for development data

### Authentication
- **Better-Auth 1.3.28** - Full-featured authentication library
  - Email/password authentication
  - Session management with cookies
  - Drizzle adapter for database integration
  - Next.js integration with middleware support

### Build & Dev Tools
- **Bun 1.2.20** - JavaScript runtime and package manager (faster alternative to Node.js/npm)
- **Turborepo 2.5.4** - Monorepo task orchestrator
  - Parallel task execution
  - Smart caching
  - Dependency tracking
- **tsdown** - TypeScript bundler for packages
- **Prettier 3.6.2** - Code formatter with TailwindCSS plugin
- **Wrangler 4.40.3** - Cloudflare Workers CLI
- **opennextjs-cloudflare** - Next.js adapter for Cloudflare Workers deployment

### Development
- **Drizzle Studio** - Database GUI for visual management
- **oRPC API Reference** - Auto-generated API documentation UI

## Build, Test & Development Setup

### Key Scripts

**Root workspace scripts** (from `/package.json`):
```bash
bun dev              # Start all apps in development mode
bun build            # Build all applications
bun check-types      # Type-check all packages and apps
bun start:web        # Start production web server

# Database management
bun db:push          # Push schema changes to database
bun db:studio        # Open Drizzle database GUI
bun db:generate      # Generate new migrations
bun db:migrate       # Run pending migrations
bun db:start         # Start PostgreSQL container (Docker)
bun db:watch         # Run PostgreSQL in foreground
bun db:stop          # Stop PostgreSQL container
bun db:down          # Remove PostgreSQL container

# Utilities
bun format           # Format all code with Prettier
bun format:check     # Check code formatting
```

**Web app specific scripts** (from `apps/web/package.json`):
```bash
npm run dev          # Start Next.js dev server on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview Cloudflare build
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Generate Cloudflare env types
```

**Database package scripts** (from `packages/db/package.json`):
- All db commands are routed through this package
- Uses Docker Compose for PostgreSQL
- Drizzle migrations stored in `src/migrations/`

### Environment Configuration

**Required environment variables** (`.env.example`):
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/desa
BETTER_AUTH_SECRET=<random-generated-string>
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

Located at: `/apps/web/.env`

### TypeScript Configuration

**Strict compiler options** (`tsconfig.base.json`):
- Target: ESNext
- Module: ESNext
- Module Resolution: bundler
- Strict mode enabled
- No unused locals/parameters
- No unchecked indexed access
- Isolated modules enabled
- Verbatim module syntax for clarity

## Architectural Patterns & Decisions

### 1. Monorepo with Turborepo
- **Benefit**: Code reuse across packages, unified build pipeline, fast CI/CD
- **Task Pipeline**: Defined in `turbo.json` with dependency tracking
- **Caching**: Smart cache invalidation based on file changes and env vars

### 2. Type-Safe End-to-End (E2E) API with oRPC
- **Architecture**: API is defined in `packages/api`, consumed in `apps/web`
- **Benefits**:
  - Client-side code is 100% type-safe without code generation
  - Type inference flows from backend Zod schemas to frontend
  - Automatic OpenAPI documentation at `/api/rpc/api-reference`
- **How it works**:
  - Server defines procedures with Zod input/output schemas
  - Client imports the router type and makes type-safe calls
  - Validation happens at both layers

### 3. Layered Architecture
```
apps/web (Next.js App)
  ├─ UI Components (shadcn/ui, custom)
  ├─ Pages & Layouts (App Router)
  ├─ API Routes (Next.js handlers)
  │   └─ Call internal packages
  └─ Client code (hooks, utilities)

packages/api (Business Logic)
  ├─ Routers (endpoint definitions)
  ├─ Context (session extraction)
  └─ Procedures (public vs protected)

packages/db (Data Access)
  ├─ Schema (Drizzle table definitions)
  ├─ Migrations (schema versioning)
  └─ Client (db instance)

packages/auth (Authentication)
  └─ Better-Auth configuration
```

**Benefits**: Clear separation of concerns, testability, reusability

### 4. Protected Routes with Middleware
- **Method**: Uses Better-Auth session cookies
- **Middleware**: `proxy.ts` checks for session before allowing dashboard access
- **Note**: Warning in code suggests more secure per-page auth checks should be added

### 5. Database Schema-Driven Development
- **Approach**: Define schema in TypeScript → Generate migrations → Push to DB
- **Tools**: Drizzle ORM with drizzle-kit
- **Zod Integration**: `drizzle-zod` generates Zod schemas from DB tables for input validation

### 6. Session-Based Authentication
- **Provider**: Better-Auth
- **Storage**: PostgreSQL (via Drizzle adapter)
- **Cookie-Based**: Secure session cookies managed by better-auth
- **Middleware**: Integrated into Next.js request pipeline

### 7. Component-Driven UI Development
- **Design System**: shadcn/ui (Radix UI primitives + TailwindCSS)
- **Theme Support**: `next-themes` with dark/light mode
- **Table Component**: TanStack React Table for asset listings
- **Form Handling**: TanStack React Form + Zod validation

### 8. Optimization Strategies
- **React Compiler**: Babel plugin for automatic memoization
- **API Optimization**: SSR calls remote functions directly instead of HTTP (per recent commit)
- **Caching**: TanStack Query for client-side data caching
- **Build Optimization**: Turborepo caching and parallel execution

## Development Guidelines & Conventions

### Commit Message Convention
Follows [Conventional Commits](https://conventionalcommits.org):
```
<type>(<scope>): <subject>
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `build` - Dependency/lib changes
- `docs` - Documentation
- `refactor` - Code restructuring (no feature/fix)
- `perf` - Performance improvement
- `test` - Test additions/updates
- `chore` - Build process, tools, or libraries

**Example**: `feat(api): add asset filtering endpoint`

### Code Formatting
- **Tool**: Prettier with TailwindCSS plugin
- **Configuration**: `.prettierrc`
- **Ignored**: node_modules, dist, build, .next, .turbo, .wrangler, .bun
- **VSCode Integration**: Auto-format on save (configured in `.vscode/settings.json`)

### VSCode Recommended Extensions
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

### Import Path Management
- VSCode configured to auto-update imports on file move
- Consider using monorepo path aliases for cleaner imports

### Database Development Workflow
1. **Modify schema** in `packages/db/src/schema/*.ts`
2. **Generate migration**: `bun db:generate`
3. **Push to DB**: `bun db:push`
4. **View changes**: `bun db:studio` for GUI

### API Development Workflow
1. **Define procedures** in `packages/api/src/routers/*.ts`
2. **Use Zod schemas** for input/output validation
3. **Import in web app**: `import { appRouter } from "@desa/api"`
4. **Type-safe calls**: Client automatically gets types
5. **View docs**: http://localhost:3001/api/rpc/api-reference

### Authentication Integration
- Better-Auth handles sign-up, sign-in, session management
- Session available in context during API calls
- Use `protectedProcedure` for authenticated endpoints
- Redirect unauthenticated users in middleware

## Notable Technical Decisions

### Why Bun?
- Faster installation and startup times
- Native TypeScript support
- Better compatibility with Next.js 16
- Unified toolchain (package manager + runtime)

### Why oRPC instead of tRPC?
- Simpler server implementation
- Built-in OpenAPI support
- Lighter weight
- Better HTTP integration

### Why Drizzle instead of Prisma?
- TypeScript-first approach
- More control over SQL
- Smaller bundle size
- Better for type-safe schema generation

### Why Better-Auth instead of Auth0/NextAuth.js?
- Lightweight and self-hosted friendly
- Better monorepo compatibility
- Simpler setup for PRPL course scope
- Full control over implementation

### Why Next.js App Router?
- Modern architecture with streaming
- Simpler file-based routing
- Server components by default
- Better performance

## Recent Development Notes

**Recent commits** (from git history):
- **Oct 27**: Optimized SSR by calling remote functions directly instead of via HTTP
- **Oct 27**: Reconfigured bun.lock due to conflicting Next.js package versions
- **Oct 27**: Added start script to root package.json
- **Oct 27**: Added build:web script in root package.json
- **Oct 26**: Added sign-up page and proxy middleware

**Key observations**:
- Project is actively under development
- Focus on performance optimization (SSR improvements)
- Authentication system recently implemented
- Asset inventory module is primary feature under development

## Deployment

### Development
```bash
bun install      # Install dependencies
bun db:start     # Start PostgreSQL (Docker)
bun dev          # Start all services on port 3001
```

### Production Deployment
- **Target**: Cloudflare Workers
- **Tools**: opennextjs-cloudflare, wrangler
- **Command**: `bun deploy` (from web app)

### Database Deployment
- Uses PostgreSQL (must be set up separately in production)
- Drizzle migrations handle schema deployment
- Credentials via `DATABASE_URL` environment variable

## Testing & Quality

- **Type Checking**: `bun check-types` validates TypeScript across all packages
- **Code Formatting**: `bun format` enforces consistent style
- **Unused Code**: TypeScript strict mode catches unused variables/parameters
- **No formal test suite configured yet** (could add Vitest, Jest, Playwright)

## API Structure Example

```typescript
// Define in packages/api/src/routers/asset.ts
export const assetRouter = {
  list: publicProcedure
    .route({ method: "GET", path: "/assets" })
    .input(z.object({ limit, offset }))
    .output(z.array(assetSchema))
    .handler(async ({ input }) => {
      // Database query
    }),
};

// Automatically generated client in apps/web:
const assets = await client.asset.list({ limit: 10 });
// ^ typed as Asset[]
```

## Key Files Reference

| Path | Purpose |
|------|---------|
| `/apps/web/src/app/api/rpc/[[...rest]]/route.ts` | Main API endpoint handler |
| `/apps/web/src/app/api/auth/[...all]/route.ts` | Better-Auth route handler |
| `/packages/api/src/index.ts` | Procedure factories |
| `/packages/db/src/schema/` | Database table definitions |
| `/packages/auth/src/index.ts` | Auth configuration |
| `/turbo.json` | Build task definitions |
| `/.env.example` | Required env vars template |

## Performance Optimizations

1. **React Compiler**: Automatic memoization via Babel plugin
2. **Server Components**: By default in Next.js 13+
3. **Incremental Static Regeneration (ISR)**: Available for static pages
4. **Direct Function Calls in SSR**: Skip HTTP overhead for server renders
5. **TanStack Query**: Client-side caching and deduplication
6. **Turborepo Caching**: Avoid rebuilding unchanged packages

## Security Considerations

1. **Database Credentials**: Must be in environment variables, never committed
2. **Auth Secret**: `BETTER_AUTH_SECRET` must be a secure random string
3. **Session Cookies**: Managed by Better-Auth with secure flags
4. **CORS Origin**: Must be configured to prevent CSRF
5. **Protected Procedures**: Use `protectedProcedure` for auth-required endpoints
6. **Note**: Current middleware auth check insufficient - per-page checks recommended

## Next Steps for Development

Based on the codebase structure, future development should focus on:

1. **Module Expansion**: Implement remaining modules (Peraturan Desa, Keputusan Kepala Desa)
2. **More Routers**: Add API endpoints in `packages/api/src/routers/`
3. **Dashboard Pages**: Expand dashboard with more administrative features
4. **Testing**: Add unit and integration tests
5. **Validation**: Enhance Zod schemas for data validation
6. **UI Components**: Build out more shadcn/ui components
7. **Error Handling**: Implement comprehensive error handling and logging
8. **Documentation**: Add inline documentation and API docs

