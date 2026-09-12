# Canary Inn Hazaribagh — Hotel Website

A production-grade Next.js marketing site for **Canary Inn, Hazaribagh, Jharkhand** — a 3-star hotel, multi-cuisine restaurant and bar on NH-33.

> Verified hotel facts only. Imagery is curated hospitality stock photography.

---

## Stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
- **framer-motion + lenis** for editorial motion
- **Pure frontend** — zero backend dependencies, deploys cleanly to Vercel without any environment variables

---

## Setup

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it — no database, no auth setup, no env vars required.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Deploy. No environment variables needed.

All public pages render as static HTML (or SSG for room/menu details). The contact form opens the visitor's mail client via `mailto:`.

---

## Pages

```
/                      Home
/rooms                 All rooms
/rooms/[slug]          Room detail (Standard · Deluxe · Super Deluxe · Canary Suite)
/dining                Restaurant, bar & live music
/menu                  Full menu (Indian, Chinese, continental)
/menu/[category]       Deep-link to a menu category
/experience            Amenities & surroundings
/events                Banquet hall, conference room, boardroom
/offers                Seasonal packages
/gallery               Photo tour
/reviews               Guest testimonials
/contact               Contact form (mailto) + map
```

---

## Architecture

```
app/
├── (public pages)        # home, rooms, dining, menu, experience,
│                         # gallery, contact, events, offers, reviews
├── menu/[category]       # deep-link to a menu category
├── opengraph-image       # brand OG image (1200x630, generated at build)
├── robots.ts             # SEO
└── sitemap.ts            # generated sitemap

components/
└── site/                 # Header, Footer, Hero, RoomCard, etc.

data/
├── hotel.ts              # verified hotel facts
├── rooms.ts              # 4 room categories
├── images.ts             # image registry (local > Unsplash fallback)
├── amenities.ts          # 8 hotel amenities
├── gallery.ts            # gallery captions + image URLs
├── menu.ts               # full menu (~60 dishes)
├── testimonials.ts       # 8 curated guest reviews
├── events.ts             # 3 venues + event types + catering
├── offers.ts             # 4 seasonal packages
└── faq.ts                # 10 frequently asked questions

public/hotel/             # drop real photos here to swap from Unsplash
scripts/wire-local-images.js  # prebuild hook that wires local photos
```

---

## Swapping stock images for real hotel photos

Drop photos into `public/hotel/` with the filenames listed in `public/hotel/DROPPOINT.md`. The prebuild hook (`npm run images:wire`, runs automatically before `next build`) rewrites `data/images.ts` to point at your local files. Delete a file to revert that slot to its Unsplash fallback.

No code edits, no API keys, no Vercel config. Drop a file, push, deploy.

---

## Verified Canary Inn facts

Sourced from public web research (Sept 2026):

| Field | Value |
|---|---|
| Address | NH-33 Ranchi–Patna Road, Alfalah Colony, Hazaribagh, Jharkhand 825301 |
| Phone | +91 6546 272 769 |
| Email | canaryinn@gmail.com |
| Facebook | facebook.com/CanaryInnHazaribag |
| Check-in / Check-out | 12:00 PM |
| Restaurant hours | 7:00 AM – 11:00 PM |
| Bar hours | 11:00 AM – 11:00 PM |
| Type | 3-Star Hotel, Multi-cuisine Restaurant & Bar |

---

## Adding backend later (planned)

When you're ready to wire the QR ordering system and admin dashboard, you'll need:

- A database (Postgres recommended)
- An ORM or query layer (Prisma works well with this stack)
- The following features to re-add: `/menu?tableToken=…` ordering shell, `/admin/*` dashboard, contact-form persistence

The contact form is already wired to fall back to `mailto:`; swap `ContactForm.tsx`'s `window.location.href = buildMailto(...)` line for a `fetch("/api/contact", …)` when the backend is in place.