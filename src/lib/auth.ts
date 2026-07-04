import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

/**
 * Resolve the canonical URL for NextAuth. On Vercel, the VERCEL_URL env var
 * is set automatically. Falling back to the request origin ensures cookies
 * are set with the correct domain in all environments.
 */
function getAuthUrl(): string | undefined {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return undefined;
}

const authUrl = getAuthUrl();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Studio Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        try {
          const admin = await db.adminUser.findUnique({
            where: { email },
          });
          if (!admin) {
            console.warn("[auth] no admin found for", email);
            return null;
          }
          const valid = verifyPassword(password, admin.passwordHash);
          if (!valid) {
            console.warn("[auth] bad password for", email);
            return null;
          }
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name ?? undefined,
          };
        } catch (err) {
          console.error("[auth] authorize DB error", err);
          // Returning null shows "wrong credentials" — but the real issue is
          // a DB problem. We log it so it shows in Vercel runtime logs.
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as { id?: string }).id = token.id as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Explicit URL + cookie config for Vercel serverless reliability.
  ...(authUrl ? { url: authUrl } : {}),
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: undefined,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: undefined,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: undefined,
      },
    },
  },
};
