# Cantura Architecture (MVP)

Cantura is a studio management web app for private music teachers. It manages relationships between Teachers, Students, and Guardians with strict server-side authorization.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack in dev) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 7 (driver adapters) |
| ORM | Prisma 7 — `provider = "prisma-client"`, output `src/generated/prisma` |
| DB Adapter | `@prisma/adapter-pg` + `pg` — required by Prisma 7's new client generator |
| Auth | Auth.js v5 (`next-auth@beta`) — JWT sessions, Credentials provider |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Testing | Vitest |
| Package Manager | pnpm |

### Critical Prisma 7 Notes

- Generator is `prisma-client` (not `prisma-client-js`) — uses driver adapters, no embedded Rust engine
- Import path is `@/generated/prisma/client` — the generated dir has no `index.ts`
- All `PrismaClient` instances must be constructed with `{ adapter: new PrismaPg({ connectionString: ... }) }`
- Seed uses `findFirst + create` (not `upsert`) for rows with nullable fields in composite unique keys

### Auth.js v5 Split Config (Required)

Middleware runs on the Edge Runtime — it cannot import Prisma or Node.js built-ins. Auth config is split:

- `src/lib/auth.config.ts` — Edge-safe. No db import. Used in middleware for JWT validation.
- `src/lib/auth.ts` — Node.js only. Adds Credentials provider with bcrypt + db lookup.
- `src/middleware.ts` — creates its own `NextAuth(authConfig)` instance from the Edge-safe config.

---

## Goals (MVP)

**Teacher workflows:**
- Create students (with required guardian association at creation time)
- Instrument-scoped teacher↔student access via StudentAccess
- Manage a personal repertoire library (TeacherLibraryItem → RepertoireItem)
- Assign repertoire to students by instrument
- Write notes and replies (single-level depth) on students/assignments
- 1:1 messaging with guardians (student-scoped and general threads)

**Guardian workflows:**
- View their student(s) and current assignments
- Participate in notes and replies
- Message teachers (1:1 per thread)

**Student workflows:**
- View own assignments and notes
- Optionally message teachers (controlled per-student by `Student.canMessage`)

**Admin workflows:**
- Create and manage user accounts
- Manage instrument catalog
- View student access graph (optional support view)

---

## Non-Goals (MVP)

- Calendar/scheduling, payments, push notifications
- Multi-tenant studio organizations
- Audio/video uploads, AI analysis
- Deep threaded discussions (one reply level only)
- Real-time messaging (async polling is sufficient for MVP; see Future Extensions)
- Guardian search/autocomplete on student creation (use findOrCreate by email for now)

---

## Data Model

### User

Fields: `id`, `email` (unique), `name?`, `role` (UserRole), `passwordHash?`, `bio?`, `studioName?`, `createdAt`, `updatedAt`

Roles: `ADMIN`, `TEACHER`, `GUARDIAN`, `STUDENT`

### Student

Fields: `id`, `firstName`, `lastName`, `level?`, `canMessage` (Boolean, default false), `createdAt`, `updatedAt`

- `firstName` + `lastName` are separate fields (not a single `name`)
- `canMessage` controls whether this student can participate in teacher↔guardian message threads
- Display name: use the `fullName(student)` helper from `studentService.ts`

### Instrument

Admin-managed catalog. Used to scope teacher↔student relationships and assignments.

### StudentAccess (join model)

Controls who can access which student and in what role:

- `role = TEACHER` → `instrumentId` **required** (teacher access is instrument-scoped)
- `role = GUARDIAN` or `STUDENT` → `instrumentId` **must be null**
- Unique constraint: `(studentId, userId, role, instrumentId)`
- **Note:** upsert with `null` instrumentId fails in Prisma due to PostgreSQL NULL semantics — use `findFirst + create` instead

### RepertoireItem

Canonical catalog of pieces. Fields: `title`, `composer?`, `collection?`, `category?`, `source` (default "MANUAL"), `externalId?`. The `source` and `externalId` fields are stubs for future OpenOpus/MusicBrainz integration.

### TeacherLibraryItem

A teacher's personal library entry referencing a RepertoireItem. Allows teacher-specific notes without duplicating catalog data.

