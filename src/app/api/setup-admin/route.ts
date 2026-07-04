import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

/**
 * TEMPORARY: Creates or updates the admin user so Photowala can log in.
 * Call once after deployment:
 *   POST /api/setup-admin
 *   { "email": "...", "password": "...", "name": "..." }
 *
 * Delete this route after the admin is seeded.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const name = body?.name?.trim() || null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    const admin = await db.adminUser.upsert({
      where: { email },
      update: { passwordHash, name },
      create: { email, passwordHash, name },
    });

    return NextResponse.json({
      ok: true,
      id: admin.id,
      email: admin.email,
      message: "Admin user ready. You can now log in at /admin/login.",
    });
  } catch (err) {
    console.error("[setup-admin] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
