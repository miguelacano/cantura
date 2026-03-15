# CI/CD Pipeline Plan for Cantura

**Date:** 2026-03-15

## 1) Trunk-based workflow

- One main branch (`main`) drives production.
- Staging is represented by Vercel preview builds per commit.
- Promotion to production happens manually after checks pass.

## 2) Required GitHub/GitLab workflow stages (to implement later)

### Stage A: CI validation
1. Checkout + pnpm setup
2. Install dependencies
3. `pnpm lint`
4. `pnpm test:run`
5. `pnpm build`
6. Optional typecheck job (add `pnpm typecheck`)

### Stage B: DB + integration safety
1. Start PostgreSQL service in CI.
2. Run `pnpm db:migrate:deploy`.
3. Run DB-dependent tests.
4. Keep migration lock and seed strategy explicit before merge.

### Stage C: Deployment
1. If branch is not `main`, publish preview.
2. If branch is `main`, publish production after checklist pass (manual promotion).

## 3) Suggested script additions

Add to `cantura/package.json` scripts:
- `typecheck`: run TypeScript checks
- `db:generate`: `prisma generate`
- `db:migrate:deploy`: `prisma migrate deploy`
- `healthcheck` (optional): call deployed `/api/health`

## 4) Secrets to validate in CI and runtime

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- Optional observability keys (future): logging/monitoring service tokens

## 5) Branch and deployment contract

- Any commit to `main` is allowed to generate a preview.
- Production deployment is explicit and intentional for one-person control.
- If a release has DB risk, promote only after migration validation and smoke checklist completion.

## 6) Quality gates before production promotion

- All CI jobs pass
- Migration plan confirmed
- Runtime env secrets validated in staging
- Smoke checklist completed (see release checklist doc)
