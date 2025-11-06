# Village Administration System

Website administrasi terbaik untuk mata kuliah Projek Rekayasa Perangkat Lunak (PRPL) di Universitas Gadjah Mada. (Kevin Andreas Sitanggang)

## Modules

- Inventaris dan Kekayaan (Kelompok 2)
- Peraturan Desa (Kelompok 7)
- Keputusan Kepala Desa (Kelompok 8)

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun db:push
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.
Open [http://localhost:3001](http://localhost:3001/api/rpc/api-reference) in your browser to see the generated API documentation.

4. Start drizzle studio for database management:

```bash
bun db:studio
```

Open [http://local.drizzle.studio](http://local.drizzle.studio) in your browser to see the database management page.

## Project Structure

```
desa/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun db:start`: Start local database instance
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI

## Commit Convention

We follow a [standardized commit message](https://conventionalcommits.org) format to maintain a clean and informative git history. Each commit message should be structured as follows:

```
<type>(<scope>): <subject>
```

### Types:

- **feat** - A new feature
- **fix** - A bug fix
- **build** - Changes to libraries, etc
- **docs** - Documentation changes
- **refactor** - Code changes that neither fix a bug nor add a feature
- **perf** - Changes that improve performance
- **test** - Adding or updating tests
- **chore** - Changes to build process, auxiliary tools, or libraries

### Scope:

The scope is optional and can be anything specifying the place of the commit change (component, page, or file name).

### Subject:

The subject contains a brief description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
