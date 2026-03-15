# CLAUDE.md — Cantura

Cantura is a music studio management app for private teachers. This file defines working conventions for Claude Code. The authoritative architectural spec is `docs/architecture.md`. Product and agent constraints are in `AGENTS.md`.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack in dev) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 7 (driver adapters) |
| Auth | Auth.js v5 (`next-auth@beta`) — JWT sessions, Credentials provider |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Testing | Vitest |
| Package Manager | pnpm |

---

## Critical: Prisma 7

- Generator: `provider = "prisma-client"` (NOT `prisma-client-js`) — uses driver adapters, no embedded Rust engine
- Client import path: `@/generated/prisma/client` — the generated dir has no `index.ts`
- Every `PrismaClient` instance **must** use the adapter:
  ```ts
  new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })
  ```
- Seed uses `findFirst + create` (not `upsert`) for nullable composite unique keys
- `StudentAccess` with `instrumentId: null` — NULL semantics prevent upsert; use `findFirst + create`

---

## Critical: Auth.js v5 Split Config

Middleware runs on Edge Runtime — cannot import Prisma or Node.js built-ins. Two files **must** stay separate:

- `src/lib/auth.config.ts` — Edge-safe. No db import. Used in middleware.
- `src/lib/auth.ts` — Node.js only. Adds Credentials provider + bcrypt + db lookup.
- `src/proxy.ts` — middleware file (renamed from `middleware.ts` to avoid a TypeScript conflict; investigate and resolve to standard name post-MVP)

Never import db or bcrypt into `auth.config.ts`.

---

## Service Layer Rules

All business logic lives in `src/server/`. Route handlers must stay thin.

Services are responsible for:
- Authorization checks (StudentAccess verification)
- Domain rule enforcement (note reply depth = 1)
- Prisma calls

Do not put domain logic in route handlers or UI components.

### Existing Services
| Service | File |
|---------|------|
| Session helpers | `src/server/session.ts` |
| StudentService | `src/server/studentService.ts` |

### Pending Services
AccessService, RepertoireService, AssignmentService, NoteService, MessageService

---

## Data Model Conventions

- `Student.firstName` + `Student.lastName` — NOT a single `name` field
- Use `fullName(student)` helper from `studentService.ts` for display
- `StudentAccess(role=TEACHER)` requires `instrumentId` (non-null)
- `StudentAccess(role=GUARDIAN | STUDENT)` requires `instrumentId = null`
- `createStudent` must atomically create both GUARDIAN and TEACHER access inside `db.$transaction()`
- Message thread deduplication enforced in service layer (not DB — nullable unique constraint issue)

---

## Frontend Rules

- Server Components by default
- Client Components only for interactivity, local UI state, browser APIs
- Do not mark entire route segments `"use client"` unnecessarily
- Mutations: validate with Zod → service layer → `router.refresh()` (no React Query for MVP)
- No global state libraries for MVP; database is the source of truth

---

## Design System Workflow

For any UI work, the canonical design system is `src/design-system/` with this hierarchy:

```
tokens/     → Tailwind v4 @theme tokens (colors, spacing, typography, radius)
atoms/      → Icon, Button, Input, Textarea, Badge, Avatar, ProgressBar, etc.
molecules/  → FormField, SearchBar, NavItem, LessonCard, ThreadPreview, etc.
organisms/  → AppHeader, AppSidebar, ActivityFeed, MessagingThread, etc.
```

**Before writing any UI code:**
1. Check `docs/plans/atomic-implementation/2026-03-15-atomic-page-to-atomic-mapping.md` for the canonical component registry
2. Prefer extending props/variants over creating new components
3. All new atoms go only in `src/design-system/` — no page-level one-offs

Reference mockups are in `docs/designs/`.

---

## Authorization — Non-Negotiable

Every student-scoped operation must:
1. Authenticate the session (`requireSession` / `requireRole` from `session.ts`)
2. Verify `StudentAccess` in the service
3. Enforce role permissions server-side

No UI-only security checks. No skipping service layer authorization.

---

## Query Discipline

- Paginate notes (cursor-based, top-level only; bundle replies with parent)
- Paginate messages (by `createdAt` within thread)
- Avoid N+1 — use nested `where` over two-query patterns
- Add indexes for: student lookup, note retrieval, access lookup, message retrieval

---

## Known Open Issues

1. **`createStudent` missing teacher access** — must create `StudentAccess(TEACHER, instrumentId)` in the same transaction as guardian access
2. **Guardian findOrCreate outside transaction** — race condition; move inside `db.$transaction()`
3. `proxy.ts` naming — non-standard; investigate root cause
4. Messaging tables (`MessageThread`, `Message`, `MessageThreadReadStatus`) not yet migrated
5. `Student.canMessage` field pending migration

---

## Current Branch State

- Main branch: `main`
- Recent merged PR: #6 (service layer — studentService, session)
- PR stack order: #2 → #3 → #4 → #5 → #6 (all merged)

## Test Credentials (local dev only)

```
admin@cantura.dev / password
teacher@cantura.dev / password
guardian@cantura.dev / password
student@cantura.dev / password
```

---

## Non-Goals (MVP)

Scheduling, payments, notifications, multi-level threading, audio/video uploads, multi-tenant studios. Evaluate any new feature against MVP discipline before adding.
