# DELIVERABLE 4 — Original Platform Architecture

## Platform Name (internal): Software Discovery Platform (SDP)

> Not a clone. A synthesis: G2's search + SoftwareSuggest's pricing depth + SelectHub's structured comparison + Software Advice's lead UX (async) + GoodFirms' verification rigor (lite).

```
SOFTWARE DISCOVERY PLATFORM
│
├── Public Website (Next.js App Router, SSR/ISR)
│   ├── Homepage (/ — search + categories + featured + trust bar)
│   ├── Search (/search — autocomplete + results)
│   ├── Categories (/categories → /{category})
│   ├── Product Pages (/{category}/{product} — 6 tabs)
│   ├── Reviews (/{category}/{product}#reviews + /write-review)
│   ├── Comparisons (/compare/{a}-vs-{b}[-vs-{c}] + /compare hub)
│   ├── Alternatives (/{category}/{product}/alternatives)
│   ├── Best (/best/{category}-software — alias)
│   ├── Resources (/resources/{slug} — MDX guides)
│   └── Static ( /about, /methodology, /privacy, /terms )
│
├── Buyer Features (authenticated)
│   ├── Saved products & comparisons
│   ├── Review submission & history
│   ├── Recommendation requests history
│   └── Account (profile, password, OAuth links)
│
├── Vendor Portal (/vendor — role: VENDOR)
│   ├── Overview (KPIs: views, comparison hits, leads)
│   ├── Product management (edit → moderation queue)
│   ├── Lead inbox (filter, status, notes, CSV export)
│   ├── Review responses
│   └── Billing (Phase 2)
│
└── Admin Platform (/admin — role: ADMIN/MODERATOR)
    ├── Dashboard (KPIs + queues)
    ├── Product & category management
    ├── Feature taxonomy
    ├── Review moderation
    ├── Vendor & claim management
    ├── Lead management
    ├── Resource (MDX) editor
    └── SEO manager (sitemap, redirects, programmatic status)
```

## Request Flow (MVP — single deploy)

```
Browser → Cloudflare (CDN/WAF) → Vercel (Next.js)
  ├─ SSR/ISR pages → Prisma → Postgres (Neon)
  ├─ API routes → Prisma + Zod → Postgres + Meilisearch + Redis
  ├─ Auth.js → Postgres (sessions) + OAuth providers
  └─ Cron → sitemap regen, rating aggregation sanity, search sync
```

## Data Flow: Product Update → Search + Page Revalidation

```
Vendor submits edit → status=PENDING → Admin approves → status=APPROVED
  → trigger: revalidatePath(`/{category}/{product}`)
  → trigger: revalidatePath(`/compare/*` containing product)
  → worker: meilisearch.update(product)
  → email: notify vendor "Approved"
```

## Comparison Generation (on-demand ISR)

No prebuild of O(n²) permutations. Comparison page is generated on first visit (or when first linked), then cached 300s. Internal links only emit comparisons for top-5 per top-20 categories (~200 at launch) to bound crawl.

## Lead Routing (MVP)

```
Buyer submits lead (Get Pricing / Demo / Expert) → Lead row (status=NEW)
  → email to vendor (if product-specific) + email to admin
  → vendor sees in /vendor/leads, can mark CONTACTED/QUALIFIED/CLOSED
  → admin queue for Expert leads → manual vendor match or auto (Phase 2)
```

## Auth & RBAC

- Auth.js with Postgres adapter. Providers: credentials (bcrypt), Google, LinkedIn.
- Roles: BUYER (default), VENDOR (after claim), MODERATOR, ADMIN.
- Middleware protects /vendor (requires VENDOR|ADMIN), /admin (requires ADMIN|MODERATOR), /api/admin/* similarly.
- Buyer routes (/saved, /write-review) require session else redirect to /login?callbackUrl=...

## Observability

- Sentry (errors), PostHog (product analytics), Vercel Analytics (web vitals), structured JSON logs.
- Health: /api/health → { db: ok, search: ok, redis: ok }

## Security

- Rate limit: 60 req/min IP on /api/* (Upstash Redis), 5 reviews/day/user, 10 leads/hour/IP.
- CSP, HSTS, CSRF (Next.js built-in), Zod validation on all inputs, HTML sanitization for review bodies, bcrypt cost 12, RBAC on every route.
- Uploads: image only (png/jpg/webp/svg), 2MB max, virus scan via UploadThing.

## Scaling Path

- MVP (0–10k products): single Vercel + Neon + Meilisearch Cloud — as designed.
- Scale (10k–100k): split API to standalone (NestJS), add read replicas, move Meilisearch → Typesense/ES, add CDN caching for ISR.
- Enterprise: add SSO, audit log export, dedicated vendor analytics pipeline (ClickHouse).
