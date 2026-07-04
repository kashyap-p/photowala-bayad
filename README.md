<div align="center">

# 📸 PHOTOWALA BAYAD

### Photography Studio · Bayad, Gujarat

A cinematic, interactive photography studio website with a private client gallery system, AI assistant, and admin dashboard.

[![Live Site](https://img.shields.io/badge/Live-photowala--bayad.vercel.app-accent?style=for-the-badge)](https://photowala-bayad.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ Overview

**PHOTOWALA BAYAD** is a full-stack photography studio website built for a real photography business based in Bayad, Gujarat. It combines a stunning public-facing portfolio with a secure admin dashboard for managing private client galleries and enquiries.

The site features a cinematic first-load intro animation, an interactive camera aperture component, a masonry portfolio grid with lightbox, a smart AI chatbot that knows the studio inside-out, and a complete admin system for sharing private photo galleries with clients via secure links.

### 🎬 Live Demo

Visit **[photowala-bayad.vercel.app](https://photowala-bayad.vercel.app)** to see it in action.

---

## 🌟 Features

### Public Website

| Feature | Description |
|---------|-------------|
| 🎬 **Cinematic Loader** | Full-screen intro animation with letter-by-letter wordmark reveal and spinning aperture on first visit |
| 📸 **Interactive Aperture** | Hero section camera aperture with 8-blade iris that opens/closes to cursor proximity, live f-stop readout, and shutter flash on click |
| 🖼️ **Portfolio Gallery** | Masonry grid of real photographs with category filtering (Weddings / Pre-Wedding), staggered animations, hover effects, and keyboard-navigable lightbox |
| 🤖 **AI Chatbot** | Floating assistant that answers questions about services, pricing, booking, contact, and can look up a client's private gallery link by name or email |
| 📊 **Stats & Marquee** | Animated stat counters and infinite marquee of photography keywords |
| 🛎️ **Services** | Four service cards: Wedding Photography, Portrait Sessions, Events & Celebrations, Pre-Wedding Shoots |
| 👤 **About** | Photographer bio with the studio's story, craft pillars, and signature |
| 💬 **Testimonials** | Auto-rotating client testimonial carousel with direction-aware slide transitions |
| 📧 **Contact Form** | Enquiries persist to the database and appear in the admin dashboard |
| 🦶 **Sticky Footer** | Brand, navigation, contact details, and back-to-top |

### Admin Dashboard

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure credential-based login with scrypt password hashing (no external auth service needed) |
| 🖼️ **Gallery Management** | Create, edit, and delete private client galleries with custom slugs |
| 📤 **Photo Upload** | Three ways to add photos: **upload from device** (up to 15MB, auto-compressed client-side), **paste a URL**, or **pick from existing portfolio** |
| 🔗 **Shareable Links** | Each gallery gets a unique shareable URL with optional password protection and expiry date |
| 📥 **Client Messages** | View all contact form enquiries with read/unread status, quick-reply via email/WhatsApp, and delete |
| 📊 **Dashboard Tabs** | Switch between Galleries and Messages with a live unread badge |

### Client Gallery View

| Feature | Description |
|---------|-------------|
| 🔒 **Password Gate** | Optional password protection per gallery |
| ⏰ **Expiry** | Galleries can auto-expire after a set date |
| 🖼️ **Masonry Layout** | Photos displayed in a responsive masonry grid |
| 🔍 **Lightbox** | Full-screen viewer with keyboard navigation (arrows + escape) |
| ⬇️ **Download** | Clients can download their photos directly from the lightbox |
| 📝 **Personal Note** | Custom message from the photographer shown at the top |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (New York) |
| **Animation** | [Framer Motion](https://framer-motion.com) |
| **Database** | [Prisma 6](https://prisma.io) + [Turso](https://turso.tech) (libSQL/SQLite) |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org) (credentials provider) |
| **Fonts** | Geist Sans, Geist Mono, Bebas Neue (display wordmark) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Hosting** | [Vercel](https://vercel.com) |
| **Package Manager** | [Bun](https://bun.sh) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org) or [Bun](https://bun.sh)
- A [Turso](https://turso.tech) account (free tier) for the database

### Installation

```bash
# Clone the repo
git clone https://github.com/kashyap-p/photowala-bayad.git
cd photowala-bayad

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL
```

### Environment Variables

```bash
# Local development (file-based SQLite)
DATABASE_URL="file:./db/custom.db"

# Production (Turso / libSQL)
DATABASE_URL="libsql://photowala-bayad-xxxxx.turso.io"
DATABASE_AUTH_TOKEN="eyJhbGciOi..."
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="https://your-domain.com"
```

### Database Setup

```bash
# Push the schema to your database
bun run db:push

# Generate the Prisma client
bun run db:generate
```

### Create Admin User

After first deploy, create the admin user by running this SQL against your Turso database (via the Turso CLI or dashboard):

```bash
# Using Turso CLI
turso db shell photowala-bayad
```

```sql
INSERT INTO "AdminUser" ("id", "email", "passwordHash", "name")
VALUES (
  'admin-001',
  'you@photowalabayad.com',
  'scrypt:<salt>:<hash>',
  'Photowala Bayad'
);
```

> The password hash uses scrypt. Generate one with Node:
> ```js
> const { scryptSync, randomBytes } = require('crypto');
> const salt = randomBytes(16).toString('hex');
> const hash = scryptSync('your-password', salt, 64).toString('hex');
> console.log(`scrypt:${salt}:${hash}`);
> ```

### Run the Dev Server

```bash
bun run dev
```

Visit **http://localhost:3000**

---

## 📂 Project Structure

```
photowala-bayad/
├── prisma/
│   └── schema.prisma              # Database models (ContactMessage, AdminUser, Gallery, GalleryPhoto)
├── public/
│   ├── logo.png                   # Studio logo (aperture mark)
│   ├── robots.txt
│   └── gallery/                   # Portfolio photographs
│       ├── photo-01.jpg … photo-12.jpg
│       └── maker.jpg              # Photographer portrait
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout + fonts + metadata + cinematic loader
│   │   ├── page.tsx               # Homepage composition
│   │   ├── globals.css            # Design tokens, theme, animations
│   │   ├── admin/
│   │   │   ├── page.tsx           # Protected dashboard (server component)
│   │   │   ├── login/page.tsx     # Admin login
│   │   │   └── dashboard.tsx      # Dashboard client (galleries + messages tabs)
│   │   ├── g/[slug]/
│   │   │   ├── page.tsx           # Public shared gallery (server component)
│   │   │   └── gallery-view.tsx   # Gallery client (password gate, lightbox, download)
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │       ├── chat/route.ts                 # AI chatbot (rule-based + gallery lookup)
│   │       ├── contact/route.ts              # Contact form (POST + GET)
│   │       ├── galleries/                    # Gallery CRUD (admin-protected)
│   │       │   ├── route.ts                  #   GET list, POST create
│   │       │   └── [id]/
│   │       │       ├── route.ts              #   GET, PATCH, DELETE
│   │       │       ├── photos/route.ts       #   POST add, DELETE remove
│   │       │       └── access/route.ts       #   POST password verify (public)
│   │       └── messages/[id]/route.ts        # Message PATCH (read), DELETE
│   ├── components/
│   │   ├── site/                  # Page-specific components
│   │   │   ├── aperture.tsx       # Interactive 8-blade camera aperture
│   │   │   ├── cinematic-loader.tsx # First-load intro animation
│   │   │   ├── navbar.tsx         # Sticky nav with logo + Studio link
│   │   │   ├── hero.tsx           # Hero section with letter-reveal title
│   │   │   ├── stats.tsx          # Stats band + marquee
│   │   │   ├── portfolio.tsx      # Masonry grid + lightbox
│   │   │   ├── services.tsx       # Service cards
│   │   │   ├── about.tsx          # About the photographer
│   │   │   ├── testimonials.tsx   # Auto-rotating carousel
│   │   │   ├── contact.tsx        # Contact form
│   │   │   ├── chatbot.tsx        # Floating AI assistant
│   │   │   ├── footer.tsx         # Sticky footer
│   │   │   └── smart-image.tsx    # <img> with broken-image placeholder
│   │   └── ui/                    # shadcn/ui primitives (7 components)
│   ├── lib/
│   │   ├── auth.ts                # NextAuth config (credentials + cookies)
│   │   ├── db.ts                  # Prisma client (lazy, libSQL adapter)
│   │   ├── password.ts            # scrypt hash/verify (Node crypto)
│   │   ├── session.ts             # requireAdmin() helper
│   │   ├── portfolio.ts           # Portfolio data + services + testimonials
│   │   └── utils.ts               # cn() class merge
│   └── hooks/
│       └── use-toast.ts           # Toast hook
├── .env.example                   # Environment variable template
├── next.config.ts
├── prisma.config.ts
├── eslint.config.mjs
├── tsconfig.json
├── components.json                # shadcn/ui config
└── package.json
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | Near-black `oklch(0.115 0 0)` | Page background |
| `foreground` | Near-white `oklch(0.985 0 0)` | Primary text |
| `accent` | Warm amber `oklch(0.78 0.14 70)` | Highlights, active states, wordmark |
| `muted-foreground` | Mid-gray `oklch(0.65 0 0)` | Secondary text |
| `card` | Elevated dark `oklch(0.17 0 0)` | Cards, inputs |

### Typography

| Font | Usage |
|------|-------|
| **Bebas Neue** | Display wordmark (PHOTOWALA BAYAD) |
| **Geist Sans** | Body text, UI |
| **Geist Mono** | Technical labels (ISO, f-stop, metadata) |

### Visual Language

- **Dark, editorial** aesthetic inspired by animejs.com
- **Monospace technical labels** with letter-spacing for metadata (f/1.4, ISO 100, etc.)
- **Amber accent** for warmth (photography/golden-hour association)
- **Letter-by-letter** reveal animations for the hero title
- **Grain texture** overlay on hero for film-like quality

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (port 3000) |
| `bun run build` | Production build (standalone output) |
| `bun run start` | Run production server |
| `bun run lint` | ESLint check |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:migrate` | Create a migration |
| `bun run db:reset` | Reset database |

---

## 🚢 Deployment

### Vercel + Turso

1. **Create a Turso database:**
   ```bash
   turso db create photowala-bayad
   turso db url photowala-bayad            # → libsql://…
   turso db tokens create photowala-bayad  # → eyJhbGciOi…
   ```

2. **Push the schema to Turso:**
   ```bash
   DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="eyJ…" bun run db:push
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the `kashyap-p/photowala-bayad` repo
   - Add environment variables:
     | Name | Value |
     |------|-------|
     | `DATABASE_URL` | `libsql://photowala-bayad-xxxxx.turso.io` |
     | `DATABASE_AUTH_TOKEN` | `eyJhbGciOi…` |
     | `NEXTAUTH_SECRET` | (random 32-char string) |
     | `NEXTAUTH_URL` | `https://photowala-bayad.vercel.app` |
   - Deploy!

4. **Create the admin user** (see [Getting Started](#create-admin-user) above)

Every `git push` to `main` triggers an automatic redeploy.

---

## 🔒 Security

- **Password hashing** uses Node's built-in `scrypt` (no external dependencies)
- **Sessions** managed via NextAuth JWT (7-day expiry, `__Secure-` cookies on HTTPS)
- **Admin routes** are server-side protected — unauthenticated requests return 401
- **Gallery passwords** are verified server-side before revealing photos
- **No credentials** are stored in the repo — all secrets via environment variables
- **`.env` is gitignored** — only `.env.example` is committed

---

## 📊 Database Schema

```prisma
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  service   String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
}

model Gallery {
  id          String         @id @default(cuid())
  slug        String         @unique
  title       String
  clientName  String
  clientEmail String
  note        String?
  password    String?
  expiresAt   DateTime?
  archived    Boolean        @default(false)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  photos      GalleryPhoto[]
}

model GalleryPhoto {
  id        String   @id @default(cuid())
  galleryId String
  gallery   Gallery  @relation(fields: [galleryId], references: [id], onDelete: Cascade)
  url       String
  caption   String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}
```

---

## 🤖 AI Chatbot

The floating chatbot (bottom-right) uses a smart intent-matching system — no external AI API required, so it works reliably on Vercel with zero latency and zero cost.

**Intents handled:**
- Services (weddings, portraits, events, pre-wedding)
- Pricing (directs to contact form)
- Booking (how to book, availability)
- Contact details (phone, email, Instagram, address, hours)
- About the studio (history, approach, stats)
- Gallery lookup (searches database by client name/email, returns shareable link)
- Greetings, thanks, and graceful fallback

---

## 📈 Performance

- **Client-side image compression** — photos up to 15MB are resized to max 2000px and compressed to 85% quality in the browser before upload, keeping serverless payloads small
- **Lazy Prisma client** — database connection created on first use, not at module load
- **SmartImage component** — graceful broken-image placeholder instead of browser default
- **SessionStorage intro** — cinematic loader plays once per session, not every navigation
- **Static portfolio** — portfolio data is hardcoded (no DB query needed for the public site)

---

## 📝 License

All photographs and source code © **PHOTOWALA BAYAD**. All rights reserved.

---

<div align="center">

**[🌐 Live Site](https://photowala-bayad.vercel.app)** · **[📸 Instagram](https://www.instagram.com/photowala_bayad/)** · **[📧 Contact](mailto:photowalamodellingstudio@gmail.com)**

Built with light, story, and soul in Bayad, Gujarat. 🇮🇳

</div>
