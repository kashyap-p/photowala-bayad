import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { hashPassword } from "@/lib/password";

/**
 * TEMPORARY: Creates all DB tables on Turso and optionally seeds the admin user.
 * POST /api/setup-db  { "email": "...", "password": "...", "name": "..." }
 * Safe to delete after setup is complete.
 */
export async function POST(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url || url.startsWith("file:")) {
    return NextResponse.json(
      { ok: false, error: "Not configured for remote DB." },
      { status: 400 }
    );
  }

  try {
    const client = createClient({ url, authToken });

    // create all tables
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT,
        "service" TEXT, "message" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "PortfolioItem" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL, "category" TEXT NOT NULL, "image" TEXT NOT NULL,
        "location" TEXT, "year" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "AdminUser" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "email" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email")`);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Gallery" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "slug" TEXT NOT NULL,
        "title" TEXT NOT NULL, "clientName" TEXT NOT NULL, "clientEmail" TEXT NOT NULL,
        "note" TEXT, "password" TEXT, "expiresAt" DATETIME,
        "archived" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "Gallery_slug_key" ON "Gallery"("slug")`);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "galleryId" TEXT NOT NULL,
        "url" TEXT NOT NULL, "caption" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE
      )
    `);
    await client.execute(`CREATE INDEX IF NOT EXISTS "GalleryPhoto_galleryId_idx" ON "GalleryPhoto"("galleryId")`);

    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    const tableNames = tables.rows.map((r) => r.name);

    // optionally seed admin user
    let adminSeeded = false;
    const body = await req.json().catch(() => ({}));
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const name = body?.name?.trim() || null;

    if (email && password && password.length >= 8) {
      const existing = await client.execute({
        sql: 'SELECT "id" FROM "AdminUser" WHERE "email" = ?',
        args: [email],
      });
      const passwordHash = hashPassword(password);
      if (existing.rows.length > 0) {
        await client.execute({
          sql: 'UPDATE "AdminUser" SET "passwordHash" = ?, "name" = ? WHERE "email" = ?',
          args: [passwordHash, name, email],
        });
      } else {
        const id = `cmr${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
        await client.execute({
          sql: 'INSERT INTO "AdminUser" ("id", "email", "passwordHash", "name") VALUES (?, ?, ?, ?)',
          args: [id, email, passwordHash, name],
        });
      }
      adminSeeded = true;
    }

    return NextResponse.json({
      ok: true,
      tables: tableNames,
      adminSeeded,
      adminEmail: adminSeeded ? email : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
