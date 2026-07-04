"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/portfolio";

export function StatsBand() {
  return (
    <section className="border-y border-foreground/10 bg-foreground/[0.02]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-foreground/10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="px-4 py-8 text-center lg:py-10"
          >
            <div className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const words = [
  "Weddings",
  "Portraits",
  "Events",
  "Street",
  "Landscapes",
  "Pre-Wedding",
  "Candid",
  "Cinematic",
];

export function MarqueeBand() {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-b border-foreground/10 py-5">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-2xl font-semibold tracking-tight text-foreground/80 sm:text-3xl">
              {w}
            </span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
