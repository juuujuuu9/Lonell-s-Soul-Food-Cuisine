# Lonell's Soul Food — Conversion Optimization Plan

**Based on:** Restaurant Website Guardrails & Guidelines (conversion-first playbook)
**Date:** June 7, 2026
**Status:** Implementation roadmap

---

## Overview

This plan maps every recommendation from the guardrails guide against the current Lonell's Soul Food website. It identifies what's already done, what needs improvement, and what's missing — organized into 4 implementation phases matching the guide's roadmap.

---

## Current State Summary

### Already Well-Implemented (Keep / Minor Polish)
| Area | Status | Notes |
|------|--------|-------|
| HTML Menu (no PDFs) | ✅ Complete | Static HTML with schema.org Menu markup |
| Schema.org Structured Data | ✅ Good | Restaurant, FoodEstablishment, FAQPage, Event, AggregateRating |
| Mobile-First Design | ✅ Good | Tailwind responsive, semantic HTML |
| Dark Theme / Brand | ✅ Strong | Amber/neon accents, cohesive design |
| Click-to-Call Phone | ✅ Site-wide | tel: links throughout |
| Footer NAP | ✅ Good | Address, phone, email, hours, social |
| FAQ Page | ✅ Good | 13 questions, detailed answers |
| SMS Backend (Twilio) | ✅ Complete | Full TCPA compliance, admin dashboard, keywords |
| Image Optimization | ✅ Complete | WebP + JPEG fallback, retina, lazy loading |
| Accessibility | ✅ Good | Skip-to-content, semantic HTML, ARIA labels |
| SSL / CDN | ✅ Via Vercel | Production-ready infrastructure |

### Needs Improvement (Enhance Existing)
| Area | Priority | Issue |
|------|----------|-------|
| Header / Nav Structure | **High** | No sticky header with Order/Call CTAs; hamburger-only nav |
| Hero Section CTAs | **High** | 3 equal-weight CTAs — violates "single primary CTA" rule |
| SMS Phone Number | **High** | Placeholder "(323) XXX-XXXX" still shown |
| Footer Compliance Links | **Medium** | Missing Privacy Policy, SMS Terms, Accessibility Statement |
| Google Maps | **Medium** | Placeholder "coming soon" for embedded map |
| FAQ Schema Coverage | **Medium** | Schema only includes 4 of 13 FAQ questions |
| Menu Item Photography | **Low** | No dish photos on menu |
| Menu Category Nav | **Low** | No sticky category tabs or jump links |
| Review Integration | **Medium** | Static reviews — no live Google/Yelp widget, no review request automation |
| "As Seen On" Press | **Low** | The Infatuation mention is minimal |
| Title Tag SEO | **Medium** | Could better incorporate location keywords per guide formula |
| Hero Image Preload | **Low** | No explicit `<link rel="preload">` for hero image |

### Missing Entirely (New Build)
| Area | Priority | What's Needed |
|------|----------|---------------|
| Online Ordering | **Critical** | No ordering platform integrated (phone/email only) |
| Sticky Header | **High** | Persistent bar with Order + Phone CTAs on scroll |
| Order CTA | **High** | No "Order Online" primary CTA anywhere on site |
| SMS Signup: Exit-Intent | **Medium** | No exit-intent popup for SMS capture |
| SMS Signup: Header Banner | **Medium** | No promotional banner in header |
| SMS Automation Flows | **Medium** | Welcome series, post-order, re-engagement sequences |
| Dish Landing Pages | **Medium** | No individual pages for top dishes |
| Chat Widget | **Medium** | No chat or live support |
| Analytics (GA4) | **Medium** | No analytics implementation visible |
| Call Tracking | **Low** | No call tracking number |
| A/B Testing Framework | **Low** | No experimentation setup |
| Time-Based Personalization | **Low** | No dynamic content by time of day |
| Location-Based Targeting | **Low** | No geo-aware content |

---

## Phase 1: Foundation (Fix Critical Conversion Blocker)

**Goal:** Remove friction from the core user journey. Every visitor should immediately know how to order.

### 1.1 Sticky Header Component (New: `StickyHeader.astro`)

**Guide Reference:** §3.1 Header Structure, §5.1 CTA Hierarchy

**What to build:**
- Fixed-position header bar visible on scroll (mobile + desktop)
- Left: Restaurant name / logo (links to /)
- Center/Right: Phone icon (tap-to-call) + "Order Now" primary CTA
- "Order Now" button: high-contrast amber (`#f59e0b`), 56px height, bold weight
- Phone link: secondary styling with phone icon
- On mobile: compact height (~56px) to avoid stealing too much screen
- On desktop: full-height with hover states
- Should appear on scroll (not overlap the hero logo)
- Z-index below the nav overlay but above all other content

