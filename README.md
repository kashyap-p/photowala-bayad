# PHOTOWALA BAYAD

Photography studio website for **PHOTOWALA BAYAD** — a wedding, portrait, event
and street photography studio based in Bayad, Gujarat.

The site is a single-page experience: an interactive camera-aperture hero,
a filterable portfolio gallery, services, an about section, client
testimonials, and a contact form whose enquiries are persisted to a local
SQLite database.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York) component primitives
- **Framer Motion** for animation
- **Prisma** + **SQLite** for contact-message persistence
- **Bebas Neue** display typeface for the wordmark

## Getting started

```bash
# install dependencies
bun install

# create the local database
bun run db:push

# start the dev server on http://localhost:3000
bun run dev
```

Create a `.env` file in the project root:

```
DATABASE_URL="file:/<absolute-path-to-project>/db/custom.db"
```

## Scripts

| Script             | Description                                  |
| ------------------ | -------------------------------------------- |
| `bun run dev`      | Start the dev server (port 3000)             |
| `bun run build`    | Production build (standalone output)         |
| `bun run start`    | Run the production standalone server         |
| `bun run lint`     | ESLint                                       |
| `bun run db:push`  | Push the Prisma schema to the database       |
| `bun run db:generate` | Regenerate the Prisma client              |

## Project structure

```
prisma/
  schema.prisma          # ContactMessage + PortfolioItem models
public/
  gallery/               # portfolio photographs
src/
  app/
    api/contact/route.ts # contact form endpoint (POST + GET)
    globals.css          # design tokens + base styles
    layout.tsx           # root layout, fonts, metadata
    page.tsx             # page composition
  components/
    site/                # page sections (hero, portfolio, contact, …)
    ui/                  # shadcn/ui primitives in use
  lib/
    db.ts                # Prisma client
    portfolio.ts         # portfolio + services + testimonials data
    utils.ts             # cn() helper
  hooks/
    use-toast.ts         # toast hook
```

## Deployment (Vercel + Turso)

The site runs on Vercel with a hosted libSQL database from Turso (free tier).
The same code works locally with file-based SQLite and remotely with Turso —
the `DATABASE_URL` scheme decides which driver is used.

### 1 — Create a Turso database

```bash
# install the Turso CLI (one time)
curl -sSfL https://get.tur.so/install.sh | bash

# log in (opens a browser)
turso auth login

# create the database
turso db create photowala-bayad

# grab the connection URL and an auth token
turso db url photowala-bayad            # → libsql://photowala-bayad-xxxxx.turso.io
turso db tokens create photowala-bayad  # → eyJhbGciOi...

# push the schema to the remote database
DATABASE_URL="libsql://photowala-bayad-xxxxx.turso.io" \
DATABASE_AUTH_TOKEN="eyJhbGciOi..." \
bun run db:push
```

### 2 — Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kashyap-p/photowala-bayad)

1. Click the button above, or go to **[vercel.com/new](https://vercel.com/new)**
   and import the `kashyap-p/photowala-bayad` repository.
2. Vercel auto-detects Next.js — no build settings needed.
3. Under **Environment Variables**, add:
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `libsql://photowala-bayad-xxxxx.turso.io` |
   | `DATABASE_AUTH_TOKEN` | `eyJhbGciOi...` |
4. Click **Deploy**. The site goes live at
   `photowala-bayad.vercel.app` (add a custom domain from
   Vercel → Settings → Domains when ready).

Every `git push` to `main` from now on triggers an automatic redeploy.

## License

All photographs and source code © PHOTOWALA BAYAD. All rights reserved.
