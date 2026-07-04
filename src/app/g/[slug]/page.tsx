import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GalleryView } from "./gallery-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await db.gallery.findUnique({
    where: { slug },
    select: { title: true, clientName: true },
  });
  if (!gallery) return { title: "Gallery — PHOTOWALA BAYAD" };
  return {
    title: `${gallery.title} — PHOTOWALA BAYAD`,
    description: `A private gallery for ${gallery.clientName}, curated by PHOTOWALA BAYAD.`,
  };
}

export default async function SharedGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await db.gallery.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!gallery) notFound();

  const expired =
    gallery.expiresAt !== null && new Date(gallery.expiresAt) < new Date();

  return (
    <GalleryView
      slug={gallery.slug}
      title={gallery.title}
      clientName={gallery.clientName}
      note={gallery.note}
      hasPassword={!!gallery.password}
      expired={expired}
      expiresAt={gallery.expiresAt?.toISOString() ?? null}
      photos={gallery.photos.map((p) => ({
        id: p.id,
        url: p.url,
        caption: p.caption,
      }))}
    />
  );
}
