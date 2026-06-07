# Handoff — Conversion Optimization Implementation

## Context

The project is [Lonell's Soul Food](https://lonells.com), an Astro 5 website for a soul food restaurant in South LA.

## Key Documents

- **Guardrails Guide:** `docs/restaurant-website-guardrails-guide.md` — the source reference doc
- **Implementation Plan:** `docs/conversion-optimization-plan.md` — full audit + 4-phase roadmap

## Current State (all buildable — `npm run build` passes)

### Completed (Phases 1 & 2 + 4.4)

| Phase | Item | Files |
|-------|------|-------|
| 1.1 | Sticky header with Order Now + Phone CTAs + MENU button | `src/components/StickyHeader.astro` (NEW) |
| 1.2 | Hero CTAs restructured (hierarchical) | `src/components/Hero.astro` |
| 1.4 | Hero image preload for LCP | `src/layouts/BaseLayout.astro` |
| 2.2 | Legal pages: Privacy, SMS Terms, Accessibility | `src/pages/{privacy,sms-terms,accessibility}.astro` (NEW) |
| 2.2 | Footer: Google Maps link, Review link, today highlight, legal links | `src/components/SiteFooter.astro` |
| 2.2 | Contact page: Google Maps embed replacing placeholder | `src/pages/contact.astro` |
| 2.3 | FAQ Schema expanded from 4 → 13 QA pairs | `src/layouts/BaseLayout.astro` |
| 2.5 | Dish landing pages (10 dishes at `/menu/[slug]`) | `src/data/menu.ts` (NEW), `src/pages/menu/[slug].astro` (NEW) |
| 2.5 | Menu page dish names link to individual pages | `src/pages/menu.astro` |
| 4.4 | Nav overlay reordered (MENU first, ORDER NOW, CALL TO ORDER, HOME removed) | `src/components/NavOverlay.astro` |

### StickyHeader Behavior

- **Hidden initially**, appears after scrolling 1/4 viewport height
- After reveal: slides up on scroll-down, slides back on scroll-up
- **MENU toggle button** is inside the header (icon-only on mobile, "MENU" + icon on md+)
- Old standalone fixed hamburger button removed from `BaseLayout.astro`
- Overlay open forces header to stay visible for CLOSE access
- Z-index 110 (above nav overlay at 100)

## What's Left (needs owner input or is new work)

| Item | Blocks On |
|------|-----------|
| 1.3 — SMS number placeholders (`(323) XXX-XXXX`) | Owner to provide real SMS number |
| 2.1 — Online ordering integration | Owner's platform preference |
| 2.4 — Exit-intent popup | Ready to build (no deps) |
| 3.1 — SMS automation flows | Owner to provide SMS number + platform |
| 3.2 — Review request automation | Ready to build |
| 3.3 — Live rating (Google/Yelp) in header | Ready to build |
| 3.4 — Chat widget | Ready to build |
| 4.1 — GA4 analytics | Ready to setup |
| 4.2 — Call tracking | Owner's call tracking service |

## Important Project Details

- **Framework:** Astro 5, Tailwind v4 via `@tailwindcss/vite`
- **Design tokens:** Defined in `src/styles/global.css` as CSS custom properties under `@theme`
- **Images:** All optimized via sharp pipeline (WebP + JPEG fallback, retina 2x)
- **SMS infra:** Fully built (Twilio, DB schema, admin dashboard, TCPA compliance)
- **Auth:** Clerk middleware guarding `/admin(.*)` routes
- **Deploy:** Vercel via `@astrojs/vercel`
- **DB:** Neon Postgres + Drizzle ORM

## Questions for Owner

1. SMS number: what's the real short code/long code?
2. Online ordering: preference for platform? (Toast, ChowNow, Square Online, GloriaFood, custom?)
3. Google Review direct deep link (place_id needed for the review link in footer)
4. Call tracking: do you have a CallRail or similar account?
