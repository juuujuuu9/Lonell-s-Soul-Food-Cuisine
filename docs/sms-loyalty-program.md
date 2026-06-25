# Lonell's Soul Food Cuisine — SMS Loyalty Program

> **Design spec for the SMS loyalty program.** The SMS infrastructure (Twilio, DB schema, admin dashboard, TCPA compliance) is already built and deployed. This document defines the automated messaging sequences, voice & style rules, contact card strategy, and operational checklists to complete the program.

**Project status:** `src/lib/sms.ts` handles basic keyword routing (SOUL, STOP, HELP, MENU, EVENTS) and simulated/real Twilio sends. The automated sequences below (Day 1 review, Day 7 nudge, 30-day win-back, birthday, weekly broadcasts) need to be built. See [HANDOFF.md](./HANDOFF.md) and [conversion-optimization-plan.md](./conversion-optimization-plan.md) for the implementation roadmap.

---

## Program Overview

**Goal:** Build a respectful, effective SMS loyalty system that drives repeat visits, generates reviews, and promotes live entertainment — without overwhelming subscribers.

**Frequency Cap:** Maximum 4-5 SMS per customer per month (automated triggers + 1 weekly broadcast + occasional spontaneous blasts).

**Tone:** Warm, dignified, rooted in Black American tradition. No gimmicks, no slang. Classy and inviting.

---

## Sign-Up Flow

1. Guest scans QR code at table or register
2. Texts keyword **SOUL** to program number (+1 (424) 295-8020)
3. Receives Day 0 welcome message instantly
4. Day 1 review request fires automatically
5. Day 7 entertainment nudge fires only if no return visit detected

---

## Automated Triggers

### Day 0 — Welcome

```
Welcome to Lonell's Soul Food Family! 🍽️

Your complimentary [NEEDS INPUT: incentive] is waiting — show this message with any dinner plate.

Thank you for supporting us.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Marked as **NEEDS INPUT** — owner must specify sign-up incentive (e.g., dessert, side, drink)
- This is the first impression. Sets tone for entire program.
- **Current implementation** sends a generic "Use code SOUL10 for 10% off + free champagne brunch upgrade" — update to match owner's chosen incentive
- Include full address in this message only (per Location & Website Policy below)

---

### Day 1 — Review Request

```
We hope you enjoyed your time with us! 🌟

If we made your day a little better, we'd be grateful for your words on Google or Yelp. Share your experience and show us your posted review for a complimentary side on your next visit.

[Google Link]
[Yelp Link]

With appreciation,

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Fires 24 hours after first visit
- Post-visit timing proven 90%+ more effective than tableside asks
- Review reward: complimentary side on next visit (fixed)
- **Not yet implemented** — needs automation in `src/lib/sms.ts`

---

### Day 7 — Entertainment Nudge (No Return Detected)

```
We'd love to see you again! 🎷

This Wednesday: Live jazz from 6 to 9. This Sunday: Brunch and live music from 1 to 5. Mention this message for a complimentary champagne upgrade.

Walk in, or call [PHONE] to reserve your table.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Only fires if customer has not returned within 7 days
- Promotes two anchor events: Wednesday jazz and Sunday brunch
- Champagne upgrade is a fixed incentive
- **Not yet implemented**

---

### 30-Day Win-Back

```
We miss you! 💛

Come back this week and [NEEDS INPUT: incentive]. The music is playing, the kitchen is open, and your table is waiting.

Show this message to redeem. Valid [NEEDS INPUT: duration].

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Marked as **NEEDS INPUT** — owner must specify:
  - Incentive (e.g., 20% off, complimentary appetizer, BOGO)
  - Duration (e.g., 7 days, 14 days, through end of month)
- Fires only if no visit in 30 days
- Proven 5-7% win-back rate in industry case studies
- **Not yet implemented**

---

### Birthday

```
Happy Birthday! 🎉

We would be honored to celebrate with you. Enjoy a complimentary champagne brunch upgrade and a dessert on us, all month long.

Call [PHONE] to reserve, or walk in.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Fixed offer: champagne brunch upgrade + complimentary dessert
- Valid entire birthday month
- Requires birthday data collection at signup or via reservation system
- **Not yet implemented** — needs birthday field in subscriber schema + collection mechanism

---

## Weekly Broadcasts (Pick One Per Week)

### Wednesday — Jazz Night

```
Tonight at Lonell's: Live jazz, 6 to 9! 🎷 Good food, good music, good company.

Walk in, or call [PHONE] to reserve your table.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Send Wednesday between 11am-2pm
- Primary anchor for midweek traffic
- No incentive needed — music is the draw
- **Not yet implemented** — needs scheduled broadcast system

