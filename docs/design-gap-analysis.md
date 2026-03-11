# Design Gap Analysis

Cross-reference of design mockups (`docs/designs/`) against the current architecture and open PRs.

---

## PR Stack Summary

| PR | Branch | Contents |
|---|---|---|
| #2 | `feat/1-data-model` | Schema migration + updated architecture doc |
| #3 | `feat/2-project-setup` | Dependencies (next-auth, zod, vitest, prisma adapters) |
| #4 | `feat/3-data-layer` | `db.ts` singleton, auth type extensions, seed data |
| #5 | `feat/4-authentication` | Auth.js v5 split config, middleware, login page |
| #6 | `feat/5-service-layer` | `session.ts`, `studentService.ts`, tests |

---

## What the PRs Already Address

| Gap From Designs | PR | Status |
|---|---|---|
| `ADMIN` role missing from UserRole enum | #2 | ✅ Done |
| `Student.level` (proficiency) field | #2 | ✅ Done |
| `Instrument` model | #2 | ✅ Done |
| `StudentPiece` too thin — no composer, collection, etc. | #2 | ✅ Replaced by `RepertoireItem` + `TeacherLibraryItem` + `StudentAssignment` |
| `AssignmentStatus` was a freeform string | #2 | ✅ Now a proper enum: `ACTIVE / COMPLETED / DROPPED` |
| No teacher library concept | #2 | ✅ `TeacherLibraryItem` added |
| Activity "last seen" indicator | #2 | ✅ `UserStudentLastSeen` added |
| `STUDENT` role "reserved for future use" | #2 | ✅ Active in enum, StudentAccess, and routing |
| All UI routes enumerated | #2 | ✅ Full route tree added to architecture doc |
| Auth.js v5 split config | #5 | ✅ Done |
| Role-based redirects | #5 | ✅ ADMIN→`/admin`, TEACHER→`/teacher/students`, GUARDIAN→`/guardian`, STUDENT→`/student/me` |
| `Student.firstName` / `lastName` split | #2 | ✅ Done via two-migration approach |

---

## Issues in PR #6 to Fix Before Merging

### Bug 1: `createStudent` does not create teacher access

The architecture doc specifies that the creation transaction must atomically create both `StudentAccess(GUARDIAN)` **and** `StudentAccess(TEACHER, instrumentId)`. The current implementation only creates guardian access and does not accept an `instrumentId` parameter.

**Current behavior (`src/server/studentService.ts`):**
```ts
return db.$transaction(async (tx) => {
  const student = await tx.student.create({ ... })
  await tx.studentAccess.create({ role: "GUARDIAN", instrumentId: null, ... })
  // ← TEACHER access is never created
  return student
})
```

**Required fix:**
- Add `instrumentId: string` to `CreateStudentSchema` and `createStudent` params
- Create `StudentAccess(role=TEACHER, instrumentId)` for the calling teacher inside the same transaction

### Bug 2: Guardian findOrCreate is outside the transaction

The guardian lookup/create runs before `db.$transaction()`, introducing a race condition if two teachers create students for the same guardian email simultaneously.

**Required fix:** Move the guardian `findUnique` + `user.create` inside the transaction body.

### Issue 3: `listRecentNotesAcrossStudents` N+1 pattern

The function first fetches all teacher access rows to collect `studentIds`, then runs a second `note.findMany` with `IN (...)`. This works but becomes fragile at scale.

**Suggested fix:** Replace the two-query approach with a single query using a nested `where`:
```ts
db.note.findMany({
  where: {
    parentId: null,
    student: {
      access: { some: { userId: teacherId, role: "TEACHER" } },
    },
  },
  ...
})
```

---

## Remaining Gaps — Not Addressed by Any PR

These are fully open. None are covered by the current PR stack, and several are not yet mentioned in the architecture doc.

### Schema / Data Model

| Missing | Priority | Design Evidence |
|---|---|---|
| `Student.canMessage` field | P0 | New Student form has explicit "Messaging Participation" toggle |
| `MessageThread`, `Message`, `MessageThreadReadStatus` tables | P0 | Full messaging inbox design with threads, participants, read receipts |
| `StudentAssignment.dueDate` | P1 | Assignment cards show "Due: May 12" |
| `StudentAssignment.practiceGoalMinutes` | P1 | Assignment cards show "45m Practice Goal" / "15m Daily Warmup" |
| `StudentAssignment.focusArea` | P1 | Assignment cards show "Focus: Intonation and fluid shifting" |
| `PracticeLog` model | P1 | Student dashboard shows practice streak, total hours (42h 15m), "Log Today's Practice" CTA |
| `Milestone` / `StudentGoal` model | P2 | Student hub shows "Upcoming Milestone" with title, progress %, target date, venue, key focus checklist |
| Assessment model | P3 | Teacher activity feed references "Assessment Completed — Theory Module 2 Quiz, 94%" |

### Services

All services below are listed as pending in the architecture tracker. No implementation exists yet.

| Service | File | Blocked By |
|---|---|---|
| AccessService | `src/server/accessService.ts` | — |
| RepertoireService | `src/server/repertoireService.ts` | — |
| AssignmentService | `src/server/assignmentService.ts` | Missing `dueDate`/`practiceGoalMinutes`/`focusArea` fields |
| NoteService | `src/server/noteService.ts` | — |
| MessageService | `src/server/messageService.ts` | Missing messaging table migrations |
| PracticeLogService | `src/server/practiceLogService.ts` | Missing `PracticeLog` model |
| MilestoneService | `src/server/milestoneService.ts` | Missing `Milestone` model |

### UI Pages

Zero pages implemented. Full surface area needed per the architecture route tree:

**Teacher**
- `/teacher/setup` — onboarding wizard (name, studioName, bio)
- `/teacher/students` — roster + recent notes dashboard
- `/teacher/students/new` — new student creation form
- `/teacher/students/[studentId]` — student hub (assignments, notes, milestones, stats)
- `/teacher/students/[studentId]/assign` — assign repertoire
- `/teacher/repertoire` — search canonical catalog
- `/teacher/library` — teacher's saved pieces
- `/teacher/library/new`
- `/teacher/messages` — inbox
- `/teacher/messages/[threadId]`

**Guardian**
- `/guardian` — student cards with "Add practice note" CTA
- `/guardian/students/[studentId]`
- `/guardian/messages`
- `/guardian/messages/[threadId]`

**Student**
- `/student/me` — assignments + notes
- `/student/messages` — only if `student.canMessage = true`
- `/student/messages/[threadId]`

**Admin**
- `/admin/instruments`
- `/admin/users`

**Shared**
- `/403`
- `/not-found`
- `/error`

### Other

| Issue | Notes |
|---|---|
| `proxy.ts` naming | Auth middleware was renamed from `middleware.ts` to `proxy.ts` to work around a TypeScript conflict. Standard Next.js expects `middleware.ts` — worth investigating the root cause rather than keeping the workaround permanently. |
| Practice streak calculation | Student dashboard shows "12 Day Streak" — needs either a `PracticeLog` date query or a denormalized counter on `Student`. No strategy defined yet. |

---

## Suggested Sequencing (Post-Merge)

1. **Fix PR #6** — patch `createStudent` bugs (teacher access + transaction scope) before merging
2. **Schema additions** — `Student.canMessage`, messaging tables, `StudentAssignment` enrichment fields, `PracticeLog`, `Milestone` — all as migrations
3. **Service layer** — AccessService → AssignmentService → NoteService → MessageService → PracticeLogService
4. **UI** — Teacher pages first (most complex, gatekeeps guardian/student flows), then Guardian, then Student
