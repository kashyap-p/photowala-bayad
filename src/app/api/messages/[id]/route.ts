import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

/** PATCH /api/messages/[id] — mark read/unread (admin only) */
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
    const read = typeof body?.read === "boolean" ? body.read : undefined;
    if (read === undefined) {
      return NextResponse.json(
        { ok: false, error: "Provide { read: boolean }" },
        { status: 400 }
      );
    }
    const message = await db.contactMessage.update({
      where: { id },
      data: { read },
    });
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    console.error("[messages] patch error", err);
    return NextResponse.json({ ok: false, error: "Could not update" }, { status: 500 });
  }
}

/** DELETE /api/messages/[id] — delete a message (admin only) */
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
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[messages] delete error", err);
    return NextResponse.json({ ok: false, error: "Could not delete" }, { status: 500 });
  }
}
