"use client";

import { motion } from "framer-motion";
import { ArrowDown, Aperture as ApertureIcon } from "lucide-react";
import { Aperture } from "./aperture";

const title = "PHOTOWALA".split("");
const sub = "BAYAD".split("");

export function Hero() {
  const scrollToWork = () =>
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative grain overflow-hidden pt-16">
      {/* radial backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* left: text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for 2026 bookings · Bayad, Gujarat
          </motion.div>

          {/* letter-spaced hero title */}
          <h1 className="font-display tracking-wide">
            <span className="block overflow-hidden">
              <motion.span
                className="flex flex-wrap text-[17vw] leading-[0.82] sm:text-[13vw] lg:text-[8.5vw]"
                aria-label="PHOTOWALA"
              >
                {title.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.span>
            </span>
            <span className="mt-1 block overflow-hidden">
              <motion.span
                className="flex flex-wrap items-center gap-x-3 text-[17vw] leading-[0.82] sm:text-[13vw] lg:text-[8.5vw]"
                aria-label="BAYAD"
              >
                {sub.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block text-accent"
                  >
                    {c}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="hidden h-[0.6vw] w-[20vw] origin-left rounded-full bg-accent/60 lg:block"
                />
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            A photography studio crafting timeless frames — weddings, portraits,
            events &amp; the streets of India. Light, story, and soul in every
            click.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={scrollToWork}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95"
            >
              View the portfolio
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <a
              href="https://www.instagram.com/photowala_bayad/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Follow on Instagram
            </a>
          </motion.div>

          {/* meta strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-foreground/10 pt-6"
          >
            {[
              ["ISO", "100"],
              ["SHUTTER", "1/250"],
              ["MODE", "M"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                  {k}
                </div>
                <div className="mt-1 font-mono-label text-sm">{v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right: aperture */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-sm text-foreground lg:max-w-md"
          >
            <div className="absolute -left-6 -top-6 hidden font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              [ 01 ] — Interactive
            </div>
            <Aperture />
            <div className="mt-4 flex items-center justify-center gap-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              <ApertureIcon className="h-3 w-3" />
              Move your cursor · click to fire the shutter
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={scrollToWork}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground sm:flex"
      >
        <span className="font-mono-label text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-foreground/15">
          <motion.span
            animate={{ y: [-40, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-4 bg-accent"
          />
        </span>
      </motion.button>
    </section>
  );
}
