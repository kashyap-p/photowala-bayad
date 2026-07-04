"use client";

import { Camera, Instagram, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-foreground/10 bg-foreground/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-foreground/20">
                <Camera className="h-4 w-4" />
              </span>
              <div className="leading-[0.9]">
                <div className="font-mono-label text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  Photowala
                </div>
                <div className="font-display text-lg tracking-wide text-foreground">
                  BAYAD
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              A photography studio from Bayad, Gujarat — chasing light and
              preserving stories, one frame at a time.
            </p>
            <a
              href="https://www.instagram.com/photowala_bayad/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              <Instagram className="h-4 w-4" /> @photowala_bayad
            </a>
          </div>

          {/* links */}
          <div className="md:col-span-3">
            <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Explore
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["Work", "#work"],
                ["Services", "#services"],
                ["About", "#about"],
                ["Voices", "#voices"],
                ["Contact", "#contact"],
                ["Studio Login", "/admin/login"],
              ].map(([l, h]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="md:col-span-4">
            <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Reach us
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 text-accent" /> +91 98xxx xxxxx
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" /> hello@photowalabayad.com
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Bayad, Sabarkantha,<br />Gujarat 383 340, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
            © {year} Photowala Bayad · All frames reserved
          </p>
          <button
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