---

### Sunday — Brunch

```
Sunday Brunch is live at Lonell's! 🍳 Music starts at 1, the kitchen is open until 5.

Mention this message for a complimentary champagne upgrade.

Call [PHONE] to reserve, or walk in.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Send Sunday between 9am-11am
- Fixed incentive: complimentary champagne upgrade
- Drives reservations for high-value brunch service
- **Not yet implemented**

---

## Spontaneous Blasts (As Needed, Max 2/Month)

### Slow Night Fill

```
Tuesday evening at Lonell's: Dinner plates after 7, special pricing! No cover, no rush.

Walk in, or call [PHONE].

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Use for historically slow nights (Tuesday, Thursday)
- Owner specifies which night and exact pricing

---

### New Menu Item

```
Something new from the kitchen: [ITEM]! ✨ Made from scratch, just like everything else.

Available now. Come taste it.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Owner fills in [ITEM]
- No discount needed — curiosity and quality are the sell

---

### Holiday / Special Event

```
[Holiday] at Lonell's! 🎊 We're taking reservations now for family-style dinner and live music.

Call [PHONE] to book your table.

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Notes:**
- Owner fills in [Holiday] (Mother's Day, Thanksgiving, New Year's, etc.)
- Drives advance reservations for high-volume dates

---

## Voice & Style Rules

| Rule | Guideline |
|------|-----------|
| **Greetings** | General only. Never use member names. Always include exclamation. |
| **Emojis** | One per message, max two. Tasteful and relevant. |
| **All caps** | Never use for emphasis. |
| **Slang** | Never use "fam," "squad," "lit," etc. "Soul Food Family" is acceptable only in Day 0 welcome. |
| **Sign-off** | Always `— Lonell's Soul Food Cuisine` |
| **Opt-out** | Always `Reply STOP to opt out.` on its own line after signature |
| **Phone number** | Always include `[PHONE]` placeholder — replace with actual number |
| **Pricing language** | Always "complimentary," never "free" |
| **Reserve language** | Always offer "Walk in, or call [PHONE] to reserve" |

---

## Location & Website Policy

**Do NOT include full address or website in every message.**

| Element | Include? | Where | Why |
|---------|----------|-------|-----|
| **Full address** | **Day 0 only** | Welcome message | First touch, sets context for new subscribers |
| **Website** | **Never in SMS** | Review links only (Google/Yelp direct links) | Character waste; they already know your brand |
| **Phone number** | **Every message** | All messages | For reservations, directions, human contact |

**Rule:** Address or website in Day 0 only. Phone number in every message. Everything else is noise.

**Rationale:**
- SMS is 160 characters per segment — every extra character costs money and splits messages
- Dine-in guests already know your location from Google Maps, Yelp, their receipt, your signage
- Phone number is the bridge: they can call for directions, reservations, or questions
- "Lonell's Soul Food Cuisine" is the brand — the location is implied

**Exception:** If running outdoor ads, flyers, or social media driving cold traffic to text SOUL who have **never been to Lonell's**, include address in Day 0 only. After that, drop it.

---

## Contact Card (vCard) Strategy

### What It Is

A digital business card (vCard / .vcf file) delivered via MMS that subscribers save to their phone contacts. Once saved, your messages appear with your brand name, logo, and contact info instead of a raw phone number.

### Why It Matters for Lonell's

| Without Contact Card | With Contact Card |
|----------------------|-----------------|
| Messages from "+1-323-XXX-XXXX" | Messages from "Lonell's Soul Food" |
| Customer wonders "who is this?" | Instant brand recognition |
| Easy to ignore or delete | Trusted, familiar sender |
| Blends with spam | Stands out in the inbox |

**Psychological effect:** Moves your brand from "company texting me" to "friend in my contacts" — exactly where SMS loyalty should live.

### When to Send the Contact Card

| Timing | Rationale |
|--------|-----------|
| **Day 2 or 3 (NOT Day 0)** | Day 0 priority is the welcome reward. Day 1 is the review request. Contact card comes after they've engaged twice — they're warm, not cold. |
| **Before a major event** | "Save us now so you don't miss Jazz Wednesday this week." |
| **In a win-back campaign** | Re-establish the relationship with a personal touch. |
| **VIP milestone** | After 5+ visits, make it official. |

### What to Include in Lonell's Contact Card

