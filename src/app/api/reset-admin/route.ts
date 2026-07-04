import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

/**
 * TEMPORARY: Resets the admin password. Call once after deploy:
 *   POST /api/reset-admin
 *   { "email": "...", "password": "..." }
 * Then delete this route.
 */
export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Database not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Valid email required." },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Password must be 8+ characters." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    // Use Prisma upsert (not raw SQL) for reliable hash storage
    const admin = await db.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash, name: "Photowala Bayad" },
    });

    // Verify the hash works immediately
    const verified = verifyPassword(password, admin.passwordHash);

    return NextResponse.json({
      ok: true,
      id: admin.id,
      email: admin.email,
      hashVerified: verified,
      hashPrefix: admin.passwordHash.substring(0, 20),
      message: verified
        ? "Admin password reset. You can now log in."
        : "Warning: hash verification failed. Check scrypt support.",
    });
  } catch (err) {
    console.error("[reset-admin] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
