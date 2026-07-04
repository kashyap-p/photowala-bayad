"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Camera, MapPin, Calendar } from "lucide-react";
import { portfolio, categories, type Category } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type Filter = "All" | Category;

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(() => {
    if (filter === "All") return portfolio;
    return portfolio.filter((p) => p.category === filter);
  }, [filter]);

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
            A rotating selection of recent shoots across weddings, portraits,
            events and the streets. Tap any frame to enlarge.
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

        {/* grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <PhotoCard key={p.id} photo={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}

function PhotoCard({
  photo,
}: {
  photo: (typeof portfolio)[number];
}) {
  const [zoom, setZoom] = useState(false);

  const spanClass =
    photo.span === "tall"
      ? "row-span-2"
      : photo.span === "wide"
      ? "col-span-2"
      : "";

  return (
    <>
      <motion.button
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setZoom(true)}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5",
          "aspect-square",
          spanClass
        )}
      >
        {/* image */}
        <img
          src={photo.image}
          alt={photo.title}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-700 ease-out",
            "group-hover:scale-[1.06]",
            photo.span === "wide" && "aspect-[2/1]",
            photo.span === "tall" && "aspect-[1/2]"
          )}
        />
        {/* gradient + meta */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
        {/* corner index */}
        <div className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-black/40 font-mono-label text-[10px] text-white backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Camera className="h-3 w-3" />
        </div>
      </motion.button>

      {/* lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] max-w-4xl overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="max-h-[80vh] w-full object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/90 to-transparent p-6">
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
                <button
                  onClick={() => setZoom(false)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
