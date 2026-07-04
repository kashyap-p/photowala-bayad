import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Returns true if a database is actually configured. When the app is deployed
 * to Vercel without DATABASE_URL set (e.g. before Turso is wired up), the
 * Prisma client throws on first use — we surface a friendly message instead.
 */
function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return typeof url === "string" && url.length > 0 && !url.includes("REPLACE_ME");
}

const NOT_CONFIGURED = {
  ok: false,
  error:
    "The contact form is not connected to a database yet. Please email hello@photowalabayad.com directly while we finish setup.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body ?? {};

    // TEMP DEBUG: show what env vars are reaching the runtime
    const _debugEnv = {
      DATABASE_URL_set: typeof process.env.DATABASE_URL === "string",
      DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 20),
      DATABASE_URL_length: process.env.DATABASE_URL?.length,
      DATABASE_AUTH_TOKEN_set: typeof process.env.DATABASE_AUTH_TOKEN === "string",
      DATABASE_AUTH_TOKEN_length: process.env.DATABASE_AUTH_TOKEN?.length,
      all_env_keys: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("TURSO") || k.includes("LIBSQL")),
    };
    if (req.headers.get("x-debug-env")) {
      return NextResponse.json({ _debugEnv });
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please tell us your name." },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { ok: false, error: "Please add a short message." },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(NOT_CONFIGURED, { status: 503 });
    }

    const saved = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        service: service?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      ok: true,
      id: saved.id,
      message: "Message received. We'll reach out within 24 hours.",
    });
  } catch (err) {
    console.error("[contact] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        error: msg.includes("database")
          ? NOT_CONFIGURED.error
          : "Something went wrong. Please try again.",
        debug: msg,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true, messages: [] });
    }
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, messages });
  } catch (err) {
    console.error("[contact] list error", err);
    return NextResponse.json({ ok: true, messages: [] });
  }
}
