import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/upload — upload one or more image files.
 * Returns the public URL paths for each uploaded file.
 * Files are saved to public/gallery/uploads/ and served statically.
 *
 * NOTE: On Vercel, the filesystem is ephemeral on serverless functions.
 * Files uploaded here will NOT persist across deployments. For production
 * use, integrate a real storage service (S3, Cloudinary, UploadThing, etc).
 * For now, this works for local dev and for files committed to the repo.
 */
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No files provided." },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "gallery", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // validate file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: not an image`);
        continue;
      }
      // validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: too large (max 10MB)`);
        continue;
      }

      // generate a unique filename
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const id = randomBytes(8).toString("hex");
      const filename = `${id}.${ext}`;
      const filepath = join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(bytes));

      urls.push(`/gallery/uploads/${filename}`);
    }

    return NextResponse.json({
      ok: true,
      urls,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[upload] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
