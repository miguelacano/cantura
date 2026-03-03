# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint

# Prisma
pnpm prisma migrate dev --name <name>   # Create and apply a new migration
pnpm prisma migrate deploy              # Apply pending migrations (prod)
pnpm prisma studio                      # Open Prisma Studio (DB browser)
pnpm prisma generate                    # Regenerate client after schema changes
```

Database URL is read from `DATABASE_URL` in `.env`. The Prisma client is generated to `src/generated/prisma`.

## Architecture

**Cantura** is a music studio management app for private music teachers. Stack: Next.js 16 (App Router) + TypeScript, PostgreSQL + Prisma 7, Tailwind CSS 4, Zod, pnpm.

### Domain Model

The core access model is `StudentAccess` — a join table that controls who can see which students and in what capacity:

- **TEACHER** access is **instrument-scoped** (`instrumentId` required)
- **GUARDIAN / STUDENT** access is student-wide (`instrumentId` must be null)

Other key models: `User` (roles: TEACHER, GUARDIAN, STUDENT), `Student`, `Piece` (teacher-owned repertoire), `StudentPiece` (assignment of a piece to a student), `Note` (with single-level reply support via `parentId`).

Planned (not yet implemented): `Instrument` catalog, `RepertoireItem` canonical catalog, `TeacherLibraryItem`, `StudentAssignment` (replaces current `StudentPiece`), `UserStudentLastSeen`.

### Service Layer (src/server/**)

Route handlers must stay thin. All business logic goes in services under `src/server/`. Services own:

- Authorization checks via `StudentAccess`
- Domain invariant enforcement (e.g., reply depth ≤ 1, teacher access requires instrumentId)
- Prisma calls
- Zod input validation

Client Components must never import Prisma directly.

### Frontend Conventions

- Default to **Server Components**; use `"use client"` only for interactivity, local state, or browser APIs
- Server Components fetch via services; no direct Prisma in UI
- After mutations, use `router.refresh()` (no React Query for MVP)
- No global state libraries — DB is the source of truth
- Paginate notes (cursor-based, top-level only; replies bundled with parent)

### Planned Route Structure

```
/login  /logout
/admin/**           (user + instrument management)
/teacher/**         (students, repertoire, library)
/guardian/**
/student/**
```

### Critical Invariants (enforced in service layer)

1. `StudentAccess`: if role=TEACHER → `instrumentId` required; if role=GUARDIAN/STUDENT → `instrumentId` must be null
2. Note replies: `parentId` target must exist and must itself have `parentId = null` (one level only)
3. Assignment authorization: assigning teacher must have matching `StudentAccess(role=TEACHER, instrumentId)`

### Error Handling Pattern

- 401 → redirect `/login`
- 403 → "No access" page
- 404 → `app/not-found.tsx`
- 422 → inline form errors
- 500 → `app/error.tsx`

## Schema Notes

The current `schema.prisma` is an early scaffold. The architecture doc (`docs/architecture.md`) defines the target model with `Instrument`, `RepertoireItem`, `TeacherLibraryItem`, `StudentAssignment`, and `UserStudentLastSeen`. Migrations are required for all schema changes — no manual edits outside Prisma.
