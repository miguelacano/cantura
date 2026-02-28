# Cantura Architecture (MVP)

Cantura is a production-oriented studio management web app for private music teachers. The system manages relationships between Teachers, Students, and Guardians with strict server-side authorization.

This document captures the minimal, production-shaped MVP architecture: entities, flows, auth rules, and route/API shape.

---

## Goals (MVP)

- Teacher-led studio workflows:
  - create students
  - attach teachers to students by instrument
  - invite guardians / students
  - manage a teacher library of repertoire (pieces + exercises)
  - assign repertoire to students
  - write notes and replies (single-level)
  - guardians/students can view and participate in notes

- Admin workflows:
  - create/manage users (especially teachers)
  - manage instrument catalog
  - (optional) support view into a student’s access graph

---

## Non-Goals (MVP)

- calendar/scheduling, payments, messaging, notifications
- multi-tenant studio organizations
- audio uploads, AI analysis
- deep threaded discussions (only one reply depth)

---

## Data Model Overview

> Do not treat the Prisma schema as “database first.” This model is designed to reflect user flows:
> instrument-scoped teaching relationships, shared repertoire, teacher library, and student assignments.

### Core Entities

- **User**
  - roles: ADMIN, TEACHER, GUARDIAN, STUDENT
  - authenticates + logs in

- **Student**
  - represents a learner
  - may or may not have login credentials (linked to a User with role STUDENT)

- **Instrument**
  - admin-managed catalog (Piano, Guitar, Violin, Voice, etc.)
  - used to scope teacher↔student relationships and assignments

### Access Control

- **StudentAccess** (join model)
  - defines whether a User can access a Student
  - **TEACHER access is instrument-scoped** (requires instrumentId)
  - GUARDIAN and STUDENT access is student-wide (instrumentId must be null)
  - supports revoke (soft revoke recommended)

### Repertoire + Assignments

- **RepertoireItem** (canonical shared catalog)
  - tracks metadata only (title, composer, collection, etc.)
  - may store external identifiers for metadata providers
  - does not store copyrighted score files

- **TeacherLibraryItem**
  - teacher’s curated library entry referencing a RepertoireItem
  - allows teacher-specific overrides/notes without duplicating repertoire

- **StudentAssignment**
  - assignment of a TeacherLibraryItem to a Student within an Instrument context
  - prevents duplicate assignment of the same library item in the same instrument lane

### Notes

- **Note**
  - belongs to a Student
  - authored by a User (Teacher/Guardian/Student)
  - optionally attaches to a StudentAssignment
  - supports replies via parentId
  - **reply depth is limited to one level** (enforced in application logic)

### Guardian/Student Dashboard Support (Optional but useful)

- **UserStudentLastSeen**
  - used for “unread since last visit” on dashboards
  - avoids building a notifications system

---

## Authorization Rules (MVP)

Authorization is enforced server-side in services (not only in UI).

### TEACHER

- can view students where they have StudentAccess(role=TEACHER, instrumentId=…)
- can create/edit students they teach (policy choice; safe MVP: allow edits for any teacher access)
- can manage guardian/student access for students they teach
- can create/own TeacherLibraryItems
- can assign repertoire to students in an instrument they teach
- can create/edit/delete notes (for students they teach)
- can reply to notes

### GUARDIAN

- can view student(s) they have StudentAccess(role=GUARDIAN)
- can create notes and replies (single-level)
- cannot manage access
- cannot assign repertoire
- cannot edit/delete other users’ notes (safe MVP: guardians can edit/delete only their own notes or none)

### STUDENT

- can view student record linked to them and/or students they have StudentAccess(role=STUDENT)
- can view assignments + notes
- can create notes and replies (same as guardian)

### ADMIN

- can manage users
- can manage instrument catalog
- can (optionally) view student + access graph for support
- does not need to participate in notes or assignments

---

## Critical Invariants (Enforce in Service Layer)

Because some constraints are hard to enforce purely in Prisma/Postgres:

1. StudentAccess invariants:

- if role=TEACHER => instrumentId is required
- if role in (GUARDIAN, STUDENT) => instrumentId must be null

2. Reply depth:

- when creating a reply (parentId provided), parent must exist and parent.parentId must be null

3. Assignment authorization:

- assigning teacher must have StudentAccess(role=TEACHER, instrumentId matches assignment.instrumentId)

4. Prevent duplicates:

- StudentAssignment unique constraint blocks duplicates for (studentId, teacherLibraryItemId, instrumentId)

---

## UI Routes (App Router)

### Shared

- /login
- /logout
- /error (optional)
- /404 (not-found)

### Admin

- /admin
- /admin/users
- /admin/instruments
- /admin/students/[studentId] (optional support view)

