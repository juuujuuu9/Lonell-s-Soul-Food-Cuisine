# In-Store QR Print Collateral — Menu & SMS Club

> Compiled: 2026-07-07
> Status: **Design brief / content spec only — no code changed.** Ready to hand to a designer or print shop, or to build as static print-ready files later.

## Summary

A plan for three sizes of printed, in-store signage that drive customers to (1) the digital menu and (2) the SoulFood SMS Club opt-in, using the site's existing dark/amber/neon design system, the two QR assets already generated in the repo, and researched best practices for QR print sizing and CTIA/TCPA point-of-sale SMS disclosures. Table tents are explicitly excluded per request. Sizes covered: **Standard (8.5×11")**, **Half sheet (5.5×8.5")**, **Quarter sheet (4.25×5.5")**.

---

## Goals & Constraints

- Get customers scanning to the menu (`/menu`) and into the SMS club (text `SOUL` to `(424) 295-8020`) as fast as possible, in physical form, in-store.
- Reuse the site's existing visual language — don't invent a new brand system for print.
- No table tents (excluded per request).
- Every piece that solicits SMS opt-in must carry a clear, conspicuous CTIA/TCPA-compliant disclosure — this is a legal requirement, not a style choice.
- Reuse the QR assets already generated in the repo rather than creating new ones:

| File | Encodes | Use for print? |
|---|---|---|
| `public/media/qrcodes/qr-menu.png` | `https://lonellssoulfood.com/menu` | ✅ Yes — all 3 formats |
| `public/media/qrcodes/qr-sms-optin.png` | `sms:+14242958020?body=SOUL` (opens messenger, pre-filled) | ✅ Yes — all 3 formats (this is the one-tap, frictionless in-store version) |
| `public/media/qrcodes/qr-sms-web.png` | `https://lonellssoulfood.com/sms` | ❌ Not for print — reserve for social bio links / website embeds only |

---

## Research Basis

### QR code print sizing — the 10:1 rule

Industry-standard guidance (Denso Wave / print-industry consensus, 2026): **minimum QR width ≥ expected scan distance ÷ 10.** Undersizing is the single most common cause of scan failure — always round up.

| Context | Typical scan distance | Min. size | Recommended size |
|---|---|---|---|
| Hand-held flyer / bag insert | 8–12 in | 0.8–1.2 in | 1.5 in |
| Counter / register standee | 12–24 in | 1.2–2.4 in | 2 in |
| Wall poster / host-stand sign | 24–48 in | 2.4–4.8 in | 3–3.5 in |

Additional print-quality notes from research:
- Keep a clean **quiet zone** (light-colored margin) around every code — don't crop it tight against other art.
- Matte/soft-touch finishes scan more reliably than glossy — glare is a top cause of failed scans on laminated signage.
- Always pre-test the printed piece with 2–3 different phone models at the actual intended distance and lighting before a full print run.
- **Resolution check for our existing assets:** the repo's QR PNGs are 800×800px. At the recommended print sizes above (1.5"–3.5"), that resolves to roughly 230–530 DPI — comfortably above the ~150–300 DPI threshold needed for crisp QR scanning (QR modules are high-contrast blocks, more forgiving than photos). **No new QR exports are needed for any of the three formats below.**

### CTIA / TCPA point-of-sale SMS disclosure requirements

Per CTIA Messaging Principles & Best Practices and the CTIA Short Code Monitoring Handbook, a point-of-sale call-to-action for a recurring SMS program must clearly and conspicuously disclose, **before** the consumer opts in:

1. Who is texting — the business/program name
2. What kind of messages they'll get (offers, menu updates, event alerts)
3. Estimated message frequency
4. "Message and data rates may apply"
5. How to opt out (**STOP**) and get help (**HELP**)
6. That consent is not a condition of purchase

The site's existing `/terms#sms-program` page already treats "scan a QR code or text SOUL" as a valid in-store opt-in method and states that "sending the keyword constitutes your consent." The printed piece is the **call-to-action** in that flow, so it must carry disclosure #1–6 above near the QR/keyword — the automated welcome text (already built in `src/lib/loyalty.ts`) then reinforces STOP/HELP again per CTIA's confirmation-message rule. This is a belt-and-suspenders design, not a duplication to remove.

---

## Brand System Quick Reference

*(pulled from `src/styles/global.css`, `BaseLayout.astro`, `Hero.astro` — for the designer/print shop, not modified here)*

