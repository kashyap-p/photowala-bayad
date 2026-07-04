import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

/**
 * TEMPORARY: Creates the database tables on Turso via raw SQL.
 * Called once after deployment to initialize the schema. Safe to delete
 * after the tables exist. Uses CREATE TABLE IF NOT EXISTS so it's idempotent.
 */
export async function POST() {
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

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "service" TEXT,
        "message" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "PortfolioItem" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "location" TEXT,
        "year" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // verify tables exist
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    const tableNames = tables.rows.map((r) => r.name);

    return NextResponse.json({
      ok: true,
      message: "Tables created successfully.",
      tables: tableNames,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
