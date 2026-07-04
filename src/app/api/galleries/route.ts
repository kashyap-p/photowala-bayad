import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** GET /api/galleries — list all galleries (admin only) */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const galleries = await db.gallery.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { photos: true } } },
    });
    return NextResponse.json({ ok: true, galleries });
  } catch (err) {
    console.error("[galleries] list error", err);
    return NextResponse.json(
      { ok: false, error: "Could not load galleries." },
      { status: 500 }
    );
  }
}

/** POST /api/galleries — create a new gallery (admin only) */
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { title, clientName, clientEmail, note, password, expiresAt } = body ?? {};

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Gallery title is required." },
        { status: 400 }
      );
    }
    if (!clientName || typeof clientName !== "string" || clientName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Client name is required." },
        { status: 400 }
      );
    }

    // generate a unique slug
    const base = slugify(title) || "gallery";
    let slug = `${base}-${randomSuffix()}`;
    const existing = await db.gallery.findUnique({ where: { slug } });
    if (existing) slug = `${base}-${randomSuffix()}`;

    const gallery = await db.gallery.create({
      data: {
        slug,
        title: title.trim(),
        clientName: clientName.trim(),
        clientEmail: clientEmail?.trim() || "",
        note: note?.trim() || null,
        password: password?.trim() || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ ok: true, gallery });
  } catch (err) {
    console.error("[galleries] create error", err);
    return NextResponse.json(
      { ok: false, error: "Could not create gallery." },
      { status: 500 }
    );
  }
}
