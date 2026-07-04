"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { portfolio, categories, type Category } from "@/lib/portfolio";
import { SmartImage } from "@/components/site/smart-image";
import { cn } from "@/lib/utils";

type Filter = "All" | Category;

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const visible = useMemo(() => {
    if (filter === "All") return portfolio;
    return portfolio.filter((p) => p.category === filter);
  }, [filter]);

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const navigate = useCallback(
    (dir: number) => {
      setLightboxIdx((prev) => {
        if (prev === null) return prev;
        return (prev + dir + visible.length) % visible.length;
      });
    },
    [visible.length]
  );

  // keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx, closeLightbox, navigate]);

  return (
    <section id="work" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mb-10 flex flex-col gap-6 border-b border-foreground/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-accent">
              [ 02 ] — Selected work
            </div>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Frames that hold a moment still.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            A rotating selection of recent shoots. Tap any frame to enlarge —
            use arrow keys to browse.
          </p>
        </div>

        {/* filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "relative rounded-full border px-4 py-2 text-sm transition-colors",
                filter === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {c}
              {filter === c && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
          <span className="ml-auto font-mono-label text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? "frame" : "frames"}
          </span>
        </div>

        {/* masonry grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <PhotoCard
                  key={p.id}
                  photo={p}
                  index={i}
                  onOpen={openLightbox}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && visible[lightboxIdx] && (
          <Lightbox
            photo={visible[lightboxIdx]}
            index={lightboxIdx}
            total={visible.length}
            onClose={closeLightbox}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: (typeof portfolio)[number];
  index: number;
  onOpen: (idx: number) => void;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => onOpen(index)}
      className="group relative block w-full overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 break-inside-avoid aspect-[3/4]"
    >
      {/* image — fixed aspect ratio, crop from top */}
      <SmartImage
        src={photo.image}
        alt={photo.title}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* meta on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="font-mono-label text-[10px] uppercase tracking-widest text-accent">
          {photo.category}
        </div>
        <div className="mt-1 text-base font-semibold text-white">
          {photo.title}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {photo.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {photo.year}
          </span>
        </div>
      </div>

      {/* corner camera icon */}
      <div className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Camera className="h-3 w-3" />
      </div>

      {/* expand hint */}
      <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ChevronRight className="h-3 w-3 rotate-45" />
      </div>
    </motion.button>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onNavigate,
}: {
  photo: (typeof portfolio)[number];
  index: number;
  total: number;
  onClose: () => void;
  onNavigate: (dir: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
    >
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
      >
        <X className="h-5 w-5" />
      </button>

      {/* prev/next */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* image */}
      <motion.div
        key={photo.id}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative max-h-[85vh] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <SmartImage
          src={photo.image}
          alt={photo.title}
          className="max-h-[78vh] w-full rounded-xl object-contain"
        />
        {/* caption */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono-label text-[10px] uppercase tracking-widest text-accent">
              {photo.category} · {photo.year}
            </div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {photo.title}
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5" /> {photo.location}
            </div>
          </div>
          {total > 1 && (
            <div className="font-mono-label text-xs text-white/40">
              {index + 1} / {total}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
