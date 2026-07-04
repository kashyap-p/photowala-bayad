"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Camera, X, ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartImage } from "@/components/site/smart-image";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

interface Props {
  slug: string;
  title: string;
  clientName: string;
  note: string | null;
  hasPassword: boolean;
  expired: boolean;
  expiresAt: string | null;
  photos: Photo[];
}

export function GalleryView({
  slug,
  title,
  clientName,
  note,
  hasPassword,
  expired,
  expiresAt,
  photos,
}: Props) {
  const [unlocked, setUnlocked] = useState(!hasPassword);

  // Expired view
  if (expired) {
    return (
      <Shell title={title} clientName={clientName}>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">This gallery has expired</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            This private gallery was set to expire on{" "}
            {expiresAt && new Date(expiresAt).toLocaleDateString()}. Please
            contact your photographer if you need access restored.
          </p>
        </div>
      </Shell>
    );
  }

  // Password gate
  if (!unlocked) {
    return (
      <Shell title={title} clientName={clientName}>
        <PasswordGate slug={slug} onUnlock={() => setUnlocked(true)} />
      </Shell>
    );
  }

  return (
    <Shell title={title} clientName={clientName}>
      {note && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-10 max-w-2xl text-center text-base text-muted-foreground"
        >
          {note}
        </motion.p>
      )}

      {photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-foreground/15 py-20 text-center text-sm text-muted-foreground">
          Your photographer hasn't added any photos yet. Check back soon.
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}

      {expiresAt && (
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Available until {new Date(expiresAt).toLocaleDateString()}
        </div>
      )}
    </Shell>
  );
}

function Shell({
  title,
  clientName,
  children,
}: {
  title: string;
  clientName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-foreground/20">
              <Camera className="h-4 w-4" />
            </span>
            <span className="leading-[0.9]">
              <span className="block font-mono-label text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Photowala
              </span>
              <span className="block font-display text-lg tracking-wide">BAYAD</span>
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-accent">
            Private gallery
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Curated for {clientName} · By PHOTOWALA BAYAD
          </p>
        </motion.div>
        {children}
      </main>
    </div>
  );
}

function PasswordGate({
  slug,
  onUnlock,
}: {
  slug: string;
  onUnlock: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/galleries/${slug}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        onUnlock();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Could not verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-16">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-foreground/15">
        <Lock className="h-6 w-6 text-accent" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">Password protected</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter the password your photographer shared with you to view this
        gallery.
      </p>
      <form onSubmit={submit} className="mt-6 w-full space-y-3">
        <div className="space-y-2">
          <Label className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
            Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
            className="h-11"
          />
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <Button type="submit" className="h-11 w-full" disabled={loading}>
          {loading ? "Checking…" : "Unlock gallery"}
        </Button>
      </form>
    </div>
  );
}

function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const next = () =>
    setLightbox((i) => (i === null ? i : (i + 1) % photos.length));
  const prev = () =>
    setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3"
      >
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setLightbox(i)}
            className="group relative block w-full overflow-hidden rounded-xl border border-foreground/10 break-inside-avoid"
          >
            <SmartImage
              src={p.url}
              alt={p.caption || ""}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {p.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {p.caption}
              </div>
            )}
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
              style={{ right: "1rem" }}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage
                src={photos[lightbox].url}
                alt={photos[lightbox].caption || ""}
                className="max-h-[80vh] w-full object-contain rounded-lg"
              />
              {photos[lightbox].caption && (
                <p className="mt-3 text-center text-sm text-white/80">
                  {photos[lightbox].caption}
                </p>
              )}
              <p className="mt-1 text-center font-mono-label text-[10px] uppercase tracking-widest text-white/40">
                {lightbox + 1} / {photos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
