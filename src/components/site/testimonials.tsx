"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/portfolio";

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIdx((p) => (p + d + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIdx((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[idx];

  return (
    <section
      id="voices"
      className="relative scroll-mt-20 overflow-hidden border-t border-foreground/10 bg-foreground/[0.02] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-accent">
              [ 05 ] — Client voices
            </div>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Loved by the people in the frame.
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => go(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 transition-colors hover:border-accent hover:text-accent"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 transition-colors hover:border-accent hover:text-accent"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[280px] sm:min-h-[240px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl"
            >
              <Quote className="h-10 w-10 text-accent/40" />
              <p className="mt-4 text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                “{t.quote}”
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-background font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.role}
                  </div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* dots */}
        <div className="mt-10 flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDir(i > idx ? 1 : -1);
                setIdx(i);
              }}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 28 : 10,
                background:
                  i === idx ? "var(--accent)" : "var(--foreground)",
                opacity: i === idx ? 1 : 0.2,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
