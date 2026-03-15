# Cantura Deployment Plan (MVP, One-Person Workflow)

**Date:** 2026-03-15

## 1) Deployment model

- **Platform:** Vercel (Next.js App Router)
- **Database:** Managed PostgreSQL (Neon/Supabase/RDS-compatible)
- **State model:** Prisma 7 + PostgreSQL via `@prisma/adapter-pg`
- **Auth model:** NextAuth/Auth.js credentials flow

## 2) Branch and environment strategy

### Branch model (recommended)
- **trunk-based development on `main` only**
- No long-lived feature branches by default for this phase.
- Use short-lived local/topic work in working tree and PR notes if needed.

### Environments
- **Dev:** local `pnpm dev` + local DB from `.env`
- **Staging:** Vercel preview deployments from commits/branches
- **Prod:** Vercel production deployment from `main`

### Promotion rule (one-person)
- Deploy to staging preview on each commit.
- Promote to production only when release checklist passes.
- Do not merge while there are unresolved Graphite comments.

## 3) Why not containers yet

Container deployment is deferred for MVP to reduce operational complexity.
Decision details are kept in: [2026-03-15-container-vs-no-container.md](./2026-03-15-container-vs-no-container.md)

## 4) Required deployment docs

- Build and deploy strategy: this document
- Pipeline details: [2026-03-15-cicd-pipeline.md](./2026-03-15-cicd-pipeline.md)
- Release and smoke checks: [2026-03-15-release-checklist.md](./2026-03-15-release-checklist.md)
- Rollback and recovery: [2026-03-15-rollback-and-recovery.md](./2026-03-15-rollback-and-recovery.md)

## 5) Pipeline requirements (authoritative)

- Lint, type check, tests, and build must pass before prod promotion.
- Graphite review must be clean (all comments addressed or intentionally closed).
- Prisma migration files must exist for all schema changes.
- All environment variables and secret changes must be documented in this deployment plan before production rollout.

## 6) Baseline runtime constraints

- Keep login availability as a minimum launch gate:
  - `GET /` should redirect to `/login`
  - `GET /login` should render successfully
- Enforce service-layer authorization and schema-safe flows before release (already in architecture).
- Keep feature scope to MVP workflows unless intentionally expanding this release.

## 7) Planned implementation order

1. Finalize CI workflow definition and environment secrets.
2. Add health check endpoint and observability baseline.
3. Add Vercel deployment mapping for Preview + Production.
4. Add release checklist gates and rollback process.
5. Run first staging deployment and cut first production release.
