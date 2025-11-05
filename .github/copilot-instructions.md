# GitHub Copilot Instructions

## Project Shape

- Turborepo monorepo managed with Bun (`bun@1.2.20`).
- Main app lives in `apps/web` (Next.js 16, React 19, Tailwind CSS 4, shadcn/ui).
- Shared packages in `packages/api` (oRPC routers), `packages/auth` (better-auth), and `packages/db` (Drizzle ORM + PostgreSQL).

## General Conventions

- Author code in TypeScript (ESM modules) and keep imports using absolute aliases configured in `tsconfig` (e.g. `@/components/...`).
- Prefer async/await, early returns, and small, composable helpers; avoid promise `.then` chains.
- Follow Prettier defaults with semicolons and double quotes; let Tailwind class order be handled automatically.
- Keep comments scarce and focused on non-obvious intent or caveats.
- User-facing copy should default to Bahasa Indonesia unless the surrounding UI already uses English.

## Frontend (`apps/web`)

- The `app` router defaults to React Server Components; only add `"use client"` when hooks, state, or browser APIs are required.
- Reuse existing shadcn/ui primitives from `apps/web/src/components/ui` and compose variants with the shared `cn` helper.
- Style exclusively with Tailwind utility classes (Tailwind CSS v4 syntax); avoid inline styles and keep custom CSS inside `index.css` if necessary.
- Data fetching on the server should call the shared `client` from `@/utils/orpc`; client components should derive query configs from `orpc` and wrap them with TanStack React Query hooks.
- Forms are built with `@tanstack/react-form` and validated with Zod; return localized error messages and surface toasts via `sonner`.
- Use the shared `Loader` component for pending states and prefer progressive enhancement patterns (Suspense, skeletons, optimistic UI) where relevant.

## API Layer (`packages/api`)

- Declare routers under `packages/api/src/routers`; compose them into `appRouter` and export typed clients via oRPC.
- Build procedures with `publicProcedure` and `protectedProcedure`; throw `ORPCError` for typed failures and log via provided interceptors.
- Request context comes from `createContext`, which attaches Better Auth sessions—propagate through middleware rather than re-fetching in handlers.

## Database (`packages/db`)

- Define schemas with Drizzle `pgTable`; keep column names snake_case by passing explicit column identifiers while exposing camelCase property names.
- Use shared helpers (`db`, `eq`, `createSelectSchema`) and seed utilities (`drizzle-seed`) that already respect the project casing rules.
- Guard invariants with `check` constraints and prefer composable query helpers over raw SQL.

## Authentication (`packages/auth` & web utilities)

- Rely on the exported `auth` instance (Better Auth + Drizzle adapter) server-side; use `authClient` from `apps/web/src/lib/auth-client` for client flows.
- Maintain session-aware logic by reading from oRPC context or Better Auth helpers instead of manually parsing cookies.

## Tooling & Workflows

- Use `bun` scripts (`bun dev`, `bun build`, `bun db:*`) and Turborepo pipelines; do not suggest npm/yarn commands.
- Format with `bun format`/`bun format:check`; there is no dedicated lint task yet.
- Follow Conventional Commits (`feat: …`, `fix: …`) when drafting commit messages.

Adhering to these guidelines keeps Copilot suggestions aligned with the project’s patterns, tooling, and localization requirements.
