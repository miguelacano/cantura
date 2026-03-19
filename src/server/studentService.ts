import { z } from "zod";
import { db } from "./db";

export const CreateStudentSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  level: z.string().optional(),
  guardian: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
  }),
});

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;

export function fullName(s: { firstName: string; lastName: string }) {
  return `${s.firstName} ${s.lastName}`;
}

export async function createStudent(
  teacherId: string,
  input: CreateStudentInput
) {
  const data = CreateStudentSchema.parse(input);

  // Find or create guardian user (deduplicate by email)
  let guardian = await db.user.findUnique({
    where: { email: data.guardian.email },
  });
  if (!guardian) {
    guardian = await db.user.create({
      data: {
        email: data.guardian.email,
        name: `${data.guardian.firstName} ${data.guardian.lastName}`,
        role: "GUARDIAN",
      },
    });
  }

  // Create student + access records in a transaction
  return db.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        level: data.level,
      },
    });

    // Teacher access
    await tx.studentAccess.create({
      data: {
        studentId: student.id,
        userId: teacherId,
        role: "TEACHER",
        instrumentId: null,
      },
    });

    await tx.studentAccess.create({
      data: {
        studentId: student.id,
        userId: guardian.id,
        role: "GUARDIAN",
        instrumentId: null,
      },
    });

    return student;
  });
}

export async function getStudentForUser(studentId: string, userId: string) {
  const access = await db.studentAccess.findFirst({
    where: { studentId, userId },
  });
  if (!access) return null;
  return db.student.findUnique({ where: { id: studentId } });
}

export async function listStudentsForTeacher(teacherId: string) {
  const accesses = await db.studentAccess.findMany({
    where: { userId: teacherId, role: "TEACHER" },
    include: { student: true },
    distinct: ["studentId"],
  });
  return accesses.map((a) => a.student);
}

export async function listStudentsForGuardian(guardianId: string) {
  const accesses = await db.studentAccess.findMany({
    where: { userId: guardianId, role: "GUARDIAN" },
    include: { student: true },
  });
  return accesses.map((a) => a.student);
}

export async function listStudentsForGuardianWithTeachers(guardianId: string) {
  const accesses = await db.studentAccess.findMany({
    where: { userId: guardianId, role: "GUARDIAN" },
    include: {
      student: {
        include: {
          access: {
            where: { role: "TEACHER" },
            include: { user: { select: { name: true } }, instrument: true },
          },
        },
      },
    },
  });
  return accesses.map((a) => ({
    ...a.student,
    teachers: a.student.access.map((ta) => ({
      name: ta.user.name,
      instrument: ta.instrument?.name,
    })),
  }));
}

export async function listRecentNotesAcrossStudents(
  teacherId: string,
  limit = 5
) {
  const accesses = await db.studentAccess.findMany({
    where: { userId: teacherId, role: "TEACHER" },
    select: { studentId: true },
    distinct: ["studentId"],
  });
  const studentIds = accesses.map((a) => a.studentId);
  return db.note.findMany({
    where: { studentId: { in: studentIds }, parentId: null },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      author: { select: { id: true, name: true } },
      replies: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
