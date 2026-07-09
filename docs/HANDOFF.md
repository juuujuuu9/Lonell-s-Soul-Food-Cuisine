# Handoff — Code Quality & Integrity Audit

## Context

The project is [Lonell's Soul Food](https://lonells.com), an Astro 5 website for a soul food restaurant in South LA.

## Key Documents

- **Guardrails Guide:** `docs/restaurant-website-guardrails-guide.md`
- **Implementation Plan:** `docs/conversion-optimization-plan.md`
- **SMS Loyalty Program:** `docs/sms-loyalty-program.md`
- **QR Print Collateral:** `docs/in-store-qr-print-collateral.md`

## Current State

### What Was Just Done (this session)

Fixed the 8 highest-priority issues from the previous audit (see table below). All changes committed and pushed.

## Issues Status

### 🔴 Critical

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| C1 | Merge conflict artifacts | **RESOLVED** | Accepted stashed changes in both loyalty components |
| C2 | `.env` tracked in git history | **RESOLVED** | `.env` was never actually tracked — `.gitignore` already covers it |
| C3 | Broadcast endpoint fetches ALL subscribers + leaks PII | **RESOLVED** | Keysafe pagination (500/batch), `Promise.allSettled` concurrency (10 at a time), removed `results` array from response, added `maxDuration: 300` |
| C4 | No authorization on admin sync-reviews POST | **RESOLVED** | Confirmed middleware already gates `/admin(.*)` via `isAdminRoute` matcher |

### 🟠 High Priority

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| H1 | Dual DB connection pools in admin-auth.ts | **RESOLVED** | Replaced local `drizzle(neon(...))` pool with shared `db` from `db/index.ts` |
| H2 | Serial SMS sending in cron loop | **RESOLVED** | `sendBatch` now groups by 10 with `Promise.allSettled`; win-back also converted to use `sendBatch` |
| H3 | Admin settings page leaks partial secret values | **RESOLVED** | Shows only "Set" / "Not Set" — no value whatsoever, not even truncated |
| H4 | No `maxDuration` on cron API routes | **RESOLVED** | Added `export const config = { maxDuration: 300 }` to all 8 cron routes |
| H5 | Opt-out cleanup permanently deletes records | **RESOLVED** | `cleanupOldOptOuts` now returns 0 with no-op — records already soft-deleted via `optOut=true`; permanent deletion is a TCPA compliance risk |

### 🟡 Medium Priority

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| M1 | ImageLightboxGallery.astro is 629 lines | **RESOLVED** | Dropped to 170 lines — CSS moved to global.css, JS extracted to `ImageLightboxGallery.client.ts` |
| M2 | `db!` non-null assertions used 30+ times | **RESOLVED** | Zero `db!` remaining across all 14 files — `db/index.ts` uses Proxy that throws on first access, typed as non-nullable |
| M3 | Biweekly broadcast anchor date hardcoded | **RESOLVED** | Configurable via `BROADCAST_ANCHOR_DATE` env var, falls back to 2026-01-07 |
| M4 | Custom `.env` parser in drizzle config | **RESOLVED** | Replaced 28-line custom parser with Node 21+ built-in `process.loadEnvFile` |
| M5 | Type safety in admin-auth `Record<string, unknown>` | **RESOLVED** | Custom `SessionClaims` interface with `publicMetadata.role`, `authorizeAdmin` accepts `unknown` and casts internally |
| M6 | Hardcoded Twilio from-number fallback | **RESOLVED** | Removed hardcoded `+14242958020` fallback — returns `""` if unset, which fails visibly in Twilio |

### 🟢 Quick Wins

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| L1 | Remove deprecated `sendWeeklyPromo` | **RESOLVED** | Removed function export; kept `weekly-promo.ts` route file since it remains as a legacy delegation endpoint |

## Project Architecture (Locked)

- **Framework**: Astro 5, static output; SSR routes use `export const prerender = false`
- **CSS**: Tailwind v4 via `@tailwindcss/vite`, custom theme tokens in `src/styles/global.css`
- **Deploy**: Vercel via `@astrojs/vercel`, cron jobs defined in `vercel.json`
- **DB**: Neon Postgres + Drizzle ORM (`drizzle-orm/neon-http`), migrations in `src/db/migrations/`
- **Auth**: Clerk `@clerk/astro` — middleware gates `/admin(.*)` + `/api/admin(.*)` by admin role
- **SMS**: Twilio, behind `SMS_ENABLED` flag. When off, messages are simulated to DB. See `src/lib/sms.ts`
- **Media**: Auto-optimized on write via Cursor hook (WebP + JPEG, retina, large variants)

### DB Schema — 6 Tables

`subscribers`, `messages`, `staff`, `reviews`, `reviewSyncState`, `posOrders`, `events`

### Source Layout (74 files)

| Directory | Count | Description |
|-----------|-------|-------------|
| `src/pages/` | 21 | Public pages (index, menu, our-story, etc.) |
| `src/pages/admin/` | 6 | Admin dashboard pages |
| `src/pages/api/` | 14 | API routes (sms, admin, cron, pos) |
| `src/components/` | 15 | Astro components |
| `src/layouts/` | 2 | BaseLayout (SEO, schema, nav), AdminLayout |
| `src/lib/` | 10 | Utilities (sms, loyalty, cron, auth, reviews) |
| `src/db/` | 3 | Schema, client, migrations |
| `src/data/` | 3 | Business constants, menu data, loyalty copy |
| `src/styles/` | 1 | global.css |

## NAP / Business Facts

- Address: 8501 S Vermont Ave, Los Angeles, CA 90044
- Phone: (323) 451-3104
- SMS keyword: "Text SOUL to (424) 295-8020" → promo code SOUL10
- Hours: Wed-Thu 11-7, Fri-Sat 11-9, Sun 11-5. Closed Mon-Tue
- Live entertainment: Jazz Wed/Fri, Comedy 3rd Thu, Karaoke Sat, Gospel Brunch Sun

## Contact

Questions about this handoff, or if something is unclear, refer back to the audit session transcript.
