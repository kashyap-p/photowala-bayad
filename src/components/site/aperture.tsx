"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type MotionValue,
} from "framer-motion";

interface ApertureProps {
  className?: string;
}

const CX = 100;
const CY = 100;
const OUTER_R = 84;
const N_BLADES = 8;
const R_MIN = 5; // hole radius when fully closed
const R_MAX = 58; // hole radius when fully open
const HALF_W = 24; // half blade angular width (deg) — slight overlap
const OFFSET_MAX = 16; // max blade rotation (deg) when open

function bladePath(baseAngleDeg: number, offsetDeg: number, innerR: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a1 = toRad(baseAngleDeg + offsetDeg - HALF_W);
  const a2 = toRad(baseAngleDeg + offsetDeg + HALF_W);
  const x1i = CX + innerR * Math.cos(a1);
  const y1i = CY + innerR * Math.sin(a1);
  const x2i = CX + innerR * Math.cos(a2);
  const y2i = CY + innerR * Math.sin(a2);
  const x1o = CX + OUTER_R * Math.cos(a1);
  const y1o = CY + OUTER_R * Math.sin(a1);
  const x2o = CX + OUTER_R * Math.cos(a2);
  const y2o = CY + OUTER_R * Math.sin(a2);
  return [
    `M ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    `L ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 0 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
    `L ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
    `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/**
 * Interactive camera aperture inspired by animejs.com's animated demos.
 * A real 8-blade iris whose central polygonal hole opens/closes with cursor
 * proximity, breathes on idle, rotates its tick-mark ring, and fires a shutter
 * flash on click. The f-stop readout updates live with the opening.
 */
export function Aperture({ className }: ApertureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(false);

  // proximity: 0 (far) -> 1 (cursor over center)
  const proximity = useMotionValue(0.2);
  // idle breathing so the iris is always alive even without a cursor
  const breath = useMotionValue(0.32);

  // combined "open amount": cursor proximity wins, otherwise breathe
  const openRaw = useTransform(
    [breath, proximity],
    ([b, p]: number[]) => Math.max(b, p) as number
  );
  const open = useSpring(openRaw, { stiffness: 110, damping: 16, mass: 0.6 });

  // live f-stop: f/16 closed -> f/1.4 open
  const fstop = useTransform(open, (oa) => {
    const f = 16 - 14.6 * oa;
    return `f/${f.toFixed(1)}`;
  });

  useEffect(() => {
    // idle breathing animation
    const controls = animate(breath, [0.3, 0.55, 0.3], {
      duration: 4.2,
      ease: "easeInOut",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [breath]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const compute = (clientX: number, clientY: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.hypot(dx, dy);
        const max = Math.max(rect.width, rect.height) * 0.85;
        const p = Math.max(0, 1 - dist / max);
        proximity.set(0.15 + p * 0.85);
      });
    };
    const onMouse = (e: MouseEvent) => compute(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) compute(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => proximity.set(0.18);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [proximity]);

  const fireShutter = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  const blades = Array.from({ length: N_BLADES });

  return (
    <div
      ref={containerRef}
      onClick={fireShutter}
      className={`relative aspect-square w-full cursor-pointer select-none ${className ?? ""}`}
      role="img"
      aria-label="Interactive camera aperture — move your cursor over it and click to fire the shutter"
    >
      {/* outer rotating ring with tick marks */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, ease: "linear", repeat: Infinity }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle
            cx={CX}
            cy={CY}
            r="96"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.25"
          />
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * Math.PI * 2;
            const inner = i % 5 === 0 ? 85 : 90;
            const x1 = (CX + Math.cos(angle) * inner).toFixed(3);
            const y1 = (CY + Math.sin(angle) * inner).toFixed(3);
            const x2 = (CX + Math.cos(angle) * 94).toFixed(3);
            const y2 = (CY + Math.sin(angle) * 94).toFixed(3);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={i % 5 === 0 ? 1 : 0.5}
                strokeOpacity={i % 5 === 0 ? 0.55 : 0.25}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* lens body */}
      <div className="absolute inset-[8%] rounded-full border border-foreground/20 bg-gradient-to-b from-foreground/[0.10] to-foreground/[0.02] shadow-[inset_0_2px_24px_rgba(0,0,0,0.55)]" />

      {/* aperture assembly */}
      <div className="absolute inset-[12%]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <clipPath id="aperture-clip">
              <circle cx={CX} cy={CY} r={OUTER_R} />
            </clipPath>
            <radialGradient id="lens-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="oklch(0.25 0.06 70)" stopOpacity="0.5" />
            </radialGradient>
            <linearGradient id="blade-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.34 0 0)" />
              <stop offset="50%" stopColor="oklch(0.24 0 0)" />
              <stop offset="100%" stopColor="oklch(0.16 0 0)" />
            </linearGradient>
          </defs>

          <g clipPath="url(#aperture-clip)">
            {/* bright aperture glow behind blades (revealed through the hole) */}
            <circle cx={CX} cy={CY} r={OUTER_R} fill="url(#lens-glow)" />
            {/* deep backing for depth when nearly closed */}
            <circle cx={CX} cy={CY} r={OUTER_R} fill="oklch(0.04 0 0)" opacity="0.45" />

            {/* blades */}
            {blades.map((_, i) => (
              <Blade key={i} baseAngle={(360 / N_BLADES) * i} open={open} />
            ))}

            {/* faint center glint */}
            <circle cx={CX} cy={CY} r="2.5" fill="oklch(0.98 0 0)" opacity="0.7" />
          </g>

          {/* inner lens rim */}
          <circle
            cx={CX}
            cy={CY}
            r={OUTER_R}
            fill="none"
            stroke="oklch(0.5 0 0)"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* lens specular highlight */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.16),transparent_42%)]" />

      {/* shutter flash */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-full bg-white transition-opacity duration-100 ${
          flash ? "opacity-85" : "opacity-0"
        }`}
      />

      {/* f-stop label (live) */}
      <div className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-foreground/15 bg-background/80 px-3 py-1 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
        <motion.span className="text-accent">{fstop}</motion.span>
        <span className="text-foreground/30">·</span>
        <span>50mm</span>
      </div>
    </div>
  );
}

function Blade({
  baseAngle,
  open,
}: {
  baseAngle: number;
  open: MotionValue<number>;
}) {
  const d = useTransform([open], ([oa]: number[]) => {
    const innerR = R_MIN + oa * (R_MAX - R_MIN);
    const offsetDeg = oa * OFFSET_MAX;
    return bladePath(baseAngle, offsetDeg, innerR);
  });
  return (
    <motion.path
      d={d}
      fill="url(#blade-fill)"
      stroke="oklch(0.46 0 0)"
      strokeWidth="0.7"
      strokeLinejoin="round"
    />
  );
}
