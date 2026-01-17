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

## 🚀 Install

Install depends on how you want to run the app.

### Option A: everything in Docker (simplest)

From the project root:

If you previously ran this project with a different DB name, recreate the volume (this deletes DB data):

```sh
docker compose down -v
```

Compose project name is set to `recepti` (so containers/volumes are named accordingly). If you had an older stack name, recreate containers:

```sh
docker compose down -v
```

```sh
docker compose up --build
```

---

## ▶️ Run

### Option B: DB in Docker, app locally

1. Start the DB:

```sh
docker compose up -d db
```

If you previously ran this project with a different DB name, recreate the volume first (this deletes DB data):

```sh
docker compose down -v
docker compose up -d db
```

2. Install dependencies and set up env:

```sh
cd frontend
npm install
```

Create `frontend/.env.local` and `frontend/.env` (Prisma CLI reads `.env`).
Tip: start by copying `frontend/.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/recepti?schema=public

NEXT_PUBLIC_CDN_BASE_URL=/cdn
CDN_BASE_URL=/cdn
```

3. Migrations + seed:

```sh
npm run migrate
npm run seed
```

4. Dev server:

```sh
npm run dev
```

Windows note: if PowerShell blocks `npm` scripts, use `npm.cmd` instead.

---

## 🧪 Test

Tests live in `frontend/` (Vitest). Run:

```sh
cd frontend
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
cd frontend
npm install
```

`npm install` runs the `prepare` script and installs the hooks.

If you ever need to skip hooks (e.g. a WIP commit):

```sh
git commit -m "wip" --no-verify
```

---

## 🛠️ Code Style

From `frontend/`:

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
frontend/
  .husky/                 # Husky hooks (pre-commit)
  prisma/                 # Prisma schema + migrations + seed
  public/                 # Static assets (fake CDN content)
  src/
    app/                  # Next.js App Router pages + route handlers
    components/           # UI components
    lib/                  # Shared libs (cdn/http/formatters/images)
    services/             # Client/server service layer
    store/                # Redux store (UI state)
    test-utils/           # UI test helpers (RTL)
  vitest.config.ts
  vitest.setup.ts
```
