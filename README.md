# Recepti

Vaš zadatak je izraditi mini aplikaciju “Recepti”.

Napomena: ovo je POC inspiriran Coolinarikom.

> **📋 About This Project**  
> A single Next.js codebase that includes UI, API (Route Handlers), and the DB layer (Prisma).

## 📝 Notes

- Recommended: Node.js 20+.
- PostgreSQL runs via Docker Compose and is exposed on `localhost:5433`.
- Next.js runs on `http://localhost:3000`.

## 🚧 Proof of Concept (POC)

This is a **proof of concept** (POC). The UI is intentionally “realistic”, and some elements may look clickable/functional, but are deliberately left as **placeholders** until implemented.

### ✅ What works

- Pages:
  - `/recepti` (recipes list)
  - `/recepti/:slug` (recipe details)
  - `/recepti/admin` (minimal admin UI for CRUD testing)
- API:
  - `GET /api/recipes`, `GET /api/recipes/:slug`
  - (via the admin UI) create/update/delete recipes
- “Fake CDN” route for static images: `GET /cdn/*`

### 🧩 Looks functional, but currently isn’t

- Most sidebar navigation items are **disabled** (greyed out) and exist only for layout/structure.
- On the recipe details page:
  - “Dodaj sliku” button (placeholder)
  - “Napiši komentar” button (placeholder)

---

## 🚀 Project Setup (Step-by-Step)

### 1. Start the Database (PostgreSQL via Docker)

```sh
docker compose up -d db
```

If you previously ran this project with a different DB name, recreate the volume (this deletes DB data):

```sh
docker compose down -v
docker compose up -d db
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create Environment Files

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

### 4. Run Prisma Migrations and Seed the Database

```sh
npx prisma migrate deploy
npm run seed
```

### 5. Start the Development Server

```sh
npm run dev
```

If PowerShell blocks `npm` scripts on Windows, use `npm.cmd` instead.

---

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

## 💡 Useful URLs

- UI:
  - `http://localhost:3000/recepti`
  - `http://localhost:3000/recepti/:slug`
  - `http://localhost:3000/recepti/admin`
- API:
  - `GET http://localhost:3000/api/recipes`
  - `GET http://localhost:3000/api/recipes/:slug`
- Fake CDN:
  - `GET http://localhost:3000/cdn/*`

---

## 📁 Project Structure

```text
docker-compose.yml
README.md
prisma/
  schema.prisma
  seed.ts
  migrations/
public/
  cdn/
  patterns/
src/
  app/
  components/
  lib/
  services/
  store/
  test-utils/
  types/
  styles/
  shared/
  stories/
  __tests__/
  ...
vitest.config.ts
vitest.setup.ts
```
