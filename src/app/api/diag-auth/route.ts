import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

/**
 * TEMPORARY diagnostic: tests the full auth chain on the runtime.
 * GET /api/diag-auth?email=...&password=...
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const password = url.searchParams.get("password") || "";

  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    runtime: typeof window === "undefined" ? "server" : "client",
    dbConfigured: isDatabaseConfigured(),
    email,
    passwordLength: password.length,
  };

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ...result, error: "DB not configured" });
  }

  try {
    // 1. Can we query the DB?
    const admin = await db.adminUser.findUnique({
      where: { email: email || "admin@photowalabayad.com" },
    });
    result.adminFound = !!admin;
    if (admin) {
      result.hashPrefix = admin.passwordHash.substring(0, 25);
      result.hashLength = admin.passwordHash.length;
      result.hashScheme = admin.passwordHash.split(":")[0];

      // 2. Verify the password
      const verified = verifyPassword(password, admin.passwordHash);
      result.passwordVerified = verified;

      // 3. Test a fresh hash
      const freshHash = hashPassword(password);
      const freshVerified = verifyPassword(password, freshHash);
      result.freshHashVerified = freshVerified;
    }
  } catch (err) {
    result.dbError = err instanceof Error ? err.message : "unknown";
  }

  return NextResponse.json(result);
}
