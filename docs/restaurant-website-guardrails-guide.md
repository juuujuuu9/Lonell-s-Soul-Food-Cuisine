# Independent Restaurant Website Development Guardrails & Guidelines
## Conversion-First Playbook for Direct Orders & Phone Calls

**Version:** 1.0  
**Last Updated:** June 2026  
**Audience:** Independent restaurant owners, web developers, and marketing teams  
**Goal:** Maximize direct online orders, phone call-ins, and SMS loyalty program sign-ups through a conversion-optimized web presence.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Mobile-First Architecture](#2-mobile-first-architecture)
3. [Navigation & Information Architecture](#3-navigation--information-architecture)
4. [Menu Design Standards](#4-menu-design-standards)
5. [Call-to-Action (CTA) Strategy](#5-call-to-action-cta-strategy)
6. [Direct Online Ordering](#6-direct-online-ordering)
7. [Phone Order Optimization](#7-phone-order-optimization)
8. [Trust Signals & Social Proof](#8-trust-signals--social-proof)
9. [SMS Loyalty Program Integration](#9-sms-loyalty-program-integration)
10. [Local SEO & AI Search Readiness](#10-local-seo--ai-search-readiness)
11. [Chat & Automation](#11-chat--automation)
12. [Personalization & Behavioral Targeting](#12-personalization--behavioral-targeting)
13. [Performance & Technical Standards](#13-performance--technical-standards)
14. [Analytics & KPIs](#14-analytics--kpis)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Anti-Patterns & What to Avoid](#16-anti-patterns--what-to-avoid)

---

## 1. Core Philosophy

### The Golden Rule
> **Every element on your website must either remove friction, build trust, or capture customer contact data for retention.**

Your website is not a digital brochure. It is a **conversion engine** designed to turn hungry visitors into paying customers — either through direct online orders or phone call-ins. Every decision must serve this purpose.

### Key Principles
| Principle | Description |
|-----------|-------------|
| **Mobile-First** | Design for thumb navigation before mouse clicks. Over 60% of restaurant traffic is mobile. |
| **Speed Over Beauty** | A fast, functional site beats a slow, beautiful one. Load time under 3 seconds is mandatory. |
| **Direct Over Third-Party** | Prioritize first-party orders. Use dynamic pricing on marketplace apps to incentivize direct ordering. |
| **Frictionless Checkout** | Minimize clicks, fields, and decisions between "I'm hungry" and "Order confirmed." |
| **Data Capture for Retention** | Capture emails and phone numbers at every opportunity to fuel your SMS loyalty program. |

---

## 2. Mobile-First Architecture

### 2.1 Responsive Breakpoints
| Breakpoint | Target Devices | Key Considerations |
|------------|---------------|-------------------|
| **320px–480px** | Small smartphones | Single-column layout, thumb-friendly tap targets (min 44×44px) |
| **481px–768px** | Large phones, small tablets | Two-column grids for menu items, expanded navigation |
| **769px–1024px** | Tablets, small laptops | Full navigation, side-by-side content sections |
| **1025px+** | Desktops | Full experience, hover states, expanded imagery |

### 2.2 Touch Target Standards
- **Minimum tap target size:** 44×44 CSS pixels (Apple HIG) or 48×48dp (Material Design)
- **Spacing between interactive elements:** Minimum 8px
- **Primary CTA height:** 56–64px on mobile for thumb reachability

### 2.3 Thumb Zone Optimization
Design the most critical actions within the **natural thumb zone** (bottom-center of the screen on mobile):
- Primary "Order" or "Call" button
- "Add to Cart" actions
- SMS loyalty sign-up field

### 2.4 Mobile Performance Budget
| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.0s | 1.5s |
| Largest Contentful Paint (LCP) | < 2.0s | 2.5s |
| Time to Interactive (TTI) | < 3.0s | 4.0s |
| Total Page Weight (mobile) | < 1.5 MB | 2.0 MB |
| Image format | WebP with JPEG fallback | — |
| Font loading | `font-display: swap` | — |

---

## 3. Navigation & Information Architecture

### 3.1 Header Structure (Sticky on Mobile)
```
[Logo] ── [Phone Icon] ── [Order Button]
         (tap-to-call)   (primary CTA)
```

**Rules:**
- Header must be **sticky** on mobile (remains visible on scroll)
- Logo links to homepage
- Phone icon triggers `tel:` protocol immediately
- Order button is the **most visually prominent** element (high contrast, bold)

### 3.2 Primary Navigation Order
1. **Menu** (not "Our Menu" — just "Menu")
2. **Order Online** (or "Order Now")
3. **Call to Order** (if phone orders are primary)
4. **About / Story** (builds trust)
5. **Catering / Events** (if applicable)
6. **Contact / Location**

**Avoid:** Dropdowns deeper than 1 level on mobile. Use accordion patterns instead.

### 3.3 Footer Requirements
- Full address with embedded Google Maps link
- Phone number (clickable)
- Hours of operation (current day highlighted)
- Links to: Privacy Policy, SMS Terms & Conditions, Accessibility Statement
- Social media icons (open in new tab)
- Google Review link (direct deep link)

### 3.4 Page Load Sequence Priority
Load content in this order:
1. Header with CTA and phone number
2. Hero image / value proposition
3. Menu categories or featured items
4. Social proof (reviews, ratings)
5. Footer information
6. Non-critical widgets (chat, analytics, etc.)

---

## 4. Menu Design Standards

### 4.1 HTML Menus Over PDFs (Mandatory)

**PDF menus are prohibited.** They are:
- Unsearchable by Google
- Slow to load on mobile
- Require pinch-zoom navigation
- Not accessible to screen readers
- Not trackable for analytics

**HTML Menu Structure:**
```html
<section class="menu-category" id="appetizers">
  <h2>Appetizers</h2>
  <div class="menu-grid">
    <article class="menu-item" itemscope itemtype="https://schema.org/MenuItem">
      <img src="dish-name.webp" alt="[Dish Name] — [Brief Description]" loading="lazy">
      <div class="item-details">
        <h3 itemprop="name">Dish Name</h3>
        <p itemprop="description">Brief, appetizing description (max 20 words)</p>
        <span class="price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <span itemprop="price">$14.00</span>
        </span>
        <button class="add-to-order">Add to Order</button>
      </div>
    </article>
  </div>
</section>
```

### 4.2 Menu Item Page Standards
Create **individual landing pages** for top 10–15 dishes. Each page must include:
- High-quality hero image (1200×800px, WebP, <200KB)
- Dish name as H1 with local SEO keywords (e.g., "Best Chicken Tikka Masala in [City]")
- Price and customization options
- "Add to Order" button (sticky on mobile)
- 2–3 customer reviews specific to this dish
- Dietary tags (Vegan, Gluten-Free, Spicy, etc.)
- Schema.org MenuItem markup

### 4.3 Menu Category Navigation
- **Sticky category tabs** on mobile (scroll horizontally)
- **Jump links** from category list to sections
- **Search/filter** by dietary restriction, price range, or popularity
- **"Most Popular" or "Chef's Pick"** badges on 3–5 items

### 4.4 Photography Guidelines
| Aspect | Standard |
|--------|----------|
| **Style** | Natural lighting, 45-degree angle, shallow depth of field |
| **Background** | Clean, contextually relevant (table setting, kitchen elements) |
| **Consistency** | Same lighting, angle, and editing style across all photos |
| **Resolution** | 1200×800px minimum, 2× for retina displays |
| **Format** | WebP primary, JPEG fallback |
| **Compression** | Target <200KB per image without visible quality loss |
| **Alt text** | Descriptive, include dish name and key ingredients |

---

## 5. Call-to-Action (CTA) Strategy

### 5.1 CTA Hierarchy

| Priority | CTA | Placement | Visual Treatment |
|----------|-----|-----------|-----------------|
| **1** | "Order Online" | Header (sticky), hero section, menu pages | Solid, high-contrast color, 56px+ height |
| **2** | "Call to Order" | Header, menu pages, footer | Outline or secondary color, phone icon |
| **3** | "Join Rewards" | Header banner, checkout, exit-intent | Accent color, gift/heart icon |
| **4** | "View Full Menu" | Hero section, homepage | Text link or subtle button |

### 5.2 CTA Copy Rules
- **Use action verbs:** "Order Now," "Call Us," "Get 10% Off" — never "Submit" or "Click Here"
- **Lead with value:** "Order Direct & Save" beats "Online Ordering"
- **Create urgency sparingly:** "Order by 2 PM for Lunch Delivery" — not fake scarcity
- **Localize:** "Order [Cuisine] in [City]" for SEO and relevance

### 5.3 Button Design Standards
```css
.primary-cta {
  background-color: #FF4500; /* High-contrast brand color */
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  padding: 16px 32px;
  border-radius: 8px;
  min-height: 56px;
  width: 100%; /* Full-width on mobile */
  text-transform: none; /* Sentence case reads better */
  letter-spacing: 0.5px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.primary-cta:active {
  transform: scale(0.98); /* Tactile feedback */
}
```

### 5.4 Hero Section CTA Placement
- **Above the fold** on all devices (no scrolling required)
- **Single primary CTA** — never two equal-weight buttons side-by-side
- **Secondary actions** (phone, menu) as smaller, lower-contrast options below
- **Background image** must have dark overlay or sufficient contrast for text readability (WCAG AA minimum)

---

## 6. Direct Online Ordering

### 6.1 Platform Selection Criteria
| Feature | Required | Preferred |
|---------|----------|-----------|
| Commission-free or flat fee | ✅ | — |
| White-label (your branding) | ✅ | — |
| Mobile-optimized checkout | ✅ | — |
| Guest checkout (no account required) | ✅ | — |
| SMS/email order notifications | ✅ | — |
| Integration with POS system | — | ✅ |
| Loyalty program integration | — | ✅ |
| Multi-location support | — | ✅ (if applicable) |

**Recommended platforms:** Toast, ChowNow, Square Online, GloriaFood, or custom build with Stripe + SMS API.

### 6.2 Checkout Flow Guardrails
1. **Guest checkout by default** — Account creation optional, presented *after* order completion
2. **Maximum 3 steps:** Cart → Contact/Delivery → Payment
3. **Auto-fill** address and phone from browser/Google Autocomplete
4. **Real-time delivery zone validation** — don't let users complete checkout if undeliverable
5. **Order summary** visible at all times (sticky on mobile)
6. **Clear delivery/pickup time estimate** before payment
7. **Multiple payment options:** Credit card, Apple Pay, Google Pay, cash on pickup

### 6.3 Cart Abandonment Recovery
- **Exit-intent popup:** "Complete your order in the next 10 minutes for free delivery"
- **SMS reminder** (if phone captured): "Your [Restaurant] cart is waiting. Finish your order: [link]"
- **Email reminder** (if email captured): Send within 1 hour, then 24 hours
- **Retargeting pixel:** Facebook/Instagram ads for abandoned cart visitors

### 6.4 Dynamic Pricing Strategy
- **Website prices:** Base price (lowest)
- **Third-party apps (DoorDash, Uber Eats):** Base price + 15–25% to offset commission
- **Display on website:** "Order direct and save vs. delivery apps" (subtle, not aggressive)
- **Transparency:** Never hide fees. Show tax, delivery fee, and tip calculator upfront.

---

## 7. Phone Order Optimization

### 7.1 Phone Number Visibility Rules
- **Header:** Clickable phone icon + number (sticky on mobile)
- **Footer:** Full number with `tel:` link
- **Menu pages:** "Questions? Call us: [Number]" near complex or customizable items
- **Checkout:** "Prefer to order by phone? Call [Number]" as alternative
- **Google Business Profile:** Primary phone number must match website exactly

### 7.2 Click-to-Call Implementation
```html
<a href="tel:+1-555-123-4567" class="call-button" aria-label="Call Restaurant Name to place an order">
  <svg><!-- Phone icon --></svg>
  <span>(555) 123-4567</span>
</a>
```

**Behavior:**
- On mobile: Triggers native phone dialer immediately
- On desktop: Displays number prominently; optional "Click to copy" functionality

### 7.3 Call Experience Optimization
- **Answer within 3 rings** during business hours
- **Train staff** to upsell: "Would you like to add a drink/dessert to that?"
- **Repeat order back** for accuracy
- **Provide estimated ready time** before ending call
- **Capture phone number** for SMS loyalty program enrollment ("Can we text you when it's ready and send you exclusive offers?")

### 7.4 Tracking Phone Orders from Website
- Use a **unique tracking phone number** on the website (via call tracking service like CallRail)
- Track: Call volume, duration, time of day, and conversion to placed order
- Compare with organic call volume to measure website ROI

---

## 8. Trust Signals & Social Proof

### 8.1 Review Integration
- **Display live Google/Yelp ratings** in header or hero section (e.g., "4.8 ★ on Google — 247 Reviews")
- **Embed 3–5 recent reviews** on homepage with attribution
- **Link to full review profiles** (open in new tab)
- **Respond to every review** within 48 hours — positive and negative

### 8.2 Review Request Automation
- **Post-order SMS:** "Enjoy your meal? Leave us a review and get $5 off your next order: [Google Review Link]"
- **Email follow-up:** 24 hours after delivery/pickup
- **In-person:** QR code on receipt linking to review page
- **Target:** 1 new review per week minimum to maintain ranking velocity

### 8.3 Trust Badges & Credentials
Display prominently (homepage, checkout):
- "Family Owned Since [Year]"
- "Locally Sourced Ingredients" (if applicable)
- Health inspection grade (A+/100%)
- "Secure Checkout" badge (SSL/PCI compliance)
- Delivery time reliability stats ("95% on-time delivery")

### 8.4 User-Generated Content (UGC)
- **Instagram feed** embedded on homepage (moderated, 6–9 recent posts)
- **Customer photo gallery** with permission
- **"As seen on"** local media mentions or food blogger features
- **Staff photos** with names and roles (humanizes the brand)

---

## 9. SMS Loyalty Program Integration

### 9.1 Sign-Up Touchpoints

| Location | Trigger | Offer | Fields Required |
|----------|---------|-------|-----------------|
| **Header banner** | Page load | "Join & Get 10% Off" | Phone number only |
| **Hero section** | Page load | "Text REWARDS to [Number]" | None (text-to-join) |
| **Checkout** | Pre-payment | "Get order updates + points" | Checkbox (pre-checked) |
| **Exit-intent** | Mouse out / scroll up | "Wait! Get 10% off your first order" | Phone number |
| **Receipt** | Post-purchase | "Text [Keyword] to join" | None |
| **In-store** | QR code on table/tent | "Scan to join rewards" | Phone number |

### 9.2 SMS Opt-In Compliance (TCPA/GDPR)
- **Explicit consent required:** Checkbox cannot be pre-checked for marketing messages (only for transactional)
- **Clear value proposition:** State exactly what they'll receive ("Weekly deals, new menu alerts, birthday rewards")
- **Frequency disclosure:** "Expect 2–4 messages per month"
- **Opt-out instructions:** "Reply STOP to unsubscribe" in every message
- **Privacy policy link:** Accessible from sign-up form and first SMS
- **Age verification:** "Must be 18+ to join" if applicable

### 9.3 Progressive Profiling Post-Opt-In
After initial SMS opt-in, collect data over time (never all at once):

| Message # | Data Request | Incentive |
|-----------|--------------|-----------|
| 1 (Welcome) | First name | "Welcome, [Name]! Here's your 10% off code: WELCOME10" |
| 2 (Week 2) | Birthday (month/day) | "We'd love to celebrate with you! Reply with your birthday for a free appetizer" |
| 3 (Week 4) | Favorite cuisine type | "Help us personalize your deals. Reply: 1=Italian, 2=Mexican, 3=Asian, 4=All" |
| 4 (Ongoing) | Order frequency | "How often do you dine out? Reply: 1=Weekly, 2=Monthly, 3=Special occasions" |

### 9.4 SMS Automation Flows

**Welcome Series (New Member):**
```
Day 0: Welcome + first-order discount code
Day 3: "Haven't ordered yet? Your 10% off expires in 24 hours"
Day 7: Menu highlight: "Try our #1 bestseller — [Dish]"
Day 14: Social proof: "Join 500+ locals who love our [Signature Item]"
```

**Post-Order Series:**
```
Immediate: Order confirmation + points earned ("You earned 45 points! 205 to a free appetizer")
30 min after delivery: "How was your meal? Reply 1-5"
24 hours: Review request with link
7 days: "Craving [last ordered item]? Order again and earn double points this week"
```

**Re-engagement (30+ days inactive):**
```
Day 30: "We miss you! Come back for 15% off your next order: COMEBACK15"
Day 60: "It's been a while — here's a free dessert on us: FREEDESSERT"
Day 90: "We'd love your feedback. Reply with why you haven't visited lately"
```

### 9.5 SMS Content Best Practices
- **Character limit:** Under 160 characters when possible (single SMS segment)
- **Personalization:** Use first name and reference past orders
- **Clear CTA:** Single action per message with short link
- **Timing:** Lunch deals at 10:30 AM, dinner deals at 3:30 PM, never after 9 PM
- **Value-first:** Every message must offer clear value (discount, new menu, event)

---

## 10. Local SEO & AI Search Readiness

### 10.1 On-Page SEO Requirements

**Title Tag Formula:**
```
[Restaurant Name] | [Cuisine Type] in [City] | [Value Prop]
Example: "Mama's Trattoria | Authentic Italian in Austin | Order Direct & Save"
```

**Meta Description Formula:**
```
[Value prop] + [Cuisine] + [Location] + [CTA] + [Phone]
Example: "Family-owned Italian restaurant in Austin serving handmade pasta since 1998. Order online or call (555) 123-4567 for pickup and delivery."
```

**H1 Tags:** Every page must have one unique H1 containing primary keywords:
- Homepage: "[Restaurant Name] — [Cuisine] Restaurant in [City]"
- Menu page: "Menu — [Cuisine] Dishes in [City]"
- Dish pages: "[Dish Name] — Best [Cuisine] in [City]"

### 10.2 Schema.org Markup (Mandatory)
Implement structured data on every page:

**Restaurant Schema (Homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Restaurant Name",
  "image": "https://example.com/hero.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78701"
  },
  "telephone": "+1-555-123-4567",
  "priceRange": "$$",
  "servesCuisine": "Italian",
  "openingHours": ["Mo-Sa 11:00-22:00", "Su 12:00-21:00"],
  "menu": "https://example.com/menu",
  "acceptsReservations": "true",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247"
  }
}
```

**MenuItem Schema (Dish Pages):**
```json
{
  "@context": "https://schema.org",
  "@type": "MenuItem",
  "name": "Chicken Tikka Masala",
  "description": "Tender chicken in creamy tomato curry with aromatic spices",
  "offers": {
    "@type": "Offer",
    "price": "18.00",
    "priceCurrency": "USD"
  },
  "suitableForDiet": "https://schema.org/GlutenFreeDiet"
}
```

### 10.3 Google Business Profile (GBP) Optimization
- **Primary category:** Most specific (e.g., "Italian Restaurant" not just "Restaurant")
- **Secondary categories:** "Caterer," "Delivery Restaurant," "Family Restaurant"
- **Menu link:** Direct to your HTML menu page (not third-party app)
- **Order link:** Direct to your ordering platform (not DoorDash/Uber Eats)
- **Photos:** Upload 10+ high-quality images monthly (food, interior, staff, exterior)
- **Posts:** Weekly updates (specials, events, new menu items) with CTA buttons
- **Q&A:** Pre-populate common questions and monitor for new ones
- **Reviews:** Respond to 100% of reviews within 48 hours

### 10.4 AI Search Optimization (2026 Critical)
AI assistants (ChatGPT, Claude, Google SGE, Perplexity) are increasingly how people find restaurants. Optimize for them:

**FAQ Content Strategy:**
Create an FAQ page answering these questions in natural language:
- "What are the best Italian restaurants in [City]?"
- "Does [Restaurant Name] offer gluten-free options?"
- "What are [Restaurant Name]'s hours?"
- "Does [Restaurant Name] do catering?"
- "How do I order from [Restaurant Name] online?"

**Format:** Question as H2, answer in 40–60 words of natural, conversational text. Include your restaurant name and location in every answer.

**Content Freshness:** Update menu pages, hours, and specials weekly. AI search favors recently updated content.

### 10.5 Citation Consistency (NAP)
Your Name, Address, and Phone number must be **identical** across:
- Website
- Google Business Profile
- Yelp
- Facebook
- Apple Maps
- Bing Places
- All delivery app profiles
- Local directories (Chamber of Commerce, etc.)

**Use a spreadsheet** to track and audit quarterly.

---

## 11. Chat & Automation

### 11.1 Chat Widget Placement & Timing
| Parameter | Standard |
|-----------|----------|
| **Position** | Bottom-right corner (desktop and mobile) |
| **Trigger delay** | 15–40 seconds after page load, or on scroll depth (50%) |
| **Pages** | All except checkout (to prevent distraction) |
| **Mobile behavior** | Collapsible, does not block primary CTA |
| **Offline hours** | Show "Leave a message" form, not "We're offline" |

### 11.2 Chat Conversation Flow
```
Bot: "Hi! What brings you here today?"
[Buttons: Order / Question / Catering / Feedback]

→ Order: "Great! Order online for fastest service: [Link] or call (555) 123-4567"
→ Question: "What's your question? I'll connect you with a human if needed."
→ Catering: "For catering orders over $200, a team member will assist you. Leave your number:"
→ Feedback: "We'd love to hear from you! Share your experience:"
```

### 11.3 Escalation Rules
- **Complex orders:** Auto-escalate to human after 2 bot exchanges
- **Catering inquiries:** Immediate human routing
- **Complaints:** Immediate human routing with manager notification
- **Response time promise:** "A human typically replies in under 2 minutes"

### 11.4 Chat Data Capture
Every chat interaction should capture:
- Phone number (for SMS loyalty follow-up)
- Email (if provided)
- Conversation topic (tagged for analytics)
- Resolution status (resolved by bot / escalated / pending)

---

## 12. Personalization & Behavioral Targeting

### 12.1 Returning Visitor Experience
- **"Order Again" section:** Display last 3 orders prominently on homepage
- **Favorite items:** Show most-ordered dishes at top of menu
- **Loyalty status:** Display points balance and next reward in header
- **Personalized greeting:** "Welcome back, [Name]! Your usual is ready in 2 clicks."

### 12.2 Time-Based Personalization
| Time | Content Shown |
|------|---------------|
| 7:00–10:30 AM | Breakfast menu, brunch specials, coffee promotions |
| 10:30 AM–2:00 PM | Lunch combos, express lunch, corporate catering |
| 2:00–5:00 PM | Afternoon snacks, happy hour, early dinner prep |
| 5:00–9:00 PM | Dinner menu, family meals, date night specials |
| 9:00 PM–Close | Late-night menu, dessert, next-day pre-orders |
| Closed hours | "Pre-order for tomorrow," hours display, catering inquiry |

### 12.3 Location-Based Targeting
- **In delivery zone:** Show delivery option, estimated time, free delivery threshold
- **Out of delivery zone:** Show pickup option, directions, "Catering available for your area"
- **Geo-fenced SMS:** Send push notification when loyal customer is within 0.5 miles ("You're nearby! Order ahead and skip the line")

### 12.4 Segmentation for SMS Campaigns
| Segment | Trigger | SMS Content |
|---------|---------|-------------|
| **New customers** | First order completed | Welcome series, education about menu |
| **Regulars** | 3+ orders in 30 days | VIP early access to new items, double points |
| **Lapsed** | 30+ days no order | Win-back offer, "We miss you" |
| **High AOV** | Average order >$50 | Upsell catering, premium items, event invites |
| **Dietary-specific** | Ordered vegan/gluten-free 2+ times | New menu items matching their preference |
| **Birthday** | Birthday month | Free item, birthday discount, celebration message |

---

## 13. Performance & Technical Standards

### 13.1 Hosting & Infrastructure
- **CDN required:** Cloudflare, Fastly, or AWS CloudFront
- **SSL certificate:** Let's Encrypt or commercial, auto-renewing
- **Uptime SLA:** 99.9% minimum (downtime during lunch rush = lost revenue)
- **Server location:** As close to primary customer base as possible
- **Auto-scaling:** Handle 10× traffic spikes (viral post, local news feature)

### 13.2 Image Optimization Pipeline
1. **Source:** High-res originals (3000×2000px minimum)
2. **Resize:** Generate 5 sizes (300, 600, 900, 1200, 1800px width)
3. **Format:** WebP primary, JPEG fallback for older browsers
4. **Lazy loading:** `loading="lazy"` on all below-fold images
5. **Preload:** Hero image only (`<link rel="preload">`)
6. **Compression:** Target 60–80% quality, <200KB per image

### 13.3 Third-Party Script Management
- **Maximum 5 third-party scripts** on any page (analytics, chat, ordering, reviews, ads)
- **Async loading:** All non-critical scripts loaded with `async` or `defer`
- **Consent management:** GDPR/CCPA cookie banner for tracking scripts
- **Performance budget:** Third-party scripts must not add >500ms to TTI

### 13.4 Accessibility (WCAG 2.1 AA)
- **Color contrast:** 4.5:1 for normal text, 3:1 for large text/UI components
- **Keyboard navigation:** All interactive elements accessible via Tab key
- **Screen reader support:** Alt text on images, ARIA labels on buttons, semantic HTML
- **Focus indicators:** Visible outline on all interactive elements
- **Form labels:** Every input has associated `<label>`
- **Error messages:** Clear, specific, and associated with the offending field

### 13.5 Security Requirements
- **HTTPS everywhere:** No mixed content (HTTP resources on HTTPS page)
- **PCI DSS compliance:** If handling payments directly (prefer hosted checkout pages)
- **Form validation:** Client-side for UX, server-side for security
- **Rate limiting:** Prevent SMS sign-up abuse (max 3 attempts per IP per hour)
- **Data encryption:** Customer PII (phone, email, address) encrypted at rest

---

## 14. Analytics & KPIs

### 14.1 Primary KPIs (Weekly Tracking)

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Direct order share** | >60% of total orders | (Direct orders / Total orders) × 100 |
| **Mobile conversion rate** | >3% | Mobile orders / Mobile sessions |
| **Desktop conversion rate** | >4% | Desktop orders / Desktop sessions |
| **SMS opt-in rate** | >15% of checkout users | SMS sign-ups / Total checkouts |
| **Cart abandonment rate** | <65% | (Carts created - Orders placed) / Carts created |
| **Average order value (AOV)** | Grow 5% QoQ | Total revenue / Number of orders |
| **Phone call volume** | Track trend | Call tracking number analytics |
| **Website load time (LCP)** | <2.5s | Google PageSpeed Insights |
| **Google review velocity** | 1+ per week | New reviews / 7 days |
| **Local search ranking** | Top 3 for "[cuisine] near me" | Manual search + rank tracking tool |

### 14.2 Secondary KPIs (Monthly Tracking)
- **Return visitor rate:** >30% (indicates loyalty and retention)
- **SMS campaign open rate:** >90% (SMS benchmark)
- **SMS campaign CTR:** >15% (industry average: 10–15%)
- **Chat conversion rate:** Orders placed via chat / Total chat sessions
- **Time to order:** Average seconds from landing to order confirmation
- **Bounce rate:** <50% on homepage, <40% on menu pages
- **Pages per session:** >2.5 (indicates menu exploration)

### 14.3 Analytics Stack
| Tool | Purpose |
|------|---------|
| **Google Analytics 4** | Traffic, behavior, conversion tracking |
| **Google Search Console** | Search performance, indexing, errors |
| **Google Business Profile Insights** | Local search visibility, actions |
| **Hotjar / Microsoft Clarity** | Heatmaps, session recordings, funnels |
| **CallRail / CallTrackingMetrics** | Phone call attribution |
| **SMS platform analytics** | Open rates, CTR, opt-out rates, revenue per SMS |
| **POS integration** | Offline-to-online attribution, customer lifetime value |

### 14.4 A/B Testing Priorities
Test one variable at a time, minimum 2 weeks or 1000 visitors per variant:
1. **CTA color and copy** ("Order Now" vs. "Order Direct & Save")
2. **Hero image** (food close-up vs. restaurant atmosphere vs. staff)
3. **Menu layout** (grid vs. list, photos vs. no photos)
4. **Checkout flow** (single-page vs. multi-step)
5. **SMS sign-up offer** (10% off vs. free appetizer vs. double points)
6. **Exit-intent popup** (discount vs. loyalty sign-up vs. review request)

---

## 15. Implementation Roadmap

### Phase 1: Foundation (Weeks 1–2)
**Goal:** Fix critical conversion blockers

| Task | Owner | Deliverable |
|------|-------|-------------|
| Audit current site on mobile | Dev | Performance report |
| Replace PDF menu with HTML | Dev | Live HTML menu page |
| Implement sticky header with CTA | Dev | Updated header component |
| Add click-to-call phone number | Dev | Functional phone links |
| Compress all images to WebP | Dev | Image optimization report |
| Set up Google Analytics 4 | Marketing | Tracking verification |
| Claim/audit Google Business Profile | Marketing | GBP optimization checklist |

### Phase 2: Conversion Engine (Weeks 3–4)
**Goal:** Enable direct ordering and capture customer data

| Task | Owner | Deliverable |
|------|-------|-------------|
| Integrate direct online ordering platform | Dev | Live ordering system |
| Implement guest checkout | Dev | Checkout flow test |
| Add SMS loyalty sign-up at checkout | Dev + SMS platform | Functional opt-in checkbox |
| Create individual dish landing pages | Dev + Content | 10–15 dish pages live |
| Add review widgets to homepage | Dev | Review display component |
| Set up call tracking number | Marketing | Call analytics dashboard |
| Launch Google review request automation | Marketing | 10+ new reviews |

### Phase 3: Automation & Retention (Weeks 5–6)
**Goal:** Build automated systems for repeat business

| Task | Owner | Deliverable |
|------|-------|-------------|
| Configure SMS welcome series | Marketing | 5-message automation live |
| Set up post-order SMS flows | Marketing | Confirmation + review request live |
| Implement abandoned cart SMS/email | Dev + Marketing | Recovery automation active |
| Add chat widget with restaurant-specific flows | Dev | Chat live on all pages |
| Create FAQ page for AI search | Content | 10+ FAQ entries live |
| Implement Schema.org markup | Dev | Structured data test passed |
| Set up A/B testing framework | Dev | First test running |

### Phase 4: Optimization (Weeks 7–8)
**Goal:** Refine based on data and scale

| Task | Owner | Deliverable |
|------|-------|-------------|
| Analyze first 30 days of data | Marketing | Performance report |
| Run A/B tests on top 3 hypotheses | Dev + Marketing | Winning variants implemented |
| Expand dish pages to full menu | Content | All menu items have pages |
| Launch time-based personalization | Dev | Dynamic content by time of day |
| Set up geo-fenced SMS campaigns | Marketing | Location-based triggers active |
| Conduct accessibility audit | Dev | WCAG 2.1 AA compliance report |
| Plan quarterly content calendar | Marketing | 90-day content plan |

---

## 16. Anti-Patterns & What to Avoid

### ❌ Critical Errors
| Anti-Pattern | Why It Kills Conversions | Fix |
|--------------|-------------------------|-----|
| **PDF menu** | Unsearchable, slow, terrible mobile UX | Replace with HTML menu immediately |
| **No mobile optimization** | 60%+ of traffic bounces | Mobile-first design mandatory |
| **Forcing account creation** | 35% abandonment at registration | Guest checkout default, account optional post-purchase |
| **Hidden phone number** | Frustrates call-in customers | Sticky header with tap-to-call |
| **No delivery zone check** | Orders from undeliverable areas | Validate address before checkout completion |
| **Auto-playing music/video** | Increases bounce rate, annoys mobile users | Never auto-play audio; video muted autoplay only |
| **Pop-up on page load** | Triggers immediate bounce | Delay 15+ seconds or use exit-intent only |
| **Broken online ordering** | "Order Online" button leads to dead link | Test weekly, monitor uptime |
| **Inconsistent NAP** | Confuses Google, hurts local ranking | Audit and standardize all listings |
| **Ignoring reviews** | Signals poor customer service | Respond to 100% within 48 hours |

### ⚠️ Common Mistakes
| Mistake | Impact | Better Approach |
|---------|--------|---------------|
| **Too many CTAs** | Decision paralysis | One primary CTA per section |
| **Generic stock photos** | Inauthentic, hurts trust | Hire local food photographer |
| **No loading states** | Users think site is broken | Skeleton screens or spinners on all async actions |
| **Tiny font sizes** | Illegible on mobile | 16px minimum body text, 18px+ for inputs |
| **Long forms** | Abandonment | Maximum 3 fields for any form |
| **No order confirmation** | Customer anxiety | Immediate on-screen + SMS + email confirmation |
| **Slow image loading** | High bounce rate | Lazy loading, WebP, CDN, compression |
| **Missing alt text** | Accessibility failure, no image SEO | Descriptive alt text on every image |
| **Unclear hours** | Wasted trips/calls | Prominent hours, holiday updates, "Open Now" indicator |
| **No SSL** | Security warning, lost trust | HTTPS mandatory, HSTS enabled |

### 🚫 SMS Loyalty Program Pitfalls
| Pitfall | Risk | Prevention |
|---------|------|------------|
| **Pre-checked SMS consent** | TCPA violation, $500–$1,500 per message | Explicit opt-in only, unchecked by default |
| **No opt-out mechanism** | Legal liability, carrier blocking | "Reply STOP" in every message, honor within 24 hours |
| **Over-messaging** | Unsubscribes, spam complaints | Max 4 messages/month, value-first content |
| **No value in messages** | Low engagement, wasted spend | Every message must contain offer, info, or reward |
| **Sending at wrong times** | Customer annoyance, opt-outs | 10 AM–8 PM only, time-zone aware |
| **No personalization** | Generic feel, low CTR | Use name, reference past orders, segment by preference |
| **Broken links** | Frustration, lost conversions | Test every link before sending |
| **No compliance documentation** | Legal risk if challenged | Save opt-in records, consent timestamps, message logs |

---

## Appendix A: Quick Reference Checklist

### Pre-Launch Website Audit
- [ ] Mobile load time < 3 seconds
- [ ] All images WebP with JPEG fallback
- [ ] HTML menu live, no PDFs
- [ ] Sticky header with Order + Call CTAs
- [ ] Guest checkout enabled
- [ ] SMS opt-in at checkout (unchecked by default for marketing)
- [ ] Schema.org markup on all pages
- [ ] Google Business Profile claimed and optimized
- [ ] Reviews widget on homepage
- [ ] HTTPS with valid SSL
- [ ] Click-to-call phone numbers
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Analytics tracking verified
- [ ] Call tracking number active
- [ ] Chat widget configured and tested
- [ ] FAQ page with 10+ AI-searchable questions
- [ ] Exit-intent popup configured
- [ ] Abandoned cart recovery active
- [ ] SMS welcome series live
- [ ] Post-order review request automated

### Weekly Maintenance
- [ ] Check Google Analytics for traffic anomalies
- [ ] Respond to new reviews (Google, Yelp)
- [ ] Update Google Business Profile with any hour/menu changes
- [ ] Test ordering flow end-to-end
- [ ] Verify phone number and click-to-call functionality
- [ ] Check SMS campaign performance (open rate, CTR, opt-outs)
- [ ] Monitor site uptime

### Monthly Review
- [ ] A/B test results analysis
- [ ] Local search ranking check
- [ ] Competitor website audit
- [ ] Content freshness update (menu, hours, specials)
- [ ] SMS list hygiene (remove hard bounces, inactive numbers)
- [ ] Image optimization audit (new photos added?)
- [ ] Security scan and SSL certificate check
- [ ] Performance budget review (page weight, load times)

---

## Appendix B: Recommended Tools & Platforms

| Category | Tool | Purpose |
|----------|------|---------|
| **Website Builder** | Squarespace, WordPress + Elementor, Webflow | Restaurant site construction |
| **Ordering Platform** | Toast, ChowNow, Square Online, GloriaFood | Direct online ordering |
| **SMS Marketing** | Twilio, Attentive, Postscript, Klaviyo SMS | Loyalty program, automation |
| **Analytics** | Google Analytics 4, Hotjar, Microsoft Clarity | Behavior tracking, heatmaps |
| **SEO** | Ahrefs, SEMrush, BrightLocal | Rank tracking, local SEO |
| **Call Tracking** | CallRail, CallTrackingMetrics | Phone order attribution |
| **Reviews** | Birdeye, Podium, Grade.us | Review generation, monitoring |
| **Chat** | Tidio, Intercom, Drift | Website chat automation |
| **Email** | Klaviyo, Mailchimp | Cart abandonment, newsletters |
| **Photography** | Local food photographer, Snappr | Professional food imagery |
| **CDN** | Cloudflare, Fastly | Speed, security, uptime |
| **A/B Testing** | Google Optimize, VWO, Optimizely | Conversion optimization |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **AOV** | Average Order Value — total revenue divided by number of orders |
| **CTA** | Call-to-Action — a button or link prompting user action |
| **FCP** | First Contentful Paint — time until first text/image appears |
| **GBP** | Google Business Profile — free local business listing |
| **LCP** | Largest Contentful Paint — time until largest visible element loads |
| **NAP** | Name, Address, Phone — must be consistent across all listings |
| **PWA** | Progressive Web App — website that functions like a native app |
| **Schema.org** | Structured data markup helping search engines understand content |
| **SMS** | Short Message Service — text messaging for marketing |
| **TCPA** | Telephone Consumer Protection Act — US law governing SMS marketing |
| **TTI** | Time to Interactive — time until page is fully usable |
| **UGC** | User-Generated Content — photos, reviews from customers |
| **WCAG** | Web Content Accessibility Guidelines — standards for accessible web content |
| **WebP** | Modern image format offering superior compression vs. JPEG/PNG |

---

**Document Status:** Living document — update quarterly based on performance data, platform changes, and industry evolution.

**Questions or feedback?** This guide is designed to be adapted to your specific restaurant concept, market, and customer base. Prioritize the phases and tactics that align with your current biggest opportunity (usually mobile speed and direct ordering infrastructure first, then retention and automation).
