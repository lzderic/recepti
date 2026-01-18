# Recepti

Recepti is a proof-of-concept application inspired by Coolinarika (https://www.coolinarika.com/).
The UI is intentionally “realistic”, and some elements may look clickable/functional, but are deliberately left as **placeholders** until implemented.
The app is designed to look and feel like a full-featured product, demonstrating how easily it could be extended to a full MVP.
Routes include `/recepti` (recipes list), `/recepti/:slug` (recipe details), and `/recepti/admin` (admin CRUD UI).
There is a product page, and both search and filtering are fully functional.

## Requirements

To run this application locally, you need:

- **Docker** (for running the PostgreSQL database via Docker Compose)
- **Node.js** (version 20 or higher is recommended)
- **npm** (Node.js package manager)

Make sure Docker is running before starting the database. All other dependencies are installed via npm.

## Storybook

Storybook is included for interactive documentation and development of UI components. You can view and test all reusable components in isolation. The static build is generated in the `storybook-static` folder (which is ignored in git).

To run Storybook in development mode:

```sh
npm run storybook
```

To build static Storybook files:

```sh
npm run storybook:build
```

The static files will be available in the `storybook-static` directory.

---

## 🚀 Project Setup (Step-by-Step)

### 1. Create Environment Files

Create `.env` and `.env.local` in the project root with the following content:

#### .env

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/recepti?schema=public
```

#### .env.local

```env
# Frontend
# PostgreSQL (used by Next.js Route Handlers)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/recepti?schema=public

# CDN base (optional). If not set, the app will use /cdn/* on same origin.
NEXT_PUBLIC_CDN_BASE_URL=/cdn

# Assignment-compatible name (server-side). Keep NEXT_PUBLIC_* above for browser usage.
CDN_BASE_URL=/cdn
```

## 🏁 Quick Start with Docker Compose

> **Recommended:** For the easiest and most reliable setup, it is strongly recommended to use Docker Compose to run the entire stack (frontend, Storybook, and database) together.

You can start the entire application stack (frontend, Storybook, and database) using Docker Compose. This is the recommended way for a fully functional local environment.

1. Build all services:

```sh
docker compose build
```

2. Start all services:

```sh
docker compose up
```

This will start:

- The Next.js frontend on `http://localhost:3000`
- Storybook on `http://localhost:6006`
- PostgreSQL database on `localhost:5433`

All services will be up and running, ready for development and testing.

## 🚦 Running Without Docker

If you prefer to run the application without Docker, follow these steps:

1. Make sure you have a local PostgreSQL instance running and accessible. You can use the same connection string as in `.env` (see above), or adjust it to match your local setup.

2. Install all dependencies:

```sh
npm install
```

3. Run Prisma migrations and seed the database:

```sh
npx prisma migrate deploy
npm run seed
```

4. Start the Next.js development server:

```sh
npm run dev
```

5. (Optional) Start Storybook for component development:

```sh
npm run storybook
```

You will then have:

- The Next.js frontend on `http://localhost:3000`
- Storybook on `http://localhost:6006` (if started)
- PostgreSQL database on your configured host/port

This approach is useful if you already have PostgreSQL installed or want to run services separately.

## 🧪 Running Tests

Tests use Vitest. Run:

```sh
npm test
```

---

## 🛡️ Git Hooks & Husky

This repo uses Husky to run quality checks on every commit.

**What runs before commit:**

- `npm run lint`
- `npm run format:check` (Prettier)
- `npm run test`

**Setup:**

```sh
npm install
```

`npm install` runs the `prepare` script and installs the hooks.

If you ever need to skip hooks (e.g. a WIP commit):

```sh
git commit -m "wip" --no-verify
```

---

## 🛠️ Code Style

```sh
npm run lint
npm run format
npm run format:check
```

---

## 📁 Project Structure

```text
docker-compose.yml
README.md
package.json
prisma/
  schema.prisma
  seed.ts
  migrations/
public/
  cdn/
  patterns/
src/
  app/
    layout.tsx
    page.tsx
    api/
      recipes/
      uploads/
      ...
    recepti/
      [slug]/
      admin/
      ...
  components/
    layout/
    ...
  lib/
    api.ts
    cdn.ts
    images.ts
    formatters/
    http/
    server/
    ...
  services/
    recipes.client.ts
    recipes.server.ts
    uploads.client.ts
    ...
  store/
    store.ts
    uiSlice.ts
    ...
  test-utils/
    next.ts
    render.tsx
    server-only.ts
    store.ts
    ...
  types/
    nav.ts
    recipes.ts
    ...
  styles/
    globals.css
    ...
  shared/
    strings.ts
    ...
  stories/
    recipes.fixtures.ts
    ...
  __tests__/
    env.test.ts
    app/
    components/
    lib/
    services/
    ...
vitest.config.ts
vitest.setup.ts
eslint.config.mjs
next.config.ts
tsconfig.json
postcss.config.mjs
Dockerfile.frontend
Dockerfile.storybook
storybook-static/ (ignored)
coverage/
```