```
Background:     #0a0a0a (brand-dark)
Card surface:   #141414, border #262626 (rounded-xl)
Amber accent:   #f59e0b  →  hover/light #fbbf24
Neon accent:    #34d399  (used for SMS-club highlights specifically)
Text primary:   #fafafa   Text secondary: #a3a3a3   Text muted: #6b6b6b
Heading font:   Arbutus Slab (serif, -0.02em tracking)
Body font:      Inter
Eyebrow style:  Inter 12px/600, uppercase, 0.15em tracking, amber
CTA shape:      rounded-full pill, black text on amber fill
Logo (dark bg): public/media/images/lonells-gold-logo.png
Tagline:        "A Place of Love"
```

---

## Placement Strategy

| Touchpoint | Format | Primary job | Scan distance |
|---|---|---|---|
| Entrance / host stand / waiting-area wall | **Standard (8.5×11")** | Let people browse the menu *and* discover the SMS club while they wait to be seated | 2–4 ft |
| Register / checkout counter (acrylic stand) | **Half sheet (5.5×8.5")** | Catch the highest-intent moment — closing the sale of a text opt-in right at checkout | 1–2 ft |
| To-go bag insert, receipt handout, community bulletin board | **Quarter sheet (4.25×5.5")**, two single-focus variants | Take-home reminder that survives outside the store | 8–12 in |

Rationale for splitting the quarter sheet into two single-CTA variants instead of one combined card: at the smallest, most transactional touchpoints (a register handout or a bag insert), a single clear ask converts better than two competing QR codes competing for a customer's one glance. The standard and half sheets have room to present both without diluting either.

---

## Format 1 — Standard Sheet: Entrance / Host-Stand Poster

**Trim size:** 8.5 × 11 in, portrait. **Stock:** 100lb text or 14pt cardstock, matte/soft-touch laminate. **Mount:** table-top acrylic sign holder or wall frame at ~48–60 in from floor (comfortable eye level, ADA-friendly).

**Layout (two-column, mirrors the existing `/qr-codes` page):**

- Header: gold medallion logo, centered, ~1.25 in wide
- Eyebrow: `Scan & Connect`
- H1 (Arbutus Slab): `Menu & SMS Club`
- Two equal-weight columns on dark card panels (`#141414`, rounded corners, subtle border), each holding a white quiet-zone plate behind its QR so the code keeps full contrast against the dark background:

| Left column | Right column |
|---|---|
| **View Our Menu** | **Join Our SMS Club** |
| QR: `qr-menu.png`, printed at **3.25 in** | QR: `qr-sms-optin.png`, printed at **3.25 in** |
| Caption: "Scan with your camera — lunch, dinner, sides & more." | Caption: "Scan to text **SOUL** — or text it yourself to **(424) 295-8020**." |
| Fallback text: `lonellssoulfood.com/menu` | Offer line (amber): "Show your welcome text for 10% off your dinner." |

- Footer band (full-width, small text, secondary color): full SMS disclosure block (see Disclaimer Library below) + phone `(323) 451-3104` + `lonellssoulfood.com`
- Optional: thin amber or neon-subtle vertical divider between the two columns, matching the site's `.neon-border` treatment

---

## Format 2 — Half Sheet: Counter / Register Standee

**Trim size:** 5.5 × 8.5 in, portrait. **Stock:** 14–16pt cardstock, matte laminate (stiffer stock so it stands upright in a small acrylic countertop holder without curling). **Placement:** register counter, hostess stand, pickup counter — at arm's reach, single-column, stacked.

**Layout (single column, both QRs, SMS given top billing since this is the checkout moment):**

- Small logo/wordmark at top, ~0.9 in
- Eyebrow: `Stay Connected`
- H1: `Join SoulFood Fam`
- Body: "Get exclusive offers, menu previews & event invites. Show your welcome text for 10% off dinner."
- QR: `qr-sms-optin.png` at **2.25 in**, on its own white plate
- Caption under QR: "Text **SOUL** to **(424) 295-8020**"
- Divider (thin rule)
- Secondary block, smaller: "Want to see the menu first?" + QR: `qr-menu.png` at **1.75 in**
- Footer: condensed disclaimer block (see below)

---

## Format 3 — Quarter Sheet: Register Handout / To-Go Bag Insert / Bulletin Card

**Trim size:** 4.25 × 5.5 in (standard postcard / quarter-letter). **Stock:** 14pt cardstock; consider a rounded corner die-cut to feel like a keepsake card rather than a receipt. Two single-focus variants:

### Variant A — SMS Club (handed out at register or clipped to receipt)

- Eyebrow: `Text to Join`
- H1: `SoulFood SMS Club`
- QR: `qr-sms-optin.png` at **1.75 in**
- Caption: "Scan, or text **SOUL** to **(424) 295-8020**"
- Offer line (amber): "New members: show this welcome text for 10% off dinner."
- Condensed disclaimer block (see below)

### Variant B — Menu (to-go bag insert / take-one rack / bulletin board)

- Eyebrow: `Scan the Menu`
- H1: `See What's Cooking`
- QR: `qr-menu.png` at **1.75 in**
- Caption: "Point your camera — no app needed."
- Fallback text: `lonellssoulfood.com/menu`
- Small footer: `(323) 451-3104 · "A Place of Love"` — no SMS legal copy needed on this variant since it has no opt-in CTA.

*(If a single combined quarter card is preferred over two variants — e.g. to simplify print runs — stack both QRs at 1.5 in each with the SMS disclosure block still included, matching the layout logic of the half sheet at smaller scale.)*

---

## Disclaimer Copy Library

Use the size that fits; never omit the core five items (frequency, rates, STOP, HELP, consent-not-required) wherever a customer can opt in from that piece.

**Full (Standard sheet footer, ~8–9pt):**

> By texting SOUL you agree to receive recurring automated marketing texts from Lonell's Soul Food Cuisine at the number used. Msg & data rates may apply. Message frequency varies (approx. 2–4 msgs/month). Consent is not a condition of purchase. Reply STOP to cancel, HELP for help. Terms: lonellssoulfood.com/terms · Privacy: lonellssoulfood.com/privacy

**Condensed (Half sheet / Quarter Variant A, ~7–8pt, never smaller than 7pt):**

> Msg & data rates may apply. ~2–4 msgs/mo. Consent not required to purchase. Reply STOP to cancel, HELP for help. Terms at lonellssoulfood.com/terms · Privacy at lonellssoulfood.com/privacy

**Menu-only pieces (Quarter Variant B):** no SMS legal copy required — it carries no opt-in call-to-action.

---

## Production Notes

- **Contrast/quiet zone:** every QR sits on its own white plate with padding — never place the black-on-white code directly against the dark poster background without that white buffer, or the printer/laminator may crop the code's built-in quiet zone.
- **Type size floor:** body copy ≥ 10pt, legal disclaimer ≥ 7pt (per CTIA "clear and conspicuous" — don't go smaller even on the quarter sheet).
- **Finish:** matte or soft-touch lamination throughout — avoid gloss, which causes glare-related scan failures under restaurant overhead lighting.
- **Fallback text:** every QR is paired with a human-readable fallback (`lonellssoulfood.com/menu`, or "text SOUL to (424) 295-8020") for customers who can't or won't scan, and as a trust signal.
- **Pre-print test:** before a full print run, scan each piece with 2–3 phone models at the format's intended distance under the store's actual lighting.
- **Assets are print-ready as-is:** the existing 800×800px PNGs need no regeneration for these sizes (see DPI math above). If a future logo-in-the-center QR treatment is wanted, bump the generator's error-correction level from `M` to `Q`/`H` first so the code stays scannable — that's a follow-up script change, not needed for this collateral.

---

## Compliance & Recordkeeping Note

The in-store keyword opt-in is already documented as a valid consent method in `/terms#sms-program`, and Twilio-side STOP/HELP/keyword handling, consent logging, and the welcome-message confirmation are already built (`src/lib/loyalty.ts`, `src/lib/sms.ts`). These printed pieces are the **visible call-to-action** that CTIA requires to sit alongside that flow — no additional backend work is implied by this document.

---

## Open Questions / TODO

- [ ] Confirm final placement locations with the owner (host stand vs. window vs. wait-area wall for the Standard sheet)
- [ ] Decide: two single-focus Quarter variants, or one combined Quarter card
- [ ] Confirm register handout logistics (handed by staff vs. self-serve rack) — affects Variant A wording ("ask your server" vs. self-explanatory)
- [ ] Owner sign-off on quantities/print vendor and stock weights above
- [ ] If a storefront-facing **window cling** (visible from the sidewalk) is wanted later, that needs a separate, much larger QR (12–24 in per the 10:1 rule at 10–20 ft) — out of scope for these three paper sizes

## References

- `docs/sms-loyalty-program.md` — SMS message sequences, voice/style rules, register staff script
- `docs/master-verified-business-info.md` — verified NAP/business facts
- `src/pages/qr-codes.astro` — existing on-site QR download hub
- `src/pages/terms.astro#sms-program` — live legal terms for the SMS program
- `scripts/generate-qr-codes.mjs` — QR generation script (source of the three PNGs referenced above)