**Files to create/modify:**
- `src/components/StickyHeader.astro` (NEW)
- `src/layouts/BaseLayout.astro` — add `StickyHeader` before `<main>`
- Potentially adjust hero top padding to account for header

**Design tokens to use:**
```
bg: surface-card/80 with backdrop-blur
border-bottom: border-subtle
CTA bg: brand-amber → brand-amber-light on hover
Phone: text-secondary → accent on hover
Height: 56px mobile, 64px desktop
```

### 1.2 Hero CTA Restructure

**Guide Reference:** §5.4 Hero Section CTA Placement, §5.1 CTA Hierarchy

**What to change:**
- Make "Order Now" the single primary CTA (amber, prominent)
- Demote "View Our Menu" to a secondary text link below
- Keep phone as secondary CTA with outline styling
- Move "Live Music Schedule" to tertiary position or inline as text link

**Current (3 equal CTAs):**
```
[View Our Menu] [Phone] [Live Music Schedule]
```
**Target (hierarchical CTAs):**
```
[Order Now]  ← primary, amber, 56px+
(323) 451-3104  ← secondary, outline
View Our Menu · Live Music Schedule  ← tertiary, text links
```

**Files to modify:**
- `src/components/Hero.astro`

### 1.3 Update SMS Phone Number

**Guide Reference:** §9.1 SMS Sign-Up Touchpoints

**What to change:**
- Replace all "(323) XXX-XXXX" placeholders with the confirmed SMS number
- Verify with owner what the actual SMS short code / long code is

**Files to modify:**
- `src/pages/index.astro`
- `src/pages/contact.astro`
- `src/pages/faq.astro`

### 1.4 Add Hero Image Preload

**Guide Reference:** §13.2 Image Optimization Pipeline

**What to change:**
- Add `<link rel="preload">` for the hero WebP image in `BaseLayout.astro` head
- This improves LCP by signaling the browser to fetch the hero image early

**Files to modify:**
- `src/layouts/BaseLayout.astro`

---

## Phase 2: Conversion Engine (Enable Ordering & Capture Data)

**Goal:** Build the direct ordering capability and data capture infrastructure.

### 2.1 Online Ordering Integration

**Guide Reference:** §6 Direct Online Ordering

**What to build:**
This is the largest piece. Options to discuss with owner:

**Option A: Third-Party Integration (Recommended for speed)**
- Integrate Toast, ChowNow, Square Online, or GloriaFood
- Embed their ordering widget or link out to white-label ordering page
- Pros: Fast to implement, handles payments/POS
- Cons: Monthly fee, limited customization

**Option B: Custom Build (Stripe + SMS)**
- Build custom ordering system using Stripe for payments
- Use existing Twilio/SMS infrastructure for notifications
- Pros: Full control, no per-order fees
- Cons: 4-6 weeks dev time, PCI compliance responsibility

**Initial implementation (MVP):**
- At minimum, a dedicated `/order` page with phone + link to preferred ordering platform
- "Order Now" CTAs should resolve to a real destination
- If no platform integrated yet, CTAs should at minimum trigger a phone call with clear "Call to Order" messaging

**Files:**
- `src/pages/order.astro` (NEW) or external link
- Update all "Order Now" CTAs to point to the ordering destination

### 2.2 Footer Enhancements

**Guide Reference:** §3.3 Footer Requirements

**What to add:**
- Google Maps link embedded with address (replace placeholder)
- Link to Privacy Policy page
- Link to SMS Terms & Conditions page  
- Link to Accessibility Statement page
- Google Review direct deep link (`https://g.page/r/.../review`)
- Current day highlighted in hours table

**Files to create/modify:**
- `src/pages/privacy.astro` (NEW)
- `src/pages/sms-terms.astro` (NEW)
- `src/pages/accessibility.astro` (NEW)
- `src/components/SiteFooter.astro` — add links, maps embed, Google Review link
- `src/pages/contact.astro` — replace map placeholder with actual embed

### 2.3 Expand FAQ Schema Coverage

**Guide Reference:** §10.2 Schema.org Markup

**What to change:**
- FAQ schema in `BaseLayout.astro` currently covers 4 questions
- Expand to cover all 13 FAQ questions for richer voice/AI search results
- This improves AI search readiness (ChatGPT, Google SGE, Perplexity)

**Files to modify:**
- `src/layouts/BaseLayout.astro` — expand FAQ schema array

### 2.4 Add SMS Signup Exit-Intent

**Guide Reference:** §9.1 Sign-Up Touchpoints (Exit-intent)