### StudentAssignment

Assignment of a TeacherLibraryItem to a Student within an Instrument context. Status: `ACTIVE | COMPLETED | DROPPED`. Unique on `(studentId, teacherLibraryItemId, instrumentId)`.

### Note

Student-scoped communication visible to all parties with StudentAccess. Fields: `authorId`, `studentId`, `assignmentId?`, `parentId?`, `body`.

- Reply depth is **one level only** (enforced in service layer)
- Top-level notes: `parentId = null`; replies: `parentId` points to a top-level note

### MessageThread

Private 1:1 conversation between a teacher and a guardian. Fields: `teacherId`, `guardianId`, `studentId?` (null = general thread), `subject?`, `createdAt`, `updatedAt`.

- Thread uniqueness enforced in **service layer** (not DB) — PostgreSQL does not treat two `NULL` values as equal in unique constraints
- Student-scoped threads: `studentId` set; student can read/participate if `student.canMessage = true`
- General threads: `studentId = null`; students never see these

### Message

Individual message within a `MessageThread`. Fields: `threadId`, `authorId`, `body`, `createdAt`. Cascade-deletes when thread is deleted.

### MessageThreadReadStatus

Tracks last-read cursor per user per thread for unread indicators. Fields: `userId`, `threadId`, `lastReadAt` (auto-updated). Unique on `(userId, threadId)`.

Unread detection: `thread.updatedAt > readStatus.lastReadAt`

### UserStudentLastSeen

Tracks when a user last viewed a student's profile. Used for "new activity since last visit" indicators on dashboards. Unique on `(userId, studentId)`.

---

## Authorization Rules

All authorization is enforced in services, not only in the UI.

### TEACHER
- View/edit students where they have `StudentAccess(role=TEACHER, instrumentId=…)`
- Own `TeacherLibraryItem` records
- Assign repertoire to students they teach (instrument must match their access)
- Create/reply/delete notes for students they teach
- Send and receive messages in threads where `teacherId = self`

### GUARDIAN
- View students where they have `StudentAccess(role=GUARDIAN)`
- Create notes and replies (own notes only for edit/delete)
- Send and receive messages in threads where `guardianId = self`
- Toggle `student.canMessage` for their student(s)

### STUDENT
- View student record linked to them + their assignments and notes
- Create notes and replies (if access exists)
- Participate in message threads where `thread.studentId = their studentId` AND `student.canMessage = true`

### ADMIN
- Manage users and instrument catalog
- Optional: view student + access graph for support
- Does not participate in notes or messaging

---

## Critical Invariants (Enforced in Service Layer)

1. **StudentAccess:** if `role=TEACHER` → `instrumentId` required; if `role=GUARDIAN/STUDENT` → `instrumentId` must be null
2. **Note reply depth:** parent note must exist and must have `parentId = null` (no nested replies)
3. **Assignment authorization:** assigning teacher must have `StudentAccess(role=TEACHER, instrumentId)` matching the assignment's instrument
4. **Message authorization:** sender must be a participant in the thread (`teacherId` or `guardianId` or student with `canMessage=true`)
5. **Thread deduplication:** before creating a thread, check for existing `(teacherId, guardianId, studentId)` in service layer

---

## Student Creation Flow

When a teacher creates a student, a guardian is required at creation time:

1. Teacher submits: student `firstName`, `lastName`, `level?`, guardian `firstName`, `lastName`, `email`
2. `createStudent` in `studentService.ts`:
   - `findOrCreate` guardian `User` by email (deduplicates — email is unique on User)
   - If new guardian: create `User(role=GUARDIAN, name="firstName lastName")` with no password (they log in later via admin-set credentials)
   - Create `Student` record
   - Create `StudentAccess(role=GUARDIAN, instrumentId=null)` for the guardian
   - Create `StudentAccess(role=TEACHER, instrumentId)` for the creating teacher
   - All in a single `db.$transaction()`

