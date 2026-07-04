import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

/** GET /api/galleries/[id] — single gallery with photos (admin only) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const gallery = await db.gallery.findUnique({
      where: { id },
      include: { photos: { orderBy: { order: "asc" } } },
    });
    if (!gallery) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, gallery });
  } catch (err) {
    console.error("[gallery] get error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/** PATCH /api/galleries/[id] — update gallery fields (admin only) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const { title, clientName, clientEmail, note, password, expiresAt, archived } =
      body ?? {};

    const data: Record<string, unknown> = {};
    if (typeof title === "string") data.title = title.trim();
    if (typeof clientName === "string") data.clientName = clientName.trim();
    if (typeof clientEmail === "string") data.clientEmail = clientEmail.trim();
    if (typeof note === "string") data.note = note.trim() || null;
    if (typeof password === "string") data.password = password.trim() || null;
    if (typeof archived === "boolean") data.archived = archived;
    if (expiresAt !== undefined) {
      data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const gallery = await db.gallery.update({ where: { id }, data });
    return NextResponse.json({ ok: true, gallery });
  } catch (err) {
    console.error("[gallery] update error", err);
    return NextResponse.json({ ok: false, error: "Could not update" }, { status: 500 });
  }
}

/** DELETE /api/galleries/[id] — delete gallery + cascade photos (admin only) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.gallery.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[gallery] delete error", err);
    return NextResponse.json({ ok: false, error: "Could not delete" }, { status: 500 });
  }
}
