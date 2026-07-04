"use client";

import { useEffect, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  Loader2, Plus, Link2, Copy, Check, Trash2, Images, Lock, Unlock,
  Calendar, Mail, User, ExternalLink, ArrowLeft, X, Camera, LogOut,
  ChevronRight, Inbox, MailOpen, Phone, Tag, Clock, Upload, FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { portfolio } from "@/lib/portfolio";
import { SmartImage } from "@/components/site/smart-image";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}
interface Gallery {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientEmail: string;
  note: string | null;
  password: string | null;
  expiresAt: string | null;
  archived: boolean;
  createdAt: string;
  photos?: Photo[];
  _count?: { photos: number };
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export function Dashboard({
  adminEmail,
  adminName,
}: {
  adminEmail?: string | null;
  adminName?: string | null;
}) {
  const { toast } = useToast();
  const [tab, setTab] = useState<"galleries" | "messages">("galleries");
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Gallery | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadGalleries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/galleries");
      const data = await res.json();
      if (data.ok) setGalleries(data.galleries);
    } catch {
      toast({ title: "Could not load galleries", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages);
        setUnreadCount(data.unread ?? 0);
      }
    } catch {
      toast({ title: "Could not load messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (tab === "galleries") loadGalleries();
    else loadMessages();
  }, [tab, loadGalleries, loadMessages]);

  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="grid h-9 w-9 place-items-center rounded-full border border-foreground/20 transition-colors hover:border-accent"
            >
              <Camera className="h-4 w-4" />
            </a>
            <div className="leading-[0.9]">
              <div className="font-mono-label text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Studio Dashboard
              </div>
              <div className="font-display text-lg tracking-wide">PHOTOWALA BAYAD</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {adminName || adminEmail}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
        {/* tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <TabButton
              active={tab === "galleries"}
              onClick={() => setTab("galleries")}
              icon={<Images className="h-4 w-4" />}
              label="Galleries"
            />
            <TabButton
              active={tab === "messages"}
              onClick={() => setTab("messages")}
              icon={<Inbox className="h-4 w-4" />}
              label="Messages"
              badge={unreadCount}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "galleries" ? (
          selected ? (
            <GalleryDetail
              gallery={selected}
              onBack={() => {
                setSelected(null);
                loadGalleries();
              }}
            />
          ) : (
            <>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Client galleries
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create private galleries, curate photos, and share secure links
                    with your clients.
                  </p>
                </div>
                <Button onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4" /> New gallery
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : galleries.length === 0 ? (
                <EmptyState onCreate={() => setShowCreate(true)} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleries.map((g) => (
                    <GalleryCard key={g.id} gallery={g} onOpen={() => setSelected(g)} />
                  ))}
                </div>
              )}
            </>
          )
        ) : (
          <MessagesView
            messages={messages}
            loading={loading}
            onChange={loadMessages}
          />
        )}
      </main>

      {showCreate && (
        <CreateGalleryDialog
          onClose={() => setShowCreate(false)}
          onCreated={(g) => {
            setShowCreate(false);
            setSelected(g);
            loadGalleries();
          }}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative -mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-accent text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 py-20 text-center">
      <Images className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No galleries yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first client gallery to curate photos and generate a
        shareable link.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="h-4 w-4" /> Create gallery
      </Button>
    </div>
  );
}

function GalleryCard({
  gallery,
  onOpen,
}: {
  gallery: Gallery;
  onOpen: () => void;
}) {
  const photoCount = gallery._count?.photos ?? gallery.photos?.length ?? 0;
  const shareUrl = `${window.location.origin}/g/${gallery.slug}`;
  const [copied, setCopied] = useState(false);

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={onOpen}
      className="group flex flex-col rounded-xl border border-foreground/10 bg-card p-5 text-left transition-all hover:border-foreground/30 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-semibold">{gallery.title}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            for {gallery.clientName}
          </p>
        </div>
        {gallery.password ? (
          <Lock className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Unlock className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Images className="h-3.5 w-3.5" /> {photoCount} photos
        </span>
        <span>·</span>
        <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 truncate rounded-lg border border-foreground/10 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
          <Link2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">/g/{gallery.slug}</span>
        </div>
        <span
          onClick={copyLink}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-foreground/10 transition-colors hover:border-accent hover:text-accent"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end text-xs font-medium text-muted-foreground transition-colors group-hover:text-accent">
        Manage <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

function CreateGalleryDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (g: Gallery) => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    note: "",
    password: "",
    expiresAt: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      toast({ title: "Gallery created", description: "Start adding photos." });
      onCreated(data.gallery);
    } catch (err) {
      toast({
        title: "Could not create",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-foreground/15 bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New client gallery</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Gallery title *">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Riya & Karan — Wedding"
                required
              />
            </Field>
            <Field label="Client name *">
              <Input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Riya Patel"
                required
              />
            </Field>
          </div>
          <Field label="Client email">
            <Input
              type="email"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              placeholder="riya@email.com"
            />
          </Field>
          <Field label="Note for client (optional)">
            <Textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="A short message shown at the top of the gallery…"
              rows={2}
              className="resize-none"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Access password (optional)">
              <Input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave empty for open link"
              />
            </Field>
            <Field label="Expires on (optional)">
              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create gallery"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GalleryDetail({
  gallery,
  onBack,
}: {
  gallery: Gallery;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>(gallery.photos ?? []);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/galleries/${gallery.id}`);
      const data = await res.json();
      if (data.ok) setPhotos(data.gallery.photos ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [gallery.id]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const shareUrl = `${window.location.origin}/g/${gallery.slug}`;
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied", description: shareUrl });
  };

  const addByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url || adding) return;
    // validate: must be a relative path starting with / or an http(s) URL
    if (!url.startsWith("/") && !/^https?:\/\//i.test(url)) {
      toast({
        title: "Invalid image URL",
        description: "Use a path like /gallery/wedding-1.png or a full https:// URL.",
        variant: "destructive",
      });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`/api/galleries/${gallery.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: [{ url, caption: captionInput.trim() || undefined }],
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setUrlInput("");
      setCaptionInput("");
      await loadPhotos();
      toast({ title: "Photo added" });
    } catch (err) {
      toast({
        title: "Could not add",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const addFromPortfolio = async (urls: string[]) => {
    setAdding(true);
    try {
      const res = await fetch(`/api/galleries/${gallery.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: urls.map((url) => ({ url })) }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setShowPortfolio(false);
      await loadPhotos();
      toast({ title: `${data.count} photos added` });
    } catch (err) {
      toast({
        title: "Could not add",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const uploadFromDevice = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const urls: string[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        // validate type
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: not an image`);
          continue;
        }
        // validate size (max 15MB)
        if (file.size > 15 * 1024 * 1024) {
          errors.push(`${file.name}: too large (max 15MB)`);
          continue;
        }

        // Compress + resize the image client-side via canvas, then convert
        // to a base64 data URL. This keeps the payload small enough for
        // Vercel's serverless body limit while accepting large source files.
        const dataUrl = await compressImage(file, 2000, 0.85);
        urls.push(dataUrl);
      }

      if (urls.length === 0) {
        throw new Error(errors.length > 0 ? errors[0] : "No valid files to upload.");
      }

      // add the data URLs to the gallery via the photos API
      await addFromPortfolio(urls);
      if (errors.length > 0) {
        toast({
          title: "Some files skipped",
          description: errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      const res = await fetch(
        `/api/galleries/${gallery.id}/photos?photoId=${photoId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setPhotos((p) => p.filter((x) => x.id !== photoId));
    } catch {
      toast({ title: "Could not remove", variant: "destructive" });
    }
  };

  const deleteGallery = async () => {
    if (!confirm(`Delete "${gallery.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/galleries/${gallery.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      toast({ title: "Gallery deleted" });
      onBack();
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All galleries
      </button>

      {/* gallery header */}
      <div className="mb-8 rounded-2xl border border-foreground/10 bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{gallery.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {gallery.clientName}
              </span>
              {gallery.clientEmail && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {gallery.clientEmail}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(gallery.createdAt).toLocaleDateString()}
              </span>
              {gallery.password && (
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <Lock className="h-3.5 w-3.5" /> Password protected
                </span>
              )}
            </div>
            {gallery.note && (
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                {gallery.note}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={deleteGallery}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>

        {/* share link */}
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-foreground/10 bg-background/50 p-3">
          <Link2 className="h-4 w-4 shrink-0 text-accent" />
          <code className="flex-1 truncate text-sm">{shareUrl}</code>
          <Button size="sm" variant="outline" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <a href={shareUrl} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" /> Preview
            </Button>
          </a>
        </div>
      </div>

      {/* add photos */}
      <div className="mb-6 rounded-2xl border border-foreground/10 bg-card p-5">
        <h3 className="mb-3 text-sm font-medium">Add photos</h3>

        {/* upload from device */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) uploadFromDevice(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground/15 py-8 text-center transition-colors hover:border-accent hover:bg-accent/[0.03]"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {uploading ? "Uploading…" : "Upload from device"}
            </span>
            <span className="text-xs text-muted-foreground">
              Click to choose photos — JPG, PNG, WebP (max 15MB each)
            </span>
          </label>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">or add by URL</span>
          </div>
        </div>

        <form onSubmit={addByUrl} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Image URL
            </Label>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://… or /gallery/photo-01.jpg"
              className="mt-1"
            />
          </div>
          <div className="min-w-[150px] flex-1">
            <Label className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Caption (optional)
            </Label>
            <Input
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="First dance"
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={adding || !urlInput.trim()}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </form>
        <button
          onClick={() => setShowPortfolio((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          {showPortfolio ? "Hide" : "Pick from"} existing portfolio photos
        </button>
        {showPortfolio && (
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-foreground/10 p-3 sm:grid-cols-5 lg:grid-cols-6">
            {portfolio.map((p) => (
              <button
                key={p.id}
                onClick={() => addFromPortfolio([p.image])}
                disabled={adding}
                className="group relative aspect-square overflow-hidden rounded-lg border border-foreground/10 transition-transform hover:scale-105 disabled:opacity-50"
              >
                <SmartImage
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Plus className="h-5 w-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* photos grid */}
      <h3 className="mb-3 text-sm font-medium">
        Photos {photos.length > 0 && `(${photos.length})`}
      </h3>
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-foreground/15 py-12 text-center text-sm text-muted-foreground">
          No photos yet. Add some above.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-foreground/10"
            >
              <SmartImage
                src={p.url}
                alt={p.caption || ""}
                className="h-full w-full object-cover"
              />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white">
                  {p.caption}
                </div>
              )}
              <button
                onClick={() => removePhoto(p.id)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesView({
  messages,
  loading,
  onChange,
}: {
  messages: Message[];
  loading: boolean;
  onChange: () => void;
}) {
  const { toast } = useToast();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleRead = async (m: Message) => {
    const next = !m.read;
    // optimistic
    setMessages((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, read: next } : x))
    );
    try {
      const res = await fetch(`/api/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: next }),
      });
      if (!res.ok) throw new Error();
      onChange();
    } catch {
      toast({ title: "Could not update", variant: "destructive" });
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, read: !next } : x))
      );
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOpenId(null);
      onChange();
      toast({ title: "Message deleted" });
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enquiries submitted through the contact form.
            {unread > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                {unread} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When clients submit the contact form on your site, their enquiries
            will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-foreground/10">
          {messages.map((m, i) => (
            <div key={m.id}>
              <button
                onClick={() => {
                  setOpenId(openId === m.id ? null : m.id);
                  // mark as read when opened
                  if (!m.read) toggleRead(m);
                }}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02] ${
                  i > 0 ? "border-t border-foreground/10" : ""
                } ${!m.read ? "bg-accent/[0.04]" : ""}`}
              >
                <span
                  className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    !m.read
                      ? "bg-accent text-accent-foreground"
                      : "bg-foreground/10 text-muted-foreground"
                  }`}
                >
                  {m.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`truncate ${!m.read ? "font-semibold" : "font-medium"}`}>
                      {m.name}
                    </span>
                    {!m.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    {m.service && (
                      <span className="hidden shrink-0 rounded-full border border-foreground/10 px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
                        {m.service}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {m.message}
                  </p>
                </div>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {formatDate(m.createdAt)}
                </span>
              </button>

              {/* expanded detail */}
              {openId === m.id && (
                <div className="border-t border-foreground/10 bg-foreground/[0.02] px-5 py-5">
                  <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" /> {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </a>
                    )}
                    {m.service && (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Tag className="h-3.5 w-3.5" /> {m.service}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />{" "}
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="rounded-lg border border-foreground/10 bg-background p-4 text-sm leading-relaxed">
                    {m.message}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${m.email}?subject=Re: Your enquiry to PHOTOWALA BAYAD`}>
                      <Button size="sm">
                        <Mail className="h-4 w-4" /> Reply by email
                      </Button>
                    </a>
                    {m.phone && (
                      <a href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" /> WhatsApp
                        </Button>
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRead(m)}
                    >
                      <MailOpen className="h-4 w-4" />
                      {m.read ? "Mark unread" : "Mark read"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => remove(m.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / 36e5;
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  if (diffH < 48) return "yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * Compresses and resizes an image File client-side using a canvas, then
 * returns a base64 data URL. This keeps the payload small enough for
 * serverless body limits while accepting large source files (up to 15MB).
 */
async function compressImage(
  file: File,
  maxDimension: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // calculate scaled dimensions
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // PNGs with transparency stay PNG; everything else becomes JPEG
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error(`Could not load ${file.name}`));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}
