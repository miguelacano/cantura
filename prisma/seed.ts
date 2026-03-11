import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10)

  // Users
  const admin = await db.user.upsert({
    where: { email: "admin@cantura.dev" },
    update: {},
    create: {
      email: "admin@cantura.dev",
      name: "Admin",
      role: "ADMIN",
      passwordHash: hash("password"),
    },
  })

  const teacher = await db.user.upsert({
    where: { email: "teacher@cantura.dev" },
    update: {},
    create: {
      email: "teacher@cantura.dev",
      name: "Ms. Rivera",
      role: "TEACHER",
      studioName: "Rivera Music Studio",
      passwordHash: hash("password"),
    },
  })

  const guardian = await db.user.upsert({
    where: { email: "guardian@cantura.dev" },
    update: {},
    create: {
      email: "guardian@cantura.dev",
      name: "Alex Chen",
      role: "GUARDIAN",
      passwordHash: hash("password"),
    },
  })

  const studentUser = await db.user.upsert({
    where: { email: "student@cantura.dev" },
    update: {},
    create: {
      email: "student@cantura.dev",
      name: "Jamie Chen",
      role: "STUDENT",
      passwordHash: hash("password"),
    },
  })

  // Instruments
  const piano = await db.instrument.upsert({
    where: { name: "Piano" },
    update: {},
    create: { name: "Piano" },
  })

  await db.instrument.upsert({
    where: { name: "Violin" },
    update: {},
    create: { name: "Violin" },
  })

  await db.instrument.upsert({
    where: { name: "Guitar" },
    update: {},
    create: { name: "Guitar" },
  })

  // Student record
  const student = await db.student.upsert({
    where: { id: "seed-student-001" },
    update: {},
    create: {
      id: "seed-student-001",
      firstName: "Jamie",
      lastName: "Chen",
      level: "Intermediate",
    },
  })

  // Access grants
  await db.studentAccess.upsert({
    where: {
      studentId_userId_role_instrumentId: {
        studentId: student.id,
        userId: teacher.id,
        role: "TEACHER",
        instrumentId: piano.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      userId: teacher.id,
      role: "TEACHER",
      instrumentId: piano.id,
    },
  })

  const guardianAccess = await db.studentAccess.findFirst({
    where: { studentId: student.id, userId: guardian.id, role: "GUARDIAN" },
  })
  if (!guardianAccess) {
    await db.studentAccess.create({
      data: { studentId: student.id, userId: guardian.id, role: "GUARDIAN", instrumentId: null },
    })
  }

  const studentAccess = await db.studentAccess.findFirst({
    where: { studentId: student.id, userId: studentUser.id, role: "STUDENT" },
  })
  if (!studentAccess) {
    await db.studentAccess.create({
      data: { studentId: student.id, userId: studentUser.id, role: "STUDENT", instrumentId: null },
    })
  }

  // Sample repertoire + teacher library
  const piece = await db.repertoireItem.upsert({
    where: { id: "seed-piece-001" },
    update: {},
    create: {
      id: "seed-piece-001",
      title: "Für Elise",
      composer: "Beethoven",
      category: "Classical",
    },
  })

  await db.teacherLibraryItem.upsert({
    where: { teacherId_repertoireItemId: { teacherId: teacher.id, repertoireItemId: piece.id } },
    update: {},
    create: {
      teacherId: teacher.id,
      repertoireItemId: piece.id,
    },
  })

  console.log("? Seeded successfully")
  console.log("  admin@cantura.dev    / password  (ADMIN)")
  console.log("  teacher@cantura.dev  / password  (TEACHER)")
  console.log("  guardian@cantura.dev / password  (GUARDIAN)")
  console.log("  student@cantura.dev  / password  (STUDENT)")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
