# DELIVERABLE — API Architecture

## Base: Next.js Route Handlers (MVP)

All endpoints under `/api/*`, validated with Zod, rate-limited, RBAC where needed.

### Public (no auth)

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | /api/search?q=&category=&filters= | Autocomplete + results | Proxies Meilisearch; fallback to Postgres ILIKE |
| GET | /api/products?category=&sort=&page=&filters= | Listing | Used by client-side filter updates |
| GET | /api/products/[slug] | Single product | ISR pages prefer direct DB, API for client fetch |
| GET | /api/categories | All categories with counts | Cached 300s |
| GET | /api/comparisons/[slugs] | Comparison data | Validates slugs, returns products + matrix |
| POST | /api/leads | Submit lead | Zod; creates Lead, sends email, rate-limited |

### Authenticated (buyer)

| Method | Path | Purpose |
|---|---|---|
| POST | /api/reviews | Submit review (one per product per user) |
| PATCH | /api/reviews/[id]/helpful | Toggle helpful vote |
| GET/POST | /api/saved/products | List / save |
| GET/POST | /api/saved/comparisons | List / save |
| GET | /api/me/leads | Own leads |
| GET | /api/me/reviews | Own reviews |

### Vendor

| Method | Path | Purpose |
|---|---|---|
| POST | /api/vendor/claim | Claim company/product |
| PATCH | /api/vendor/products/[id] | Edit (→ PENDING) |
| GET | /api/vendor/leads | Vendor's leads |
| PATCH | /api/vendor/leads/[id] | Update status/notes |
| POST | /api/vendor/reviews/[id]/response | Respond to review |

### Admin

| Method | Path | Purpose |
|---|---|---|
| GET/POST | /api/admin/products | CRUD |
| POST | /api/admin/products/[id]/moderate | approve/reject |
| GET/POST | /api/admin/categories | CRUD |
| GET/POST | /api/admin/reviews | moderation queue |
| POST | /api/admin/reviews/[id]/moderate | approve/reject/verify |
| GET | /api/admin/leads | all leads |
| GET | /api/admin/users | user list |

### System

| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | DB + search + redis check |
| POST | /api/webhooks/search-sync | Meilisearch sync (internal) |
| GET | /api/sitemap | dynamic sitemap shard |

## Auth

- NextAuth v5 (Auth.js) — `auth.ts` config, Prisma adapter, providers: credentials, google, linkedin.
- Session strategy: database (for vendor claim + moderation audit).
- Middleware: protects /vendor, /admin, /api/vendor, /api/admin.

## Validation Example (Zod)

```ts
const LeadSchema = z.object({
  type: z.enum(['GET_PRICING','REQUEST_DEMO','EXPERT_RECOMMENDATION']),
  productId: z.string().cuid().optional(),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  company: z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  categorySlug: z.string().optional(),
});
```

## Rate Limiting

- Upstash Redis `ratelimit` — 60/min IP on /api/*, 5/day user on reviews, 10/hour IP on leads.
- Return 429 with Retry-After.

## Error Shape

```json
{ "error": "VALIDATION_ERROR", "details": { "email": "Invalid email" } }
{ "error": "RATE_LIMITED", "retryAfter": 42 }
{ "error": "NOT_FOUND" }
```

## Webhooks / Jobs

- `pg-boss` or Vercel Cron: nightly rating recompute, sitemap regen, search full-sync, email digests (Phase 2).
