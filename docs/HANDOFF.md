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

A full code quality and integrity audit covering 74 source files. Findings documented in the conversation transcript. Key outcomes:

- **Merge conflicts resolved**: `LoyaltySignupForm.astro` and `LoyaltySignupPrompt.astro` — accepted the "Stashed changes" side on all 8 unresolved conflict blocks.
- The working tree is clean with all changes pushed.

## Open Issues Requiring Action

### 🔴 Critical (fix before next deploy)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| C1 | ~~Merge conflict artifacts~~ | LoyaltySignupForm.astro, LoyaltySignupPrompt.astro | **RESOLVED** |
| C2 | `.env` tracked in git history | Root | `git rm --cached .env`, rotate all exposed secrets (DATABASE_URL, CLERK_SECRET_KEY, TWILIO_AUTH_TOKEN) |
| C3 | Broadcast endpoint fetches ALL subscribers + leaks PII | `src/pages/api/admin/send-broadcast.ts` | Add pagination (limit 500), remove `results` array from response, set `maxDuration` |
| C4 | No authorization on admin sync-reviews page POST | `src/pages/admin/reviews.astro` (line 68) | Verify middleware covers `/admin(.*)` — confirmed it does via `isAdminRoute` matcher |

### 🟠 High Priority

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| H1 | Dual DB connection pools | `src/lib/admin-auth.ts` (lines 22–27) | Reuse shared `db` from `db/index.ts` instead of creating second `drizzle(neon(...))` instance |
| H2 | Serial SMS sending in cron loop | `src/lib/cron.ts` (lines 24–43) | Batch with `Promise.allSettled` in groups of 10–20 |
| H3 | Admin settings page leaks partial secret values | `src/pages/admin/settings.astro` (lines 42–44) | Show only "Set"/"Not Set" — never the value itself |
| H4 | No `maxDuration` on cron API routes | `src/pages/api/cron/*.ts` | Add `export const config = { maxDuration: 300 }` to each |
| H5 | Opt-out cleanup permanently deletes records | `src/lib/cron.ts` (lines 224–242) | Soft-delete or archive instead of `DELETE` for TCPA compliance |

### 🟡 Medium Priority

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| M1 | ImageLightboxGallery.astro is 629 lines | `src/components/ImageLightboxGallery.astro` | Extract JS into separate file, move shared CSS to global stylesheet |
| M2 | `db!` non-null assertions used 30+ times | `src/db/index.ts` (line 20) | Make `db` throw if uninitialized instead of being `null` |
| M3 | Biweekly broadcast anchor date hardcoded | `src/lib/biweekly-broadcast.ts` (line 6) | Use configurable anchor or first-run detection |
| M4 | Custom `.env` parser in drizzle config | `drizzle.config.ts` | Replace with `dotenv` or rely on drizzle-kit's built-in env |
| M5 | Type safety: `Record<string, unknown>` in admin-auth | `src/lib/admin-auth.ts` (line 16) | Use typed Clerk session claims interface |
| M6 | Hardcoded Twilio from-number fallback | `src/lib/sms.ts` (line 18) | Remove fallback; let it fail visibly if not configured |

### 🟢 Quick Wins (cleanup)

| # | Issue | Location |
|---|-------|----------|
| L1 | Remove deprecated `sendWeeklyPromo` | `src/lib/cron.ts` (line 218) |

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
