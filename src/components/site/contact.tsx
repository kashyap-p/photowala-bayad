"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2, Mail, Phone, MapPin, Instagram, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceOptions = [
  "Wedding Photography",
  "Portrait Session",
  "Event Coverage",
  "Street / Travel Commission",
  "Something else",
];

export function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Could not send message.");
      }
      setDone(true);
      toast({
        title: "Message sent",
        description: data.message ?? "We'll be in touch within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      toast({
        title: "Couldn't send",
        description:
          err instanceof Error ? err.message : "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-foreground/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: pitch + details */}
          <div className="lg:col-span-5">
            <div className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-accent">
              [ 06 ] — Get in touch
            </div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Let's frame your story.
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Tell us about your day, your venue, your vibe. We reply to every
              enquiry within 24 hours — usually faster.
            </p>

            <div className="mt-10 space-y-1">
              {[
                {
                  icon: Phone,
                  label: "Call / WhatsApp",
                  value: "+91 63532 27978",
                  href: "tel:+916353227978",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "photowalamodellingstudio@gmail.com",
                  href: "mailto:photowalamodellingstudio@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Studio",
                  value: "Bayad, Sabarkantha, Gujarat 383 340",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  value: "@photowala_bayad",
                  href: "https://www.instagram.com/photowala_bayad/?hl=en",
                },
                {
                  icon: Clock,
                  label: "Hours",
                  value: "Mon–Sat · 9:00 AM – 8:00 PM",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-4 border-b border-foreground/10 py-3.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/15 text-accent">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                      {row.label}
                    </div>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="truncate text-sm font-medium transition-colors hover:text-accent"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <div className="truncate text-sm font-medium">
                        {row.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl border border-foreground/12 bg-card p-6 sm:p-8"
            >
              {done ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-semibold">
                    Message received.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Thank you for reaching out. We'll reply within 24 hours with
                    availability and package details.
                  </p>
                  <button
                    onClick={() => setDone(false)}
                    className="mt-6 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Your name" required>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Riya Patel"
                        required
                        className="h-11"
                      />
                    </Field>
                    <Field label="Email" required>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@email.com"
                        required
                        className="h-11"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Phone (optional)">
                      <Input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 63532 27978"
                        className="h-11"
                      />
                    </Field>
                    <Field label="What do you need?">
                      <Select
                        value={form.service}
                        onValueChange={(v) => update("service", v)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pick a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Tell us about your day" required>
                    <Textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Date, venue, the kind of coverage you're after…"
                      required
                      rows={5}
                      className="resize-none"
                    />
                  </Field>

                  <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                    <p className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                      We reply within 24 hours
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send enquiry
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </Label>
      {children}
    </div>
  );
}