**Post-MVP:** Replace inline guardian name/email form with a search-first autocomplete (see Task #26).

---

## UI Routes

### Shared
- `/login`, `/logout`
- `/403` — forbidden
- `/not-found` — 404
- `/error` — 500

### Admin (`requireRole("ADMIN")`)
- `/admin` → redirect to `/admin/instruments`
- `/admin/instruments`
- `/admin/users`

### Teacher (`requireRole("TEACHER")`)
- `/teacher/setup` — onboarding wizard (name + studioName + bio); shown on first login when profile incomplete
- `/teacher/students` — roster + recent notes dashboard
- `/teacher/students/new`
- `/teacher/students/[studentId]` — student hub (assignments + notes)
- `/teacher/students/[studentId]/assign`
- `/teacher/repertoire` — search canonical catalog
- `/teacher/library` — teacher's saved pieces
- `/teacher/library/new`
- `/teacher/messages` — inbox
- `/teacher/messages/[threadId]`

### Guardian (`requireRole("GUARDIAN")`)
- `/guardian` — student cards with "Add practice note" CTA
- `/guardian/students/[studentId]`
- `/guardian/messages` — inbox
- `/guardian/messages/[threadId]`

### Student (`requireRole("STUDENT")`)
- `/student/me` — assignments + notes
- `/student/messages` — only if `student.canMessage = true`
- `/student/messages/[threadId]`

---

## Messaging Design

### Overview

Private 1:1 threads between teachers and guardians. Separate from Notes (which are student-progress records visible to all access holders).

### Thread Types

| Type | `studentId` | Who can see |
|------|-------------|-------------|
| General | `null` | Teacher + Guardian only |
| Student-scoped | Student's id | Teacher + Guardian + Student (if `canMessage=true`) |

### Unread Tracking

`MessageThreadReadStatus.lastReadAt` updated when user opens a thread. Unread = `thread.updatedAt > lastReadAt`.

### Service Functions (`src/server/messageService.ts`)

- `findOrCreateThread(teacherId, guardianId, studentId?)` — deduplicates in service layer
- `sendMessage(authorId, threadId, body)` — validates participant, updates `thread.updatedAt`
- `listThreadsForUser(userId, role)` — inbox with latest message preview + unread flag
- `getThreadMessages(threadId, userId, cursor?)` — paginated, marks thread read on fetch
- `markThreadRead(userId, threadId)` — upserts `MessageThreadReadStatus`

---

## Service Layer

All business logic lives in `src/server/`. Route handlers stay thin.

| Service | File | Status |
|---------|------|--------|
| Session helpers | `src/server/session.ts` | ✅ Done |
| StudentService | `src/server/studentService.ts` | ✅ Done |
| AccessService | `src/server/accessService.ts` | 🔲 Pending |
| RepertoireService | `src/server/repertoireService.ts` | 🔲 Pending |
| AssignmentService | `src/server/assignmentService.ts` | 🔲 Pending |
| NoteService | `src/server/noteService.ts` | 🔲 Pending |
| MessageService | `src/server/messageService.ts` | 🔲 Pending |

---

## Error Handling

- `401` → redirect `/login`
- `403` → `/403` page ("You don't have access")
- `404` → `app/not-found.tsx`
- `422` → inline form errors
- `500` → `app/error.tsx`

---

## Pagination

Notes and messages use cursor-based pagination:
- Notes: paginate top-level only (`parentId = null`); bundle replies with each parent
- Messages: paginate by `createdAt` within a thread

---

## Future Extensions

- **Real-time messaging** — current async model (page refresh) is MVP. Post-MVP: upgrade to WebSockets or Server-Sent Events for live message delivery without page refresh.
- **Guardian search on student creation** — replace inline name/email form with autocomplete that searches existing guardian users first (Task #26)
- **Email notifications** — notify guardians/teachers of new messages or notes via email
- **Studio organizations / multi-tenant** — multiple studios, owner billing accounts
- **Scheduling/calendar** — recurring lessons, cancellation tracking
- **Practice recordings + AI analysis**
- **Progress charts and analytics**
- **CSV/Excel roster import** — teacher uploads spreadsheet, system maps columns and creates students + guardian accounts in bulk
- **External repertoire APIs** — OpenOpus (classical), MusicBrainz integration; `RepertoireItem.source` + `externalId` fields are already stubbed for this
