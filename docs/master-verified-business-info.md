# Master Verified Business Info — Lonell's Soul Food Cuisine

> **Source of truth for client-provided facts.** Use this document when updating the website, schema.org markup, GBP, SMS copy, and menu data.
>
> **Last verified:** June 10, 2026  
> **Primary source:** Client-provided official print menu PDF — `11x8.5_DINNER_print.pdf` (2 pages: back cover + dinner menu)  
> **Client note:** Pricing in the PDF reflects **old prices** and will be updated. Treat menu item names, categories, availability rules, and business details as verified; treat all dollar amounts as **reference only** until the client confirms new pricing.

---

## Business Identity

| Field | Verified Value |
|-------|----------------|
| **Legal / Brand Name** | Lonell's Soul Food Cuisine |
| **Tagline** | A Place of Love |
| **Cuisine** | Soul Food / Southern |
| **Address** | 8501 S. Vermont Ave., Los Angeles, CA 90044 |
| **Phone** | (323) 451-3104 |
| **Email** | reservations@lonells.com |
| **Website** | www.lonells.com |

---

## Hours of Operation

From official print menu (page 1 — "Our Schedule"):

| Day | Hours |
|-----|-------|
| Monday | **Closed** |
| Tuesday – Thursday | 11:00 AM – 7:00 PM |
| Friday – Saturday | 11:00 AM – 9:00 PM |
| Sunday | 11:00 AM – 5:00 PM |

### ⚠️ Discrepancy — confirm with client

The live website currently lists **Tuesday as closed** (open Wed–Sun only). The official print menu shows **Tuesday open** with the same hours as Wed–Thu. Confirm which schedule is current before updating site/schema/GBP.

---

## Event Spaces

From official print menu (page 1 — "Event Spaces"):

| Space | Max Capacity |
|-------|--------------|
| Dining Room | 50 |
| Small Room | 50 |

- Booking: **Now Booking**
- Contact: reservations@lonells.com · (323) 451-3104

### ⚠️ Discrepancy — confirm with client

The website currently references **"Smoking Room"** and **"Small Room"** (not "Dining Room"). Confirm the correct room names.

---

## Social Media

From official print menu (page 1):

| Platform | Handle |
|----------|--------|
| Facebook | lonellssoulfood |
| Instagram | lonells soul food cuisine |
| TikTok | lonells soul food cuisine |

---

## Policies & Promotions

From official print menu (page 2):

- **10% discount** to Seniors and Government Workers (with valid ID)

---

## Official Dinner Menu

From official print menu (page 2). All dinner entrees include **2 sides & cornbread** unless noted as à la carte.

> **Pricing status:** All prices below are from the client's official print file and are **outdated per client**. Do not sync these to the website without updated pricing confirmation.

### Dinner Plates

| Item | Price (PDF) | Availability / Notes |
|------|-------------|----------------------|
| Baked Chicken or Fried Chicken | $26.00 | — |
| Meatloaf | $23.00 | — |
| Oxtails | $35.00 | **Thursday – Sunday only** |
| Pork Chop (Cooked to Order) | $26.00 | — |
| Turkey Chop (Cooked to Order) | $30.00 | — |
| Catfish | $27.00 | — |
| Brisket | $26.00 | — |
| Short Ribs | $30.00 | **Friday & Saturday only** |
| Salmon | $27.00 | — |

### Proteins (À La Carte)

No sides included.

| Item | Price (PDF) | Availability / Notes |
|------|-------------|----------------------|
| Baked Chicken or Fried Chicken | $15.00 | — |
| Meatloaf | $12.00 | — |
| Oxtails | $24.00 | — |
| Pork Chop (Cooked to Order) | $14.00 | — |
| Turkey Chop (Cooked to Order) | $16.00 | — |
| Catfish | $17.00 | — |
| Short Ribs | $20.00 | **Friday & Saturday only** |
| Brisket | $18.00 | — |

### Sides

| Item | Price (PDF) |
|------|-------------|
| String Beans | $6.00 |
| Collard Greens | $8.00 |
| Red Beans & Rice | $9.00 |
| Mac and Cheese | $9.00 |
| Cabbage | $8.00 |
| Yams | $9.00 |
| Mashed Potatoes | $6.00 |
| Hot Water Cornbread (2) | $5.00 |
| Cornbread (1) | $3.50 |

### Beverages

| Item | Price (PDF) | Notes |
|------|-------------|-------|
| Drinks (Coke Products) | $3.00 | — |
| Muddy Water | $4.00 | House specialty |
| Lemonade | $3.50 | — |

### Desserts (By the Slice)

| Item | Price (PDF) |
|------|-------------|
| Pound Cake | $5.00 |
| Peach Cobbler | $7.00 |
| Banana Pudding | $6.00 |

---

## Items on Website Not in Official Dinner PDF

The official PDF covers **dinner only** (back cover + dinner menu). Previously listed **Lunch Specials** and **Lunch Menu** categories were **removed from the site on June 10, 2026** pending official lunch menu confirmation/documentation from the client.

---

## Website vs. PDF — Quick Reference

Use when reconciling `src/pages/menu.astro`, `src/data/menu.ts`, and schema markup.

| Topic | Official PDF | Current Website | Action |
|-------|--------------|-----------------|--------|
| Tuesday hours | Open 11am–7pm | Was Closed | **Fixed — now Open Tue–Sun** |
| Event room name | Dining Room | Was Smoking Room | **Fixed — now Dining Room** |
| Dinner prices | See tables above (old) | Higher prices in `menu.astro` | **Await updated pricing** |
| Oxtails availability | Thu–Sun (dinner plate) | Was listed without day restriction | **Fixed — updated to Thu–Sun** |
| Pork Chop / Turkey Chop name | Singular "Pork Chop", "Turkey Chop" | Was plural "Pork Chops", "Turkey Chops" | **Fixed — dinner section now singular** |
| Senior/gov discount | 10% with ID | Was "10% off for seniors every Sunday" | **Fixed — includes gov workers, any day** |
| Lunch menu | Not in PDF | Full lunch sections on site | **Removed — pending official lunch menu from client** |

---

## SMS / Marketing (from project rules — not in PDF)

| Field | Value |
|-------|-------|
| SMS keyword | SOUL |
| Promo code | SOUL10 |
| Manager phone | (323) 451-3104 |

---

## Source File

- **Original:** `/Volumes/Samsung USB/Mini -Offload/Chrome Downloads/11x8.5_DINNER_print.pdf`
- **Format:** 11×8.5" print-ready, 2 pages (image-based; text extracted via OCR June 10, 2026)
- **Page 1:** Branding, hours, event spaces, contact, social, address
- **Page 2:** Dinner menu, sides, beverages, desserts, senior/gov discount

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-10 | Initial master doc created from client official dinner print PDF. Prices flagged as outdated per client. |
| 2026-06-10 | Aligned website to official data: Tuesday hours changed to OPEN 11am–7pm across footer, contact, events, FAQ, and schema; "Smoking Room" → "Dining Room" on private events, FAQ, events page, and schema; Oxtails now listed with "Thursday–Sunday only" on dinner plates; "Pork Chops" → "Pork Chop" and "Turkey Chops" → "Turkey Chop" (singular) in dinner section; senior discount expanded to include government workers with ID; Lunch Specials subtitle updated from Wed-Thu to Tue-Thu. Prices remain unmodified (awaiting client update). |
| 2026-06-10 | **Removed** "Lunch Specials" and "Lunch Menu" sections from the site entirely — not present in the official dinner PDF. Will reinstate when client provides a lunch menu file. |
