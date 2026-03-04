import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { UserRole } from "@/generated/prisma/client"

const { auth } = NextAuth(authConfig)

const ROLE_LANDING: Record<UserRole, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher/students",
  GUARDIAN: "/guardian",
  STUDENT: "/student/me",
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth")

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (req.auth && pathname === "/") {
    const role = req.auth.user.role as UserRole
    return NextResponse.redirect(new URL(ROLE_LANDING[role], req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
