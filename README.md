# Cantura

A studio management app for private music teachers. Cantura helps teachers manage students, track repertoire and assignments, and communicate with students and guardians — all in one place.

> **Status:** Early development / MVP

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 7 (driver adapters) |
| Auth | Auth.js v5 (next-auth@beta) — JWT, Credentials provider |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Testing | Vitest + Storybook |
| Package Manager | pnpm |

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- A PostgreSQL database (local or hosted — see [Vercel Postgres via Marketplace](https://vercel.com/marketplace) or use a local instance)

### 1. Clone and install

```bash
git clone https://github.com/your-username/cantura.git
cd cantura
pnpm install
```

### 2. Configure environment variables

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

You will need to provide:

- A PostgreSQL connection string (`DATABASE_URL`)
- Auth.js secrets (`AUTH_SECRET`, etc.)

### 3. Apply migrations and seed the database

```bash
pnpm db:migrate:deploy
pnpm db:seed
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Setting Up Your Own Instance

### Vercel (recommended)

1. [Create a Vercel account](https://vercel.com/signup) and install the CLI: `npm i -g vercel`
2. From the project root, run `vercel` and follow the prompts to link or create a project
3. Add your environment variables via `vercel env add` or through the Vercel dashboard
4. Add a PostgreSQL database through the [Vercel Marketplace](https://vercel.com/marketplace) and link it to your project — Vercel will inject the `DATABASE_URL` automatically
5. Deploy: `vercel --prod`

After each deploy, run migrations:

```bash
vercel env pull .env.local   # pull remote env vars locally
pnpm db:migrate:deploy
```

### Database (standalone PostgreSQL)

Any PostgreSQL 14+ instance works. Recommended hosted options:

- [Neon](https://neon.tech) — serverless Postgres, generous free tier
- [Supabase](https://supabase.com) — Postgres with extras
- Local Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`

Set `DATABASE_URL` to your connection string before running migrations.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Generate Prisma client + production build |
| `pnpm test` | Run Vitest tests |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm db:migrate:deploy` | Apply pending migrations |
| `pnpm db:seed` | Seed the database |
| `pnpm typecheck` | TypeScript type check (no emit) |
| `pnpm lint` | Run ESLint |
