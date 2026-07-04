import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/galleries/[slug]/access
 * Verifies the password for a password-protected gallery.
 * The [id] param is treated as a slug here (the public share link uses slugs).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await params;
  try {
    const body = await req.json();
    const password = body?.password ?? "";

    const gallery = await db.gallery.findUnique({
      where: { slug },
      select: { id: true, password: true, expiresAt: true },
    });

    if (!gallery) {
      return NextResponse.json({ ok: false, error: "Gallery not found." }, { status: 404 });
    }

    // expired?
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      return NextResponse.json({ ok: false, error: "This gallery has expired." }, { status: 403 });
    }

    // no password set = open access
    if (!gallery.password) {
      return NextResponse.json({ ok: true });
    }

    if (password !== gallery.password) {
      return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[access] error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
