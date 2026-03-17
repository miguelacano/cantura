# CI/CD Pipeline Plan for Cantura

**Date:** 2026-03-15

## 1) Trunk-based workflow

- One main branch (`main`) drives production.
- **Preview = all non-production Vercel deployments** from branch/commit activity.
- Production deployment happens manually from `main` after checks pass.

## 2) Required GitHub/GitLab workflow stages (implemented for CI)

### Stage A: CI validation
1. Checkout + pnpm setup
2. Install dependencies
3. `pnpm lint`
4. `pnpm stylelint`
5. `pnpm commitlint` (PR commit messages only)
6. `pnpm test:run`
7. `pnpm typecheck`
8. `pnpm build`

### Stage B: DB + integration safety
1. Start PostgreSQL service in CI.
2. Run `pnpm db:migrate:deploy` against CI Postgres.
3. Keep migration lock and seed strategy explicit before merge.

### Stage C: Review and deployment gate
1. Confirm Graphite has no unresolved comments.
2. Confirm all requested blocker comments are addressed.
3. If a second reviewer exists, require that optional reviewer pass before merge.
4. If branch is not a production release action, ensure preview checks pass in Vercel.
5. If branch is `main`, publish production manually after checklist pass.

## 3) Script additions and usage

Add to `cantura/package.json` scripts:
- `typecheck`: `tsc --noEmit`
- `db:generate`: `prisma generate`
- `db:migrate:deploy`: `prisma migrate deploy`
- `db:seed`: `tsx prisma/seed.ts`
- `stylelint`: `stylelint "src/**/*.{css,scss}"`
- `commitlint`: `commitlint`
- `healthcheck`: optional, call deployed `/api/health`

## 4) Secrets to validate in CI and runtime

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- Optional observability keys (future): logging/monitoring service tokens

## 5) Branch and deployment contract

- Any commit can generate a preview build.
- Production deployment is explicit and intentional for one-person control.
- If a release has DB risk, promote only after migration validation and smoke checklist completion.

## 6) Quality gates before production promotion

- All CI jobs pass (`lint`, `stylelint`, `commitlint` on PRs, `test`, `typecheck`, `build`)
- Migration plan confirmed
- Runtime env secrets validated in preview
- Graphite review gate satisfied
- Smoke checklist completed (see release checklist doc)
