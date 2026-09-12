# Software Discovery Platform — Competitive Analysis (Complete Package)

**Date:** 2026-09-01
**Platforms:** Software Finder · G2 · SelectHub · SoftwareSuggest · Software Advice · GoodFirms
**Research:** Public observable pages only (no auth bypass, no private APIs)

## How to Use This Package

This directory (`/opt/data/analysis/`) is the complete research output. Copy it to your repo before closing the session.

### Deliverables Map (your 10 requested)

| # | File | What it is |
|---|---|---|
| D1 | `reports/00-EXECUTIVE-SUMMARY.md` | 1-page executive summary |
| D1 | `reports/01-FULL-REPORT.md` | Full 20-section report — 6 competitor deep dives + sitemaps, review/comparison/search/lead/SEO analyses |
| D2 | `matrix/FEATURE-MATRIX.md` | Feature comparison matrix (9 tables, 60+ features × 6 platforms) |
| D3 | `reports/03-FUNCTIONAL-REQUIREMENTS.md` | Functional + non-functional requirements (REQ-* IDs) |
| D4 | `blueprint/PLATFORM-BLUEPRINT.md` | Original platform architecture (services, data flow, comparison, lead routing, RBAC) |
| D5 | `schemas/DATABASE-SCHEMA.md` | Prisma schema (20 models) + ERD + aggregation + comparison logic + seed strategy |
| D6 | `reports/06-TECH-STACK.md` | Frontend/backend/DB/search/infra/testing stack with trade-offs |
| D7 | `reports/07-ROADMAP.md` | MVP (10 weeks) + Phase 2 + Phase 3 roadmaps |
| D8 | `reports/08-UIUX-ARCHITECTURE.md` | Design principles, layout, component library, patterns, flows |
| D9 | `reports/09-SEO-ARCHITECTURE.md` | Original URL system, templates, internal linking, programmatic generation, scale math |
| D9b | `reports/14-API-ARCHITECTURE.md` | API routes, auth, validation, rate limiting, error shape |
| PRD | `reports/02-PRD.md` | Master PRD (23 sections: vision → scalability) |
| Deep | `reports/04-DEEP-DIVES.md` | Buyer journey (8 personas + map), lead gen (8 mechanisms), comparison engine, review system, search/filters, SEO deep dives |
| **D10** | `prompts/MASTER-BUILD-PROMPT.md` | **Copy-paste-ready prompt for an AI coding agent — BUILD→RUN→TEST→FIX loop until green (311 lines, 10 steps)** |

### Quick Start for Next Step

1. **Read:** `reports/00-EXECUTIVE-SUMMARY.md` (2 min) → `reports/01-FULL-REPORT.md` (20 min)
2. **Decide scope:** `reports/02-PRD.md` Section 7 (MVP) or `reports/07-ROADMAP.md`
3. **Build:** Copy-paste `prompts/MASTER-BUILD-PROMPT.md` into Claude Code / Codex / Cursor — it will scaffold, seed, and test until the app works
4. **Reference while building:** Keep `schemas/DATABASE-SCHEMA.md` and `reports/08-UIUX-ARCHITECTURE.md` open

### Capstone Enterprise Documentation (NEW — 2026-09-02)

| File | What it is | Lines |
|---|---|---|
| **`reports/ENTERPRISE-BUILD-DOCUMENTATION.md`** | **CAPSTONE — Definitive Enterprise Build Documentation (10 sections: market 8+ platforms, vision/personas, MoSCoW 52 features, architecture Next.js 15/Prisma/Meilisearch, schema reference, 4 engines, monetization, SEO scale 2k→12k URLs, FTC 16 CFR 465/GDPR/DSA compliance, roadmap + risks)** — **this document wins if it conflicts with older reports** | **857** |
| `MASTER-BUILDER-FILE.md` | Offline/air-gapped concatenation of the full package | 2278 |
| `SOFTWARE-DISCOVERY-COMPETITIVE-ANALYSIS-COMPLETE.md` | Single-file concatenation variant | 3237 |

> **Start here for builds:** Read `reports/ENTERPRISE-BUILD-DOCUMENTATION.md` (authoritative) → copy-paste `prompts/MASTER-BUILD-PROMPT.md` into your coding agent → keep `schemas/DATABASE-SCHEMA.md` open.

### Absolute Paths (this session)

```
/opt/data/analysis/reports/ENTERPRISE-BUILD-DOCUMENTATION.md  ← ★ CAPSTONE (read this first)
/opt/data/analysis/reports/00-EXECUTIVE-SUMMARY.md
/opt/data/analysis/reports/01-FULL-REPORT.md
/opt/data/analysis/reports/02-PRD.md
/opt/data/analysis/reports/03-FUNCTIONAL-REQUIREMENTS.md
/opt/data/analysis/reports/04-DEEP-DIVES.md
/opt/data/analysis/reports/06-TECH-STACK.md
/opt/data/analysis/reports/07-ROADMAP.md
/opt/data/analysis/reports/08-UIUX-ARCHITECTURE.md
/opt/data/analysis/reports/09-SEO-ARCHITECTURE.md
/opt/data/analysis/reports/14-API-ARCHITECTURE.md
/opt/data/analysis/matrix/FEATURE-MATRIX.md
/opt/data/analysis/schemas/DATABASE-SCHEMA.md
/opt/data/analysis/blueprint/PLATFORM-BLUEPRINT.md
/opt/data/analysis/prompts/MASTER-BUILD-PROMPT.md
```

### Research Rules Compliance

- No proprietary code copied
- No paywall/CAPTCHA/rate-limit bypass
- No copyrighted text/branding/logos reproduced
- No private APIs or databases accessed
- Every claim labeled [OBSERVED FACT] / [INFERENCE] / [RECOMMENDATION]
- "Not publicly observable" used where data was unavailable
