# Cantura Architecture (MVP)

This document aligns with `AGENTS.md` and captures the minimal, production-shaped MVP architecture for Cantura.

---

**1) Final Prisma Schema**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  TEACHER
  GUARDIAN
  STUDENT // reserved for future use
}

enum StudentAccessRole {
  TEACHER
  GUARDIAN
}

model User {
  id          String           @id @default(cuid())
  email       String           @unique
  name        String?
  role        UserRole
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  studentAccesses StudentAccess[]
  notes           Note[]        @relation("NoteAuthor")

  @@index([role])
}

model Student {
  id          String          @id @default(cuid())
  firstName   String
  lastName    String
  dateOfBirth DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  accesses    StudentAccess[]
  pieces      StudentPiece[]
  notes       Note[]

  @@index([lastName, firstName])
}

model StudentAccess {
  id         String            @id @default(cuid())
  studentId  String
  userId     String
  role       StudentAccessRole
  createdAt  DateTime          @default(now())

  student    Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  user       User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([studentId, userId])
  @@index([userId])
  @@index([studentId, role])
}

model Piece {
  id          String          @id @default(cuid())
  title       String
  composer    String?
  createdById String
  createdAt   DateTime        @default(now())

  createdBy    User           @relation(fields: [createdById], references: [id])
  studentLinks StudentPiece[]

  @@index([createdById])
  @@index([title])
}

model StudentPiece {
  id           String         @id @default(cuid())
  studentId    String
  pieceId      String
  assignedById String
  assignedAt   DateTime       @default(now())
  status       String?        // "assigned", "in_progress", "completed"

  student     Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  piece       Piece           @relation(fields: [pieceId], references: [id], onDelete: Restrict)
  assignedBy  User            @relation(fields: [assignedById], references: [id])
  notes       Note[]

  @@unique([studentId, pieceId])
  @@index([studentId, assignedAt])
  @@index([pieceId])
}

