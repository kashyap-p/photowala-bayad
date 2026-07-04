import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // No DATABASE_URL — the contact route checks this and short-circuits
    // with a friendly message, so this throw only fires if code bypasses
    // that check. Keeps the app bootable without a database configured.
    throw new Error("DATABASE_URL is not set.");
  }

  // Prisma v7 adapter takes a config object directly (not a pre-created
  // client). The libSQL driver handles both local file: URLs (development)
  // and remote libsql:// URLs (Turso / serverless production).
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
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
