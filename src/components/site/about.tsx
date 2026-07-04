"use client";

import { motion } from "framer-motion";
import { Aperture, Heart, MapPin, Award } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Story-first",
    desc: "We chase the in-between glances, not just the posed frames. That's where the memory lives.",
  },
  {
    icon: Aperture,
    title: "Light-obsessed",
    desc: "Golden hour or low-light receptions — every exposure is metered for mood, not just brightness.",
  },
  {
    icon: Award,
    title: "Delivered with care",
    desc: "Hand-edited, colour-graded and gallery-delivered. No filters, no shortcuts — just craft.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 border-t border-foreground/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* portrait */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-3 -top-3 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                [ 04 ] — The maker
              </div>
              <div className="overflow-hidden rounded-2xl border border-foreground/10">
                <img
                  src="/gallery/maker.jpg"
                  alt="The photographer behind PHOTOWALA BAYAD"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <div className="mt-4 flex items-center justify-between font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Behind the lens</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Bayad, Gujarat
                </span>
              </div>
            </motion.div>
          </div>

          {/* text */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Nine years of chasing light across Gujarat — and counting.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 space-y-4 text-base text-muted-foreground"
            >
              <p>
                PHOTOWALA BAYAD began as a single camera and a stubborn belief
                that ordinary days deserve extraordinary frames. Today it's a
                full-time studio shooting weddings, portraits and events across
                Bayad, Sabarkantha and beyond.
              </p>
              <p>
                The approach is simple: show up early, shoot honest, edit
                quietly. No forced smiles, no over-processed skies — just the
                moment as it actually felt, preserved for the years that
                follow.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="bg-background p-5"
                >
                  <p.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* signature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="text-2xl italic text-foreground/80" style={{ fontFamily: "Georgia, serif" }}>
                — Photowala
              </div>
              <div className="h-px flex-1 bg-foreground/10" />
              <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                Est. 2016
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
