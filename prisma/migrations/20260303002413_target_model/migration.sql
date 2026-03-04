-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'GUARDIAN', 'STUDENT');

-- CreateEnum
CREATE TYPE "StudentAccessRole" AS ENUM ('TEACHER', 'GUARDIAN', 'STUDENT');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TEACHER',
    "passwordHash" TEXT,
    "bio" TEXT,
    "studioName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAccess" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "StudentAccessRole" NOT NULL,
    "instrumentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepertoireItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "composer" TEXT,
    "collection" TEXT,
    "externalId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepertoireItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherLibraryItem" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "repertoireItemId" TEXT NOT NULL,
    "personalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherLibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAssignment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherLibraryItemId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "parentId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStudentLastSeen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStudentLastSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_name_key" ON "Instrument"("name");

-- CreateIndex
CREATE INDEX "StudentAccess_userId_idx" ON "StudentAccess"("userId");

-- CreateIndex
CREATE INDEX "StudentAccess_studentId_idx" ON "StudentAccess"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAccess_studentId_userId_role_instrumentId_key" ON "StudentAccess"("studentId", "userId", "role", "instrumentId");

-- CreateIndex
CREATE INDEX "RepertoireItem_title_idx" ON "RepertoireItem"("title");

-- CreateIndex
CREATE INDEX "RepertoireItem_source_idx" ON "RepertoireItem"("source");

-- CreateIndex
CREATE INDEX "TeacherLibraryItem_teacherId_idx" ON "TeacherLibraryItem"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherLibraryItem_teacherId_repertoireItemId_key" ON "TeacherLibraryItem"("teacherId", "repertoireItemId");

-- CreateIndex
CREATE INDEX "StudentAssignment_studentId_idx" ON "StudentAssignment"("studentId");

-- CreateIndex
CREATE INDEX "StudentAssignment_studentId_instrumentId_idx" ON "StudentAssignment"("studentId", "instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAssignment_studentId_teacherLibraryItemId_instrument_key" ON "StudentAssignment"("studentId", "teacherLibraryItemId", "instrumentId");

-- CreateIndex
CREATE INDEX "Note_studentId_createdAt_idx" ON "Note"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Note_parentId_createdAt_idx" ON "Note"("parentId", "createdAt");

-- CreateIndex
CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserStudentLastSeen_userId_studentId_key" ON "UserStudentLastSeen"("userId", "studentId");

-- AddForeignKey
ALTER TABLE "StudentAccess" ADD CONSTRAINT "StudentAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAccess" ADD CONSTRAINT "StudentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAccess" ADD CONSTRAINT "StudentAccess_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherLibraryItem" ADD CONSTRAINT "TeacherLibraryItem_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherLibraryItem" ADD CONSTRAINT "TeacherLibraryItem_repertoireItemId_fkey" FOREIGN KEY ("repertoireItemId") REFERENCES "RepertoireItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_teacherLibraryItemId_fkey" FOREIGN KEY ("teacherLibraryItemId") REFERENCES "TeacherLibraryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "StudentAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudentLastSeen" ADD CONSTRAINT "UserStudentLastSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudentLastSeen" ADD CONSTRAINT "UserStudentLastSeen_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
