"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Aperture } from "lucide-react";

const TITLE = "PHOTOWALA BAYAD".split("");

/**
 * Cinematic intro: a full-screen black overlay showing the PHOTOWALA BAYAD
 * wordmark revealing letter-by-letter with an animated aperture, then fades
 * away. Plays on every page load/refresh.
 *
 * Uses a mounted flag to avoid hydration mismatch — the server renders
 * nothing, then the client shows the loader after mount.
 */
export function CinematicLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the loader on every page load/refresh after hydration.
    // setState in effect is intentional — we must render show=false on the
    // server (no window) to avoid hydration mismatch, then flip to true.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* aperture icon spinning up */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="relative grid h-20 w-20 place-items-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                className="absolute inset-0"
              >
                <Aperture className="h-20 w-20 text-accent" strokeWidth={1} />
              </motion.span>
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                className="absolute inset-2"
              >
                <Aperture className="h-16 w-16 text-accent/60" strokeWidth={0.5} />
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-accent"
              />
            </div>
          </motion.div>

          {/* letter-by-letter title reveal */}
          <h1 className="font-display flex flex-wrap justify-center px-4 text-[12vw] leading-none tracking-wide sm:text-4xl lg:text-5xl">
            {TITLE.map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={c === " " ? "inline-block w-[0.3em]" : "inline-block"}
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
          </h1>

          {/* tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-4 font-mono-label text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            Photography Studio
          </motion.p>

          {/* progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 2.1, ease: "easeInOut" }}
            className="mt-8 h-px w-40 origin-left bg-accent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
