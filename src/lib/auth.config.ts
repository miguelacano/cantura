import type { NextAuthConfig } from "next-auth"
import type { UserRole } from "@/generated/prisma/client"

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [], // Credentials provider added in auth.ts (Node.js only)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = (user as { role: UserRole }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
