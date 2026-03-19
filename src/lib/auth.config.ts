import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/generated/prisma/client";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 }, // 24 hours
  providers: [], // Credentials provider added in auth.ts (Node.js only)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      // TODO: type assertions needed because `declare module "@auth/core/jwt"` augmentation
      // fails under `moduleResolution: "bundler"` — the JWT interface lives in @auth/core/jwt
      // but next-auth/jwt only re-exports it, so augmenting the wrapper has no effect.
      // Track: https://github.com/nextauthjs/next-auth/issues/9253
      // Revisit when Auth.js v5 resolves JWT type augmentation with bundler module resolution.
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
