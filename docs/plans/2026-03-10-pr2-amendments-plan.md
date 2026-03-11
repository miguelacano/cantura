# PR #2 Schema Amendments Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add missing schema items to `feat/1-data-model` (PR #2): `Student.canMessage` and the full messaging table set (`MessageThread`, `Message`, `MessageThreadReadStatus`).

**Architecture:** Early development — no meaningful data exists and everything is seed-driven. Rather than stacking new migrations on top of the existing ones, reset migration history and regenerate a single clean `initial_schema` migration from the final schema state. This avoids migration debt and keeps history clean for a portfolio project.

**Tech Stack:** Prisma 7, PostgreSQL, `@prisma/adapter-pg`

**Branch:** `feat/1-data-model` (PR #2)

---

## Context: What PR #2 Already Has

Two migrations in `prisma/migrations/`:
1. `20260303002413_target_model`
2. `20260303012908_student_name_split`

The architecture doc already describes `Student.canMessage` and the messaging models correctly. Only the schema fields and migration SQL are missing.

## Safety Check: Downstream PRs

The reset is safe across the full PR stack:
- **PR #3** — package installs only, unaffected
- **PR #4** — seed creates `Student` without `canMessage` (fine, `@default(false)`); seed doesn't touch messaging tables (purely additive); all upsert keys remain valid
- **PR #5** — auth only references `UserRole` enum (unchanged) and `User` fields `id`, `email`, `name`, `role` (unchanged)
- **PR #6** — `createStudent` doesn't set `canMessage` (fine, defaults to `false`); no messaging table references

---

## Task 1: Update `prisma/schema.prisma`

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Add `canMessage` to the `Student` model**

Add after `level`:

```prisma
model Student {
  id         String   @id @default(cuid())
  firstName  String
  lastName   String
  level      String?
  canMessage Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  access         StudentAccess[]
  assignments    StudentAssignment[]
  notes          Note[]
  lastSeen       UserStudentLastSeen[]
  messageThreads MessageThread[]
}
```

**Step 2: Add messaging models after `UserStudentLastSeen`**

```prisma
model MessageThread {
  id         String   @id @default(cuid())
  teacherId  String
  teacher    User     @relation("TeacherThreads",  fields: [teacherId],  references: [id])
  guardianId String
  guardian   User     @relation("GuardianThreads", fields: [guardianId], references: [id])
  studentId  String?
  student    Student? @relation(fields: [studentId], references: [id])
  subject    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  messages   Message[]
  readStatus MessageThreadReadStatus[]

  // No DB unique constraint — NULL != NULL in PostgreSQL unique indexes.
  // Thread deduplication enforced in messageService.findOrCreateThread().
  @@index([teacherId])
  @@index([guardianId])
  @@index([studentId])
}

model Message {
  id        String        @id @default(cuid())
  threadId  String
  thread    MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  authorId  String
  author    User          @relation("MessageAuthor", fields: [authorId], references: [id])
  body      String
  createdAt DateTime      @default(now())

  @@index([threadId, createdAt])
  @@index([authorId])
}

model MessageThreadReadStatus {
  id         String        @id @default(cuid())
  userId     String
  user       User          @relation(fields: [userId], references: [id])
  threadId   String
  thread     MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  lastReadAt DateTime      @default(now()) @updatedAt

  @@unique([userId, threadId])
}
```

**Step 3: Add back-relations to `User` model**

Add to the `User` model:

```prisma
teacherThreads   MessageThread[]            @relation("TeacherThreads")
guardianThreads  MessageThread[]            @relation("GuardianThreads")
authoredMessages Message[]                  @relation("MessageAuthor")
threadReadStatus MessageThreadReadStatus[]
```

---

## Task 2: Reset migration history and regenerate

**Step 1: Delete existing migration folders**

```bash
rm -rf prisma/migrations/20260303002413_target_model
rm -rf prisma/migrations/20260303012908_student_name_split
```

`migration_lock.toml` stays — it just records the provider.

**Step 2: Reset the database and regenerate a single clean migration**

```bash
pnpm prisma migrate reset --force
pnpm prisma migrate dev --name initial_schema
```

`migrate reset` drops all tables and clears migration history. `migrate dev` creates a single `initial_schema` migration from the current schema state and applies it.

**Step 3: Re-run seed**

```bash
pnpm prisma db seed
```

Expected: All 4 users, 3 instruments, 1 student, access grants, and 1 repertoire item created without errors.

**Step 4: Verify in Prisma Studio**

```bash
pnpm prisma studio
```

Expected: All tables present including `MessageThread`, `Message`, `MessageThreadReadStatus`. `Student` table has `canMessage` column defaulting to `false`.

**Step 5: Regenerate Prisma client**

```bash
pnpm prisma generate
```

Expected: Client regenerates without errors.

**Step 6: Verify build**

```bash
pnpm build
```

Expected: Next.js build passes with no TypeScript errors from the new relations.

**Step 7: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add canMessage, messaging tables — reset to single clean migration"
```

---

## Checklist Before Pushing PR #2 Updates

- [ ] Single migration folder exists: `prisma/migrations/XXXXXX_initial_schema/`
- [ ] `pnpm prisma migrate reset --force` applies cleanly on a fresh DB
- [ ] `pnpm prisma db seed` completes without errors
- [ ] `pnpm prisma studio` shows all tables including the 3 new messaging tables and `Student.canMessage`
- [ ] `pnpm build` passes
- [ ] PR #2 description updated to note the schema reset and new additions
