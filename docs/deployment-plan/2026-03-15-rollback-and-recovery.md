# Rollback and Recovery Plan

**Date:** 2026-03-15

## 1) Rollback priority (one-person playbook)

1. **First action:** rollback app deployment to previous stable version.
2. **Then:** verify runtime and auth/login paths.
3. **Then:** verify migration state for the rollback window.

## 2) Failure categories and expected actions

### App-level regressions (no schema dependency)
- Immediate rollback to prior deployment.
- Re-run smoke checks and release notes.

### Migration or data inconsistencies
- Pause further releases.
- Keep app rollback if possible.
- Review migration history and migration diff before re-attempt.
- Do not run destructive DB operations without explicit verification.

### Auth/session failures
- Validate `AUTH_SECRET` and `AUTH_URL` for environment.
- Check `nextauth` session and middleware behavior.
- If immediate fix unavailable, rollback and investigate in non-production.

## 3) Environment recovery flow

1. Capture error state and failing route.
2. Rollback deployment.
3. Validate smoke checks for:
   - `/`
   - `/login`
   - auth/session path
4. Decide one of:
   - re-run with corrected env/config
   - create a targeted hotfix commit and promote
   - defer until next planned release after fix

## 4) DB recovery guidance

- Migration files are immutable for already released versions.
- Never alter committed migration files for a released version.
- If schema issue is urgent, create a new migration that repairs state.
- Maintain a local migration audit (`migrations` directory in Prisma and migration logs).

## 5) Runbook output required

Every rollback event should record:
- cause
- affected route/release
- corrective action taken
- validation results
- time-to-restore and lessons learned
