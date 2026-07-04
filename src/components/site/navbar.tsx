"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Voices", href: "#voices" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-foreground/10 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5"
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full">
              <img src="/logo.png" alt="Photowala Bayad logo" className="h-full w-full object-cover" />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-foreground/20 transition-colors group-hover:ring-accent/60" />
            </span>
            <span className="flex flex-col leading-[0.9]">
              <span className="font-mono-label text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Photowala
              </span>
              <span className="font-display text-xl tracking-wide text-foreground">
                BAYAD
              </span>
            </span>
          </button>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              title="Studio login"
            >
              <Lock className="h-3.5 w-3.5" />
              Studio
            </a>
            <a
              href="https://www.instagram.com/photowala_bayad/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <button
              onClick={() => go("#contact")}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95"
            >
              Book a shoot
            </button>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative flex flex-col gap-1 px-6 pt-24"
            >
              {links.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => go(l.href)}
                  className="border-b border-foreground/10 py-4 text-left text-3xl font-semibold tracking-tight"
                >
                  <span className="font-mono-label mr-3 text-xs text-accent">
                    0{i + 1}
                  </span>
                  {l.label}
                </motion.button>
              ))}
              <a
                href="https://www.instagram.com/photowala_bayad/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center gap-3 text-muted-foreground"
              >
                <Instagram className="h-5 w-5" /> @photowala_bayad
              </a>
              <a
                href="/admin/login"
                className="flex items-center gap-3 text-muted-foreground"
              >
                <Lock className="h-5 w-5" /> Studio login
              </a>
              <button
                onClick={() => go("#contact")}
                className="mt-4 rounded-full bg-foreground px-5 py-4 text-center font-medium text-background"
              >
                Book a shoot
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