**What to build:**
- Simple exit-intent popup that appears when mouse leaves the viewport (desktop) or scrolls up (mobile)
- Offer: "Wait! Get 10% off your first order" with phone number field
- TCPA compliant: explicit consent, unchecked checkbox
- Dismissible with X button
- Cookie/session flag to not show again after dismissal or signup

**Note:** This requires client-side JavaScript. Consider a lightweight approach using Astro's `<script>` or a minimal component.

### 2.5 Dish Landing Pages (Top 10)

**Guide Reference:** §4.2 Menu Item Page Standards

**What to build:**
- Create individual pages for top 10-12 signature dishes
- Structure: `/menu/[dish-slug]`
- Each page includes: hero image, H1 with SEO keywords, price, description, "Add to Order" button, dietary tags, MenuItem schema
- Start with the most popular items: Oxtails, Fried Chicken, Catfish, Short Ribs, Pork Chops, Meatloaf, Brisket, Turkey Chop

**Potential approach:** Use Astro dynamic routes with `[slug].astro` and a data file.

**Files to create:**
- `src/menu/data.ts` or `src/data/menu.ts` — dish data with extended info
- `src/pages/menu/[slug].astro` — dynamic dish page

---

## Phase 3: Automation & Retention

**Goal:** Build automated systems for repeat business and customer retention.

### 3.1 SMS Automation Flows

**Guide Reference:** §9.4 SMS Automation Flows, §9.3 Progressive Profiling

**What to build:**
- **Welcome Series:** 4-message sequence (Day 0, 3, 7, 14) triggered on new subscriber
- **Post-Order Series:** Confirmation, feedback request (30min), review request (24hr), re-order (7 days)
- **Re-engagement:** Day 30/60/90 for inactive subscribers

**Note:** The SMS infrastructure (Twilio, DB schema, admin) is already in place. This phase adds the automated sequences.

**Files to consider:**
- `src/lib/sms.ts` — add flow logic
- `src/api/cron/weekly-promo.ts` — extend for multi-step flows
- `src/api/cron/welcome-series.ts` (NEW)

### 3.2 Review Request Automation

**Guide Reference:** §8.2 Review Request Automation

**What to build:**
- Post-meal SMS: "Enjoy your meal? Leave us a review and get $5 off your next order: [Google Review Link]"
- Triggered by staff after dine-in or delivery
- Track in DB (reviews table already exists)

### 3.3 Live Google/Yelp Rating in Header

**Guide Reference:** §8.1 Review Integration

**What to add:**
- Show "4.2 ★" on Yelp next to the phone/CTA in the sticky header
- Link to Yelp review page
- Makes social proof visible immediately on page load

### 3.4 Chat Widget

**Guide Reference:** §11 Chat & Automation

**What to build:**
- Simple chat widget (Tidio, Intercom, or lightweight custom)
- Positioned bottom-right
- Triggered after 15-40s delay
- Flow: Order / Question / Catering / Feedback
- Escalation to human for complex orders and complaints

---

## Phase 4: Optimization & Refinement

**Goal:** Data-driven optimization and expanded content.

### 4.1 Analytics Implementation

**Guide Reference:** §14 Analytics & KPIs

**What to set up:**
- Google Analytics 4 (GA4) tracking
- Event tracking for: CTA clicks, phone calls (tap-to-call), menu views, SMS sign-ups
- Google Search Console verification
- Optional: Hotjar/Microsoft Clarity for heatmaps

### 4.2 Call Tracking

**Guide Reference:** §7.4 Tracking Phone Orders

**What to set up:**
- CallRail or equivalent for unique tracking number on website
- Track: call volume, duration, time of day, conversion rate

### 4.3 A/B Testing Framework

**Guide Reference:** §14.4 A/B Testing Priorities

**What to test (in order):**
1. CTA color and copy ("Order Now" vs. "Order Direct & Save")
2. Hero image (food close-up vs. restaurant atmosphere)
3. SMS sign-up offer (10% off vs. free appetizer vs. double points)
4. Menu layout (grid vs. list, photos vs. no photos)

### 4.4 Navigation Order Update

**Guide Reference:** §3.2 Primary Navigation Order

**Current order:**
HOME, MENU, OUR STORY, ENTERTAINMENT, PRIVATE EVENTS, CONTACT, REVIEWS, FAQ

**Target order (per guide):**
1. MENU
2. ORDER ONLINE (or "Order Now")  
3. CALL TO ORDER
4. OUR STORY
5. PRIVATE EVENTS / CATERING
6. CONTACT
7. REVIEWS
8. FAQ
9. ENTERTAINMENT

**Files to modify:**
- `src/components/NavOverlay.astro`

---

## Appendix A: Guardrails Guide — Compliance Checklist