model Note {
  id             String        @id @default(cuid())
  studentId      String
  authorId       String
  studentPieceId String?
  parentId       String?
  content        String
  createdAt      DateTime      @default(now())

  student       Student        @relation(fields: [studentId], references: [id], onDelete: Cascade)
  author        User           @relation("NoteAuthor", fields: [authorId], references: [id])
  studentPiece  StudentPiece?  @relation(fields: [studentPieceId], references: [id], onDelete: SetNull)

  parent        Note?          @relation("NoteReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       Note[]         @relation("NoteReplies")

  @@index([studentId, createdAt])
  @@index([studentPieceId, createdAt])
  @@index([parentId])
}
```

Why this shape:
1. Students are independent of user accounts.
2. Access is explicit and role-based via `StudentAccess`.
3. Notes relate to `StudentPiece` (not directly to `Piece`), keeping student-specific assignment context.
4. Reply depth is enforced at the service layer (parent note must have no parent).

---

**2) Folder Structure Tree**

```
src/
  app/
    api/
      students/
        route.ts
        [id]/
          route.ts
          notes/
            route.ts
            [noteId]/
              reply/
                route.ts
          pieces/
            route.ts
          access/
            route.ts
  server/
    auth/
      requireUser.ts
    db/
      prisma.ts
    services/
      studentService.ts
      accessService.ts
      noteService.ts
      pieceService.ts
    validation/
      student.ts
      access.ts
      piece.ts
      note.ts
```

Why:
- `src/server/**` owns all domain and data access logic, per `AGENTS.md`.
- Route handlers remain thin and call services.

---

**3) Service-Layer Outline (TypeScript Examples)**

```ts
// src/server/services/accessService.ts
import { prisma } from "@/server/db/prisma";

export async function requireStudentAccess(userId: string, studentId: string) {
  const access = await prisma.studentAccess.findUnique({
    where: { studentId_userId: { studentId, userId } },
  });
  if (!access) throw new Error("FORBIDDEN");
  return access;
}

export function canWriteStudent(accessRole: "TEACHER" | "GUARDIAN") {
  return accessRole === "TEACHER";
}
```

```ts
// src/server/services/noteService.ts
import { prisma } from "@/server/db/prisma";
import { requireStudentAccess } from "./accessService";

export async function createNote(params: {
  userId: string;
  studentId: string;
  studentPieceId?: string;
  content: string;
}) {
  await requireStudentAccess(params.userId, params.studentId);
  return prisma.note.create({
    data: {
      studentId: params.studentId,
      authorId: params.userId,
      studentPieceId: params.studentPieceId,
      content: params.content,
    },
  });
}

export async function replyToNote(params: {
  userId: string;
  studentId: string;
  parentNoteId: string;
  content: string;
}) {
  await requireStudentAccess(params.userId, params.studentId);

  const parent = await prisma.note.findUnique({
    where: { id: params.parentNoteId },
    select: { id: true, studentId: true, parentId: true },
  });
  if (!parent || parent.studentId !== params.studentId) throw new Error("NOT_FOUND");
  if (parent.parentId) throw new Error("REPLY_DEPTH_EXCEEDED");

  return prisma.note.create({
    data: {
      studentId: params.studentId,
      authorId: params.userId,
      parentId: parent.id,
      content: params.content,
    },
  });
}
```

Why:
- Services are the only place that touch Prisma.
- Reply depth is enforced consistently.
- Authorization checks are centralized and required for every student-scoped action.

---

**4) Route List (App Router)**

1. `app/api/students/route.ts`
2. `app/api/students/[id]/route.ts`
3. `app/api/students/[id]/notes/route.ts`
4. `app/api/students/[id]/notes/[noteId]/reply/route.ts`
5. `app/api/students/[id]/pieces/route.ts`
6. `app/api/students/[id]/access/route.ts`

---

**5) Zod Validation Examples**

```ts
// src/server/validation/student.ts
import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().datetime().optional(),
});
```

```ts
// src/server/validation/piece.ts
import { z } from "zod";

export const assignPieceSchema = z.object({
  pieceId: z.string().cuid(),
});
```

```ts
// src/server/validation/note.ts
import { z } from "zod";

export const createNoteSchema = z.object({
  content: z.string().min(1).max(2000),
  studentPieceId: z.string().cuid().optional(),
});

export const replyToNoteSchema = z.object({
  content: z.string().min(1).max(2000),
});
```

```ts
// src/server/validation/access.ts
import { z } from "zod";

export const addGuardianAccessSchema = z.object({
  userId: z.string().cuid(),
  role: z.literal("GUARDIAN"),
});
```

---

**6) Authorization Flow**

1. Authenticate the user in every route.
2. Call `requireStudentAccess(userId, studentId)` in every student-scoped service method.
3. Enforce role-based permissions server-side:
   - `TEACHER`: read/write student, assign pieces, manage access, create notes, reply.
   - `GUARDIAN`: read student, read pieces, create notes, reply.
4. Prevent escalation:
   - Only `TEACHER` can grant/revoke access.
   - Guardian access endpoint forces role to `GUARDIAN`.
5. Reply depth enforcement:
   - Replies only allowed if `parent.parentId` is null.

---

**7) 14-Day Build Plan**

Day 1: Confirm scope, finalize schema, create migrations.  
Day 2: Prisma client setup, auth utilities, seed data.  
Day 3: Access service and student service.  
Day 4: Student routes + zod validation.  
Day 5: Piece service + routes.  
Day 6: Note service + routes.  
Day 7: Pagination for notes, indexes review, consistent errors.  
Day 8: Minimal UI pages (server components) for student list and detail.  
Day 9: Notes UI (list + create + reply).  
Day 10: Guardian access UI.  
Day 11: Basic tests for services.  
Day 12: Hardening (edge cases, safe errors).  
Day 13: Performance pass (avoid N+1, include relations).  
Day 14: Cleanup, docs, deploy checklist.

Minimum viable path if time is tight:
1. Schema + migrations.
2. Access service + student read endpoints.
3. Notes (create + reply) with pagination.
4. Thin UI for teacher use only.
5. Add guardian access endpoint.

---

**8) Performance Considerations**

1. Pagination:
   - Cursor pagination on `createdAt` + `id` for stable ordering.
2. Avoid N+1:
   - Use `include` or focused `select` in Prisma service methods.
3. Indexes:
   - `StudentAccess` by `userId` and `studentId`.
   - `Note` by `studentId, createdAt`.
   - `Note` by `studentPieceId, createdAt`.
4. Next.js caching:
   - Later phase: use `revalidate` for read-only pages.
   - No caching layer for writes.
5. No Redis for MVP.
```
