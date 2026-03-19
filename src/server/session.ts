import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/generated/prisma/client";

export async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();
  if (session.user.role !== role) redirect("/403");
  return session;
}

export async function requireAnyRole(roles: UserRole[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role as UserRole)) redirect("/403");
  return session;
}