| Field | Content | Why |
|-------|---------|-----|
| **Display Name** | `Lonell's Soul Food` | Clean, recognizable, fits in message preview |
| **Phone Number** | +1 (424) 295-8020 | Replies go to the right place |
| **Photo/Logo** | Lonell's logo (black script on white, or full logo) | Instant visual ID |
| **Tagline** | `Authentic Soul Food & Live Jazz in South LA` | Reinforces the brand promise |
| **Website** | `https://lonellssoulfood.com` | One-tap access to menu, events, reservations |
| **Email** | `info@lonellssoulfood.com` | For catering, private events, general inquiries |
| **Address** | Full Vermont Knolls address | One-tap directions via Maps |
| **Note** | `Text SOUL for exclusive offers. Jazz Wed/Fri, Karaoke Sat, Brunch Sun 1-5pm.` | Context + CTA |

### How to Deliver the Contact Card via Twilio

**Method: MMS with vCard attachment**

```
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

To: +1XXXYYYZZZZ
From: +1AAABBBCCCC
Body: Let's make it official! Save Lonell's to your contacts so you never miss jazz night or Sunday brunch. Tap the card below 📇
MediaUrl: https://lonells-cdn.com/assets/lonells-contact-card.vcf
```

**vCard file (.vcf) content:**

```vcf
BEGIN:VCARD
VERSION:3.0
FN:Lonell's Soul Food
ORG:Lonell's Soul Food Cuisine
TEL;TYPE=CELL:+14242958020
URL:https://lonellssoulfood.com
EMAIL:info@lonellssoulfood.com
ADR;TYPE=WORK:;;[Street Address];Los Angeles;CA;90044;USA
NOTE:Text SOUL for exclusive offers. Jazz Wed/Fri 6-9pm, Karaoke Sat 6-9pm, Brunch Sun 1-5pm. A Place of Love.
PHOTO;VALUE=URL:https://lonellssoulfood.com/logo-512x512.png
END:VCARD
```

**Twilio considerations:**
- MMS counts as **3 SMS segments** per recipient (higher cost)
- vCard must be hosted on a public HTTPS URL (Twilio fetches and attaches)
- File size: keep under 500KB for reliable delivery
- Test on iOS and Android — vCard rendering varies

### Alternative: Link-Based Contact Card (Lower Cost)

If MMS cost is a concern, send a short link to a mobile-optimized page:

```
Let's make it official! Save Lonell's to your contacts so you never miss jazz night or Sunday brunch. Tap here 📇

https://lonells.co/save
```

**The page at `lonells.co/save`:**
- Displays Lonell's logo large
- One-tap "Add to Contacts" button (generates vCard on the fly)
- Brief tagline and program benefits
- Links to menu, reservations, and event calendar

**Cost:** 1 SMS segment vs. 3 MMS segments. Better for budget-conscious launches.

### Contact Card Message Copy for Lonell's

**Day 2 or 3 Delivery:**

```
Let's make it official! Save Lonell's to your contacts so you never miss jazz night or Sunday brunch. Tap the card below 📇

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**Before Major Event:**

```
Jazz Wednesday is this week! Save Lonell's to your contacts now so our reminders don't get lost 📇

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

**VIP Milestone (After 5+ Visits):**

```
You're part of the family now. Save Lonell's to your contacts so we can keep you close 📇

— Lonell's Soul Food Cuisine
Reply STOP to opt out.
```

### Contact Card Best Practices Summary

| Practice | Implementation |
|----------|----------------|
| **Send early, not first** | Day 2 or 3, not Day 0 |
| **Keep it branded** | Logo, tagline, consistent colors |
| **Make it useful** | Phone, address, website, hours, email — all one-tap |
| **Reinforce the CTA** | Note field reminds them why they subscribed |
| **Resend strategically** | Before big events, to VIPs, in win-backs |
| **Track saves** | Use unique short links or MMS delivery receipts to measure engagement |
| **Don't overdo it** | One contact card per subscriber, maybe two if they got a new phone |

### Updated Message Flow with Contact Card

| Day | Touchpoint | Type |
|-----|-----------|------|
| 0 | Welcome + complimentary item | Automated SMS |
| 1 | Review request + next-visit incentive | Automated SMS |
| 2 | **Contact card delivery** | **Automated MMS or link** |
| 7 | Entertainment nudge (if no return) | Automated SMS |
| Weekly | Jazz or brunch broadcast | Scheduled SMS |
| 30 | Win-back offer (if lapsed) | Automated SMS |
| Annual | Birthday celebration | Automated SMS |
| Occasional | Contact card reminder before major event | Manual MMS or link |

---

## Owner Input Checklist

Before launching, the owner must provide:

- [ ] **Day 0 incentive:** What complimentary item for new signups? (dessert, side, drink)
- [ ] **30-day win-back incentive:** What offer for lapsed customers? (percentage off, BOGO, complimentary item)
- [ ] **30-day win-back duration:** How long is the offer valid? (7 days, 14 days, through end of month)
- [ ] **Phone number:** Restaurant reservation line for all messages
- [ ] **Google Review link:** Direct link to Google Business review page
- [ ] **Yelp Review link:** Direct link to Yelp review page
- [ ] **Weekly broadcast preference:** Wednesday jazz OR Sunday brunch as primary weekly send
- [ ] **Slow night:** Which night typically needs a push? (Tuesday, Thursday)
- [ ] **Slow night pricing:** What special pricing for slow night fill?
- [ ] **Contact card delivery method:** MMS with vCard attachment OR link-based landing page
- [ ] **Contact card logo file:** High-res square logo (512x512px minimum) for vCard photo field
- [ ] **Contact card tagline:** Confirm or revise `Authentic Soul Food & Live Jazz in South LA`

---

## Proven Benchmarks

| Metric | Target | Source |
|--------|--------|--------|
| SMS enrollment rate | 25%+ of dine-in guests | Industry benchmark |
| Redemption rate | 20-40% | Healthy restaurant range |
| Win-back conversion | 5-7% at 30 days | Proven case study |
| Revenue contribution | 10-20% of monthly sales | Thai chain case study |
| Program ROI | 5:1 minimum, 12:1 achievable | Fast-casual case study |
| Unsubscribe rate | <3% monthly | Frequency cap enforcement |
| Optimal frequency | 2 messages/month ideal | SimpleLoyalty 2026 analysis |
| Contact card save rate | 40-60% of subscribers | Postscript industry data |

---

## Staff Script (Register / Table Touch)

> *"Welcome to Lonell's. Are you in our Soul Food Family text club? Scan here, text SOUL, and a complimentary [ITEM] is on us today. We'll text you tomorrow to share your experience — do that, and a complimentary side is waiting on your next visit. Plus we send one message a week about jazz nights and brunch. No spam, just the good stuff."*

---

## Technical Setup Notes

- **Platform:** Twilio (already configured — Account SID, Auth Token, From Number +1 (424) 295-8020)
- **QR codes:** Generate unique codes for table tents and register signs, linked to keyword opt-in
- **Segmentation:** Tag by visit frequency, event attendance (brunch vs. jazz vs. karaoke), review status, birthday month
- **Compliance:** Document opt-in consent, include STOP instructions on every message, maintain opt-out suppression list
- **Tracking:** Monitor enrollment rate, redemption rate, review completion rate, win-back conversion, unsubscribe rate monthly
- **Contact card hosting:** Host vCard file on CDN (Vercel public assets or separate CDN) with public HTTPS URL for Twilio MMS delivery
- **Contact card link page:** If using link-based method, build mobile-optimized landing page with one-tap vCard download

---

## Implementation Status

| Component | Status | File(s) |
|-----------|--------|---------|
| Keyword routing (SOUL, STOP, HELP, MENU, EVENTS) | ✅ Complete | `src/lib/sms.ts` |
| Twilio webhook | ✅ Complete | `src/pages/api/sms-webhook.ts` |
| Web form subscribe | ✅ Complete | `src/pages/api/sms-subscribe.ts` |
| Delivery status callback | ✅ Complete | `src/pages/api/sms-status-callback.ts` |
| DB schema (subscribers, messages) | ✅ Complete | `src/db/schema.ts` |
| SMS_ENABLED flag with simulation | ✅ Complete | `src/lib/sms.ts` |
| Admin settings page | ✅ Complete | `src/pages/admin/settings.astro` |
| Day 1 review request automation | ❌ Not built | `src/lib/sms.ts` — new flow |
| Day 7 entertainment nudge | ❌ Not built | `src/lib/sms.ts` — new flow |
| 30-day win-back automation | ❌ Not built | `src/lib/sms.ts` — new flow |
| Birthday automation | ❌ Not built | Schema + `src/lib/sms.ts` |
| Weekly broadcast system | ❌ Not built | Scheduled send mechanism |
| Contact card (vCard) delivery | ❌ Not built | MMS attachment + vCard file |
| Contact card landing page | ❌ Not built | Mobile-optimized page |
| Birthday field in subscriber schema | ❌ Not built | Schema migration |
| Visit tracking for nudge logic | ❌ Not built | Visit detection mechanism |

See [HANDOFF.md](./HANDOFF.md) for the implementation roadmap and [conversion-optimization-plan.md](./conversion-optimization-plan.md) for phased prioritization.