### Teacher

- /teacher
- /teacher/students
- /teacher/students/new
- /teacher/students/[studentId]
- /teacher/repertoire (search canonical catalog)
- /teacher/library (teacher’s saved repertoire)
- /teacher/library/new (optional shortcut)

### Guardian

- /guardian
- /guardian/students/[studentId]

### Student

- /student
- /student/me (or /student/students/[studentId] if future multi linkage)

---

## Key Screens and Flows

### 1) Login + Role Landing

- POST login -> resolve user role -> redirect:
  - ADMIN -> /admin
  - TEACHER -> /teacher/students
  - GUARDIAN -> /guardian
  - STUDENT -> /student

### 2) Teacher Onboarding (first run)

- show “Create your first student”
- create Student + attach teacher access with instrument selection
- land on Student hub

### 3) Student Creation (Teacher)

- create student record
- attach teacher(s) by instrument via StudentAccess

### 4) Attach Additional Teacher (Instrument-scoped)

- Student hub -> Access -> “Add teacher”
- select teacher user + instrument
- create StudentAccess(role=TEACHER, instrumentId)

### 5) Guardian / Student Invite (Access)

- Student hub -> Access -> “Invite guardian/student”
- create invite token
- recipient sets password -> StudentAccess row created

### 6) Repertoire Catalog -> Teacher Library

- Teacher searches RepertoireItem catalog
- “Add to my library” creates TeacherLibraryItem
- if not found, teacher/admin can create RepertoireItem (metadata only)

### 7) Assign Repertoire to Student (Instrument lane)

- from student -> choose instrument lane
- select TeacherLibraryItem -> create StudentAssignment (instrumentId required)

### 8) Notes + Replies

- notes list paginates top-level notes only (parentId null)
- include replies in response for each top-level note
- create note: student-scoped, optional assignmentId
- create reply: parent must be top-level note

### 9) Guardian/Student Dashboard (multi-child)

- list all students accessible via StudentAccess(role=GUARDIAN or STUDENT)
- show recent activity computed from notes + assignments
- optional unread via UserStudentLastSeen

---

## API / Service Layer Shape (Minimal)

Keep route handlers thin. Put all auth + invariants in services.

Example service boundaries:

- AuthService
  - login/logout, role-based redirect

- StudentService
  - createStudent (teacher/admin)
  - getStudent (requires access)
  - listAccessibleStudents (role-aware)
  - updateStudent (teacher/admin)

- AccessService
  - grantTeacherAccess(studentId, teacherUserId, instrumentId)
  - inviteGuardianOrStudent(studentId, email, role)
  - revokeAccess(accessId)

- RepertoireService
  - searchCatalog(query)
  - createRepertoireItem (teacher/admin)
  - addToTeacherLibrary(teacherId, repertoireItemId)

- AssignmentService
  - assignToStudent(studentId, instrumentId, teacherLibraryItemId)
  - updateAssignmentStatus(assignmentId, status)
  - listAssignments(studentId, instrumentId?)

- NoteService
  - listNotes(studentId, cursor/pageSize) // paginated top-level notes
  - createNote(studentId, body, assignmentId?)
  - replyToNote(parentNoteId, body) // enforce single-level
  - deleteNote(noteId) // teacher-only in MVP

---

## Error Handling / Pages

- 401: unauthenticated -> redirect to /login
- 403: authenticated but forbidden -> show “No access”
- 404: resource not found (or masked) -> Not Found page
- 422: validation errors -> inline form errors
- 500: unexpected -> generic error page

Next.js:

- app/not-found.tsx
- app/error.tsx

---

## Pagination Requirements

- Notes must be paginated:
  - paginate only top-level notes (parentId null)
  - include replies for returned parents (bounded)
  - recommended: cursor-based pagination by createdAt/id

---

## MVP Build Plan (Realistic When Job Hunting)

This is not a “14 day sprint.” It’s a **vertical slice** + **optional increments**.

### Slice 1 (1–3 focused sessions)

- Auth + role landing
- Teacher: create student + attach teacher access (instrument)
- Teacher: create repertoire item + add to library
- Teacher: assign to student
- Notes: create top-level note + reply (single depth)
- Guardian: dashboard + view student + add note

### Slice 2 (next 1–2 sessions)

- Invites (guardian + student)
- Last-seen/unread for dashboards (optional)
- Admin: instrument management

### Slice 3 (only if time)

- Curriculum tables + “assign next in level”
- Better search/import for repertoire metadata sources
- Polished empty states and 403/404 UX

---

## Future Extensions (Post-MVP)

- studio organizations / multi-tenant
- scheduling/calendar + recurring lessons
- notifications
- practice recordings + AI analysis
- deep analytics/progress charts
