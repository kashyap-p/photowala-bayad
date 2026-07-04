import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

/** POST /api/galleries/[id]/photos — add one or more photos (admin only) */
export async function POST(
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
    const photos = Array.isArray(body?.photos) ? body.photos : [];

    if (photos.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No photos provided." },
        { status: 400 }
      );
    }

    // validate each photo has a url
    const valid = photos.filter(
      (p: { url?: string }) => typeof p?.url === "string" && p.url.length > 0
    );
    if (valid.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Each photo needs a url." },
        { status: 400 }
      );
    }

    // get current max order
    const existing = await db.galleryPhoto.findFirst({
      where: { galleryId: id },
      orderBy: { order: "desc" },
    });
    let nextOrder = (existing?.order ?? -1) + 1;

    const created = await db.$transaction(
      valid.map((p: { url: string; caption?: string }) =>
        db.galleryPhoto.create({
          data: {
            galleryId: id,
            url: p.url,
            caption: p.caption?.trim() || null,
            order: nextOrder++,
          },
        })
      )
    );

    return NextResponse.json({ ok: true, count: created.length });
  } catch (err) {
    console.error("[photos] add error", err);
    return NextResponse.json({ ok: false, error: "Could not add photos" }, { status: 500 });
  }
}

/** DELETE /api/galleries/[id]/photos?photoId=... — remove a single photo (admin only) */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const photoId = req.nextUrl.searchParams.get("photoId");
  if (!photoId) {
    return NextResponse.json({ ok: false, error: "photoId required" }, { status: 400 });
  }
  try {
    await db.galleryPhoto.delete({
      where: { id: photoId, galleryId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[photos] delete error", err);
    return NextResponse.json({ ok: false, error: "Could not delete" }, { status: 500 });
  }
}