### Pre-Launch Audit (Current Score: 12/20)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Mobile load time < 3 seconds | ✅ | Static output, optimized assets |
| 2 | All images WebP with JPEG fallback | ✅ | Hook pipeline does this |
| 3 | HTML menu live, no PDFs | ✅ | Static HTML menu |
| 4 | Sticky header with Order + Call CTAs | ❌ | Phase 1.1 |
| 5 | Guest checkout enabled | ➖ | N/A until online ordering |
| 6 | SMS opt-in at checkout (unchecked) | ➖ | N/A (no checkout yet) |
| 7 | Schema.org markup on all pages | ✅ | Good coverage |
| 8 | GBP claimed and optimized | ❓ | Unknown — marketing task |
| 9 | Reviews widget on homepage | ✅ | Static reviews present |
| 10 | HTTPS with valid SSL | ✅ | Vercel provides this |
| 11 | Click-to-call phone numbers | ✅ | Present site-wide |
| 12 | Accessibility audit (WCAG 2.1 AA) | ➖ | Not formally audited |
| 13 | Analytics tracking verified | ❌ | Phase 4.1 |
| 14 | Call tracking number active | ❌ | Phase 4.2 |
| 15 | Chat widget configured and tested | ❌ | Phase 3.4 |
| 16 | FAQ page with 10+ AI-searchable Qs | ⚠️ | 13 questions exist but schema only covers 4 |
| 17 | Exit-intent popup configured | ❌ | Phase 2.4 |
| 18 | Abandoned cart recovery active | ❌ | N/A until online ordering |
| 19 | SMS welcome series live | ❌ | Phase 3.1 (infra exists) |
| 20 | Post-order review request automated | ❌ | Phase 3.2 |

---

## Appendix B: File Change Summary

| Phase | File | Action |
|-------|------|--------|
| 1.1 | `src/components/StickyHeader.astro` | **CREATE** |
| 1.1 | `src/layouts/BaseLayout.astro` | **MODIFY** — add StickyHeader |
| 1.2 | `src/components/Hero.astro` | **MODIFY** — restructure CTAs |
| 1.3 | `src/pages/index.astro` | **MODIFY** — update SMS number |
| 1.3 | `src/pages/contact.astro` | **MODIFY** — update SMS number |
| 1.3 | `src/pages/faq.astro` | **MODIFY** — update SMS number |
| 1.4 | `src/layouts/BaseLayout.astro` | **MODIFY** — add hero preload |
| 2.1 | `src/pages/order.astro` or external | **CREATE** — ordering page |
| 2.2 | `src/pages/privacy.astro` | **CREATE** |
| 2.2 | `src/pages/sms-terms.astro` | **CREATE** |
| 2.2 | `src/pages/accessibility.astro` | **CREATE** |
| 2.2 | `src/components/SiteFooter.astro` | **MODIFY** — add links, maps, Google Review, highlight today |
| 2.2 | `src/pages/contact.astro` | **MODIFY** — replace map placeholder |
| 2.3 | `src/layouts/BaseLayout.astro` | **MODIFY** — expand FAQ schema to 13 |
| 2.4 | exit-intent component | **CREATE** (new component) |
| 2.5 | `src/data/menu.ts` | **CREATE** — dish data |
| 2.5 | `src/pages/menu/[slug].astro` | **CREATE** — dynamic dish pages |
| 3.1 | `src/lib/sms.ts` | **MODIFY** — add flow logic |
| 3.1 | `src/api/cron/welcome-series.ts` | **CREATE** |
| 3.2 | Review request flow | **CREATE** |
| 3.3 | `src/components/StickyHeader.astro` | **MODIFY** — add rating |
| 3.4 | Chat widget | **CREATE** |
| 4.1 | GA4 configuration | **SETUP** |
| 4.4 | `src/components/NavOverlay.astro` | **MODIFY** — reorder links, add Order/Call |

---

## Appendix C: Open Questions for Owner

1. **Online ordering:** What platform do you want to use (Toast, ChowNow, Square Online, GloriaFood) or custom build?
2. **SMS number:** What is the actual short code / long code for SMS? Currently shows "(323) XXX-XXXX".
3. **Google Business Profile:** Is it claimed and optimized? What's the current state?
4. **Google Review link:** What's the direct deep link for leaving a review?
5. **Call tracking:** Do you have a CallRail or similar account?
6. **Privacy & legal pages:** Do you have existing Privacy Policy / SMS Terms language, or need drafts?
7. **Chat platform:** Preference for a specific chat tool (Tidio, Intercom, Drift)?
8. **Dish photos:** Do you have high-quality photos of the top 10 dishes?
9. **"Family Owned Since" year:** What year did Lonell's open?
10. **Analytics:** Do you have a GA4 property set up?
