import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // No DATABASE_URL — return a stub that throws on use. The contact route
    // checks `process.env.DATABASE_URL` first and short-circuits, so this
    // keeps the rest of the app (static pages, assets) serving fine even
    // before the database is wired up on Vercel.
    throw new Error("DATABASE_URL is not set.");
  }

  // Local development: file-based SQLite, standard Prisma client.
  if (url.startsWith("file:")) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error"] : ["query"],
    });
  }

  // Production (Turso / libSQL): route through the libSQL adapter so the
  // same SQLite schema works over a remote connection on serverless platforms.
  const libsql = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter });
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Export a proxy so the client is created lazily on first use. This lets the
// app boot even when DATABASE_URL is unset (e.g. before Turso is configured).
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = undefined;
