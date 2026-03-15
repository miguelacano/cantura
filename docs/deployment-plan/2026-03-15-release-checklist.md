# Release Checklist and Smoke Validation

**Date:** 2026-03-15

## 1) Pre-release checklist

### App health
- [ ] `pnpm lint` passes
- [ ] `pnpm test:run` passes
- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes (or plan for this step)

### Data and auth
- [ ] Migration files reviewed and applied in staging
- [ ] `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` set correctly for environment
- [ ] Seed or fixture plan confirmed if needed

### Feature behavior
- [ ] Login screen loads and works with seeded credentials
- [ ] Redirect from `/` to `/login` is still active
- [ ] Role-based routes not broken by routing/security regression

## 2) Staging smoke checks

- Open staging URL.
- Verify:
  - `GET /` redirects to `/login`
  - `GET /login` returns HTTP 200 and render path is functional
  - login flow succeeds for known user
  - health endpoint returns HTTP 200 (add when implemented)
  - no critical client/server console/runtime errors in first use path

## 3) Production release criteria

- All staging checks pass.
- No unresolved schema or auth regressions.
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
