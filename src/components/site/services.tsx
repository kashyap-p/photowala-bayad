"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/portfolio";

export function Services() {
  const scrollToContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="services"
      className="relative scroll-mt-20 border-t border-foreground/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-accent">
              [ 03 ] — What we shoot
            </div>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A craft for every kind of moment.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            Four core services, one obsession with light. Packages tailored to
            your day, your story, your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative bg-background p-6 transition-colors hover:bg-foreground/[0.02] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono-label text-xs text-muted-foreground">
                  {s.num}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {s.desc}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <button
                onClick={scrollToContact}
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Enquire about {s.title.toLowerCase()}
                <span className="h-px w-6 bg-current transition-all group-hover:w-10" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
