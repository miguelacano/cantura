# AGENTS.md — Cantura

Cantura is a production-oriented music studio management application built with:

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma
- Zod validation
- pnpm

This repository may be developed with coding agents. All generated code must follow the architectural, security, and product constraints defined below.

---

# Product Intent

Cantura is designed with emphasis on:

- Correct relational modeling
- Explicit access control via join tables
- Clean service-layer boundaries
- Server-first rendering
- Performance-conscious query design
- Security-first defaults
- Extensibility without premature complexity

The objective is a disciplined, production-shaped MVP with strong architectural foundations.

---

# Core Domain Model

Users may have one of the following roles:

- `TEACHER`
- `GUARDIAN`
- `STUDENT`

Students exist independently of login accounts.

Access to student records is controlled via a `StudentAccess` join model that defines:

- Which user has access
- What role they hold for that student

Guardians may:

- View student information
- Leave notes
- Reply to notes (single-level replies only)
- Participate in teacher/guardian message threads for students they can access

Teachers:

- Own and manage student records
- Assign pieces
- Manage guardian access
- Participate in teacher/guardian message threads

Students:

- May participate in student-scoped message threads only when `Student.canMessage = true`

---

# Architectural Guardrails

## 1. Authorization (Mandatory)

All student-scoped operations must:

1. Authenticate the user
2. Verify access through `StudentAccess`
3. Enforce role-based permissions server-side

No UI-only security assumptions.

Teachers may grant/revoke access.
Guardians may not escalate privileges.

Messaging authorization must also be enforced server-side:

- Teachers may only access threads where they are the thread teacher
- Guardians may only access threads where they are the thread guardian
- Students may only access student-scoped threads for their own student record when `Student.canMessage = true`

---

## 2. Notes and Replies

- Notes belong to a `Student`
- Notes may optionally belong to a `StudentAssignment`
- Notes support replies via `parentId`
- Reply depth must be limited to **one level** (enforced in service layer)

Nested multi-level threads are intentionally out of scope.

---

## 3. Messaging

- Messaging is in scope for the MVP
- Threads are private 1:1 conversations between a teacher and a guardian
- Threads may be general (`studentId = null`) or student-scoped (`studentId` set)
- Student participation is optional and controlled by `Student.canMessage`
- Thread deduplication must be enforced in the service layer, not via a DB unique constraint on nullable fields
- Message authorization and unread tracking belong in `src/server/**` services

---

## 4. Service-Layer Boundaries

Route handlers must remain thin.

Business logic belongs in `src/server/**` services.

Services are responsible for:

- Authorization checks
- Domain rule enforcement
- Reply depth enforcement
- Message thread deduplication
- Coordinating Prisma calls
- Preventing privilege escalation

Avoid placing domain logic inside route handlers or UI components.

---

## 5. Prisma & Database Discipline

- All models remain in a single `schema.prisma`
- Schema changes require migrations
- Add indexes for realistic query patterns
- Avoid unbounded list queries
- Paginate notes
- Paginate messages

No manual schema edits outside Prisma migrations.

---

# Frontend Architecture Boundaries

Cantura uses a server-first approach with Next.js App Router.

## 1. Server Components by Default

Default to Server Components.

Use Client Components only when:

- Handling interactivity
- Managing local UI state
- Using browser-only APIs

Do not mark entire route segments with `"use client"` unnecessarily.

---

## 2. Data Fetching Rules

- Server Components fetch data via services.
- Client Components must not directly access Prisma.
- Avoid duplicating server and client data fetching.
- Prefer predictable server-driven rendering.

---

## 3. Mutation Patterns

All mutations must:

- Validate input with Zod
- Pass through service-layer authorization
- Return minimal necessary data

After mutation:

- Use `router.refresh()` (MVP)
- Do not introduce React Query initially
- Avoid client-side state duplication of server truth

---

## 4. State Management

Local component state is allowed only for:

- Form inputs
- UI toggles
- Local interaction state

No global state libraries for MVP.

The database remains the source of truth.

---

## 5. Performance Principles (Frontend)

- Avoid unnecessary client hydration.
- Avoid rendering unpaginated lists.
- Avoid premature memoization.
- Measure before optimizing.

---

# Performance & Query Design

- Paginate notes (cursor-based or limit-based).
- Paginate messages.
- Avoid N+1 queries.
- Add indexes for:
  - student lookup by user
  - note retrieval by student + createdAt
  - access lookup by userId/studentId
  - message retrieval by thread + createdAt
- Do not introduce Redis or caching layers for MVP.
- Next.js caching/revalidation may be added deliberately later.

---

# Security Requirements

- Validate all inputs server-side.
- Do not expose sensitive data in logs.
- Follow OWASP principles:
  - least privilege
  - safe error handling
  - no credential leakage
- Never commit secrets.

---

# Non-Goals (MVP Constraints)

The following are intentionally excluded:

- Scheduling / calendar
- Payments
- Notifications
- Multi-level threaded discussions
- Audio uploads / AI analysis
- Multi-tenant studios

New features must be evaluated against MVP discipline.

---

# Agent Skill: Vercel React Best Practices (Optional)

When working on React/Next.js code, prefer applying Vercel’s React Best Practices Agent Skill for performance and rendering guidance.

This is agent tooling, not a runtime dependency.

If installed in the agent environment, it should guide:

- Server/client component boundaries
- Async data patterns
- Waterfall avoidance
- Bundle discipline

Cantura’s architectural constraints defined here take precedence if conflicts arise.

---

# Development Expectations for Agents

When implementing features:

1. Restate requirements briefly.
2. Propose the smallest viable solution.
3. Identify impacted layers (route -> service -> database).
4. Preserve clear boundaries.
5. Avoid speculative abstractions.
6. Maintain production-quality TypeScript.

All changes must align with the product intent and architectural constraints defined above.
