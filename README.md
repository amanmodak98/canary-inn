# Canary Inn Hazaribagh — Hotel Website + QR Ordering System

A production-grade Next.js application for **Canary Inn, Hazaribagh, Jharkhand** — premium public website plus a serverless-compatible QR-menu ordering system and a staff/admin dashboard.

> Verified hotel facts only. Imagery is curated hospitality stock photography.

---

## Frontend-only deploy (Vercel, no backend)

The public marketing site is **fully static** and can be deployed to Vercel without any environment variables. All public pages render from local data files.

### Works without backend
- `/` Home
- `/rooms`, `/rooms/[slug]`
- `/dining`
- `/menu`, `/menu/[category]` — browseable static menu showcase (no cart)
- `/experience`
- `/events` — banquet hall, conference room, boardroom
- `/offers` — seasonal packages
- `/gallery`
- `/reviews` — guest testimonials with source filter
- `/contact` — contact form falls back to `mailto:` if API isn't wired

### Requires backend (degrades gracefully)
- `/menu?tableToken=…` — live QR ordering (needs `/api/public/menu`, `/api/public/tables/[token]`)
- `/order/[id]` — live order tracking (polled)
- `/admin/*` — staff dashboard (needs `AUTH_SECRET`, `DATABASE_URL`)

### Required environment variables (only when backend is wired)

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | QR ordering, admin, contact persistence | Neon pooled URL with `?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | Migrations | Direct connection |
| `AUTH_SECRET` | Admin JWT | 32+ char random |
| `CRON_SECRET` | `/api/cron/cleanup-orders` | 32+ char random |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs, sitemap | `https://canary-inn.vercel.app` |

If `DATABASE_URL` is unset, every public page still renders cleanly. The contact form falls back to opening the user's mail client. The menu page renders a beautiful static showcase instead of the live ordering shell.

---

## Stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
- **Prisma + Neon Postgres** (serverless-compatible)
- **bcryptjs + jose (JWT)** admin auth (stateless httpOnly cookies)
- **nanoid** for secure table tokens
- **framer-motion + lenis** for tasteful motion on public pages
- Polling every 4–5 s for real-time order updates (no WebSocket infra)

The application is fully stateless and deployable on **Vercel**, **Netlify** or any serverless platform.

---

## Setup

### 1. Provision a Neon Postgres database

Use the Neon MCP tools — `create_project`, then capture the pooled `DATABASE_URL`.

### 2. Configure environment

Copy `.env.example` → `.env.local`:

```bash
DATABASE_URL="postgresql://...pooler...neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://...neon.tech/neondb?sslmode=require"
AUTH_SECRET="<32+ char random>"
CRON_SECRET="<32+ char random>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Install + migrate + seed

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run

```bash
npm run dev
# open http://localhost:3000
```

Seeded admin: **`admin@canaryinn.com`** / **`CanaryInn#2026`** (override via `SEED_ADMIN_PASSWORD`).

For local QR testing: visit `/admin/tables` to grab any table's token URL.

---

## Architecture

```
app/
├── (public pages)        # home, rooms, dining, menu, experience, gallery, contact
├── order/[id]            # guest order status (polled)
├── admin/                # login, dashboard, orders, kitchen, menu, tables, rooms
└── api/
    ├── public/           # menu, tables/[token], orders, orders/[id]
    ├── admin/            # login, logout, orders, menu, tables, rooms
    ├── cron/cleanup-orders  # 7-day retention sweep
    └── qr/[token]        # PNG QR generation
```

### Security model

- **Tables are identified by an unguessable 22-char nanoid token**, not by their visible label. The token is validated server-side on every order and sets a session cookie. Guests cannot impersonate another table by editing `?table=`.
- **All order totals are recomputed server-side** from current DB prices. Client-submitted totals are ignored.
- **Admin mutations require a verified JWT cookie**, with a small in-memory rate limiter on login.
- **Cron cleanup is bearer-protected** via `CRON_SECRET`.
- **IP addresses are salted-hashed** (`lib/ipHash.ts`) for soft abuse detection and never stored in clear text.

### 7-day retention

`lib/retention.ts` deletes any `Order` (and cascading `OrderItem`) plus `ContactMessage` rows older than 7 days using the database timestamp. Configurable via `DEFAULT_RETENTION_DAYS`. Vercel Cron invokes `/api/cron/cleanup-orders` daily at 03:00 UTC (see `vercel.json`). For non-Vercel deploys, hit the same endpoint with a Bearer token (cron-job.org, GitHub Actions, etc.).

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import in Vercel.
3. Add the four env vars above.
4. Vercel Cron reads `vercel.json` automatically.
5. `npm run build` should pass.

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

## Out of scope

- Live payment gateway (orders are pay-at-table)
- SMS / email notifications (hotel receives orders in dashboard)
- Live room-booking engine (links to MakeMyTrip / Goibibo / Agoda / OYO)
- Multi-language (English only)
- Multi-tenant support