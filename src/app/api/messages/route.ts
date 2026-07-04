import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

/** GET /api/messages — list all contact enquiries (admin only) */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    const unread = messages.filter((m) => !m.read).length;
    return NextResponse.json({ ok: true, messages, unread });
  } catch (err) {
    console.error("[messages] list error", err);
    return NextResponse.json(
      { ok: false, error: "Could not load messages." },
      { status: 500 }
    );
  }
}
