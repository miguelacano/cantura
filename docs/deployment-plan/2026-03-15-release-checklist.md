# Release Checklist and Smoke Validation

**Date:** 2026-03-15

## 1) Pre-release checklist

### Code review gate
- [ ] All Graphite comments are reviewed and resolved.
- [ ] Optional second reviewer pass complete (if enabled).

### App health
- [ ] `pnpm lint` passes
- [ ] `pnpm stylelint` passes
- [ ] `pnpm test:run` passes
- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes (or plan for this step)
- [ ] `pnpm commitlint` (for PR commit messages) has been honored

### Data and auth
- [ ] Migration files reviewed and applied in preview
- [ ] `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` set correctly for environment
- [ ] Seed or fixture plan confirmed if needed

### Feature behavior
- [ ] Login screen loads and works with seeded credentials
- [ ] Redirect from `/` to `/login` is still active
- [ ] Role-based routes not broken by routing/security regression

## 2) Staging smoke checks (run on latest preview URL)

- Open latest preview URL.
- Verify:
  - `GET /` redirects to `/login`
  - `GET /login` returns HTTP 200 and render path is functional
  - login flow succeeds for known user
  - `GET /api/health` returns HTTP 200
  - no critical client/server console/runtime errors in first use path

## 3) Production release criteria

- All preview checks pass.
- No unresolved schema or auth regressions.
- All Graphite comments are resolved.
- Security-sensitive actions (auth, message/note write paths) pass manual smoke pass.
- Commit is tagged or logged as release baseline.

## 4) Post-release checks (first 15 minutes)

- Confirm production URL routes are returning normally.
- Confirm auth session and redirects.
- Confirm no obvious DB errors in platform logs.
- Confirm message/note write and read paths are functioning.

## 5) If checks fail

- Stop any further user-facing work.
- Execute rollback plan in [2026-03-15-rollback-and-recovery.md](./2026-03-15-rollback-and-recovery.md).
