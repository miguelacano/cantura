# PR #2 Readiness Checklist

This checklist captures the minimum changes required before more work proceeds on top of PR #2.

It is derived from:

- [docs/architecture.md](C:/Users/contr/Code/cantura/docs/architecture.md)
- [docs/design-gap-analysis.md](C:/Users/contr/Code/cantura/docs/design-gap-analysis.md)
- [docs/plans/2026-03-10-pr2-amendments-plan.md](C:/Users/contr/Code/cantura/docs/plans/2026-03-10-pr2-amendments-plan.md)

## Schema Alignment

- [x] Add `Student.canMessage Boolean @default(false)` to `Student` in `prisma/schema.prisma`
Why: student messaging participation is part of the current architecture and is referenced by the student workflow and new student form design.

- [x] Add `MessageThread`, `Message`, and `MessageThreadReadStatus` models to `prisma/schema.prisma`
Why: messaging is in MVP scope in the architecture doc, and these are currently the main missing P0 schema items.

- [x] Add the required `User` back-relations for teacher threads, guardian threads, authored messages, and thread read status
Why: the schema needs complete Prisma relations before message services and route work can proceed.

- [x] Keep thread deduplication in the service layer instead of adding a DB unique constraint on `(teacherId, guardianId, studentId)`
Why: the architecture and amendments plan both rely on PostgreSQL `NULL` semantics and explicitly treat this as a service-layer invariant.

## Migration Reset

- [x] Delete the two existing PR #2 migration folders and replace them with a single regenerated `initial_schema` migration
Why: the updated plan explicitly changes strategy from additive migrations to one clean initial migration because the project is still seed-driven and has no meaningful data to preserve.

- [x] Run `pnpm prisma migrate reset --force`
Why: clear the current database and migration history before regenerating the canonical schema state.

- [x] Run `pnpm prisma migrate dev --name initial_schema`
Why: create the single clean migration that matches the final intended PR #2 schema.

## Verification

- [x] Run `pnpm prisma db seed`
Why: verify that the new schema still supports current seed assumptions and does not break downstream PRs.

- [x] Run `pnpm prisma generate`
Why: regenerate the Prisma client so new relations and models are reflected immediately.

- [ ] Run `pnpm build`
Why: catch schema-driven type or build regressions before more PRs stack on top.
Note: attempted and currently blocked by missing later-stack app files on the active `feat/2-project-setup` branch. The immediate missing file is `src/app/login/page.js`, which exists on `feat/4-authentication` (PR #5 in the stack) and is expected during Next type validation.

- [x] Verify in Prisma Studio that `Student.canMessage` exists and that `MessageThread`, `Message`, and `MessageThreadReadStatus` are present
Why: this is the simplest direct sanity check that the schema and migration output match the architecture docs.
Note: verified via local database inspection. Messaging tables are present and currently contain no seeded data, which matches expectations.

## Documentation Alignment

- [ ] Update `AGENTS.md` to remove the stale claim that messaging systems are an MVP non-goal
Why: `AGENTS.md` currently conflicts with `docs/architecture.md`, which already includes messaging in MVP scope.

- [ ] Update `AGENTS.md` to reflect that student participation in messaging is controlled by `Student.canMessage`
Why: that flag is part of the current domain model and should be visible in repo-level guidance.

- [ ] Update `AGENTS.md` to describe messaging as teacher/guardian 1:1 threads, with optional student participation on student-scoped threads
Why: this is the current architecture contract and affects future service, route, and UI work.

- [ ] Update `AGENTS.md` terminology where needed so it matches the current data model, especially `StudentAssignment` vs. older `StudentPiece` language
Why: stale naming increases the risk of future implementation drift.

- [ ] Extend `AGENTS.md` authorization guidance to cover message authorization and service-layer enforcement
Why: messaging now follows the same server-side authorization model as the rest of the app.

## PR Hygiene

- [ ] Update the PR #2 description to mention the schema reset and the added messaging support
Why: reviewers need an accurate summary of why the migration history changed and what was added.

- [ ] Confirm downstream assumptions remain valid for PRs #3 through #6 after the schema reset
Why: the amendment plan says the reset is safe, but the final PR update should make that explicit.
