# A2P 10DLC Campaign Resubmit Pack — Lonell's Loyalty Program

> Use this pack to resubmit the rejected Twilio MARKETING campaign after Error **30909** (CTA / Message Flow could not be verified). Copy SIDs from Twilio Console — do not commit Account SIDs to git.

**Brand:** Lonell's Soul Food Cuisine  
**Program:** SoulFood SMS Club  
**Use case:** MARKETING  
**SMS number:** (424) 295-8020 (`+14242958020`)  
**Keyword:** `SOUL`

---

## Paste into Twilio Console

### Privacy Policy URL

```
https://www.lonellssoulfood.com/privacy
```

Alias (301 → same page): `https://www.lonellssoulfood.com/privacy-policy`

### Terms and Conditions URL

```
https://www.lonellssoulfood.com/terms
```

Alias (301 → `#sms-program`): `https://www.lonellssoulfood.com/terms-and-conditions`

### Call to Action / Message Flow (primary — copy exactly)

```
End users opt in to Lonell's Soul Food Cuisine SoulFood SMS Club (recurring automated marketing texts) via two public, no-login paths:

(1) Website form (primary): https://www.lonellssoulfood.com/join
Users enter their mobile number and must actively check an OPTIONAL consent checkbox that is UNCHECKED by default, then tap Continue. Checking the box + submitting constitutes consent to recurring automated marketing SMS (offers, menu previews, event invitations, loyalty rewards; approx. 2–4 msgs/month). Msg & data rates may apply. Consent is not required to purchase or use the website. Form links to Terms (https://www.lonellssoulfood.com/terms#sms-program) and Privacy Policy (https://www.lonellssoulfood.com/privacy#sms-privacy). Users may tap “No thanks, I'll skip texts” without enrolling.

Hosted live proof (form + keyword + flow): https://www.lonellssoulfood.com/a2p-opt-in-proof
Static screenshot of the web opt-in form: https://www.lonellssoulfood.com/media/images/a2p-web-opt-in-proof.png

(2) Keyword / QR CTA: https://www.lonellssoulfood.com/sms
In-store QR codes and the /sms page instruct customers to text SOUL to (424) 295-8020. The /sms page shows the keyword, number, QR, full disclosures (frequency, rates, STOP/HELP, consent not required), Terms/Privacy links, and the same web form. Sending SOUL constitutes consent. In-store QR encodes sms:+14242958020?body=SOUL.

After either opt-in, the system sends an immediate welcome SMS confirming enrollment (includes STOP/HELP, msg & data rates, Terms & Privacy URLs). Reply STOP to cancel (confirmation sent). Reply HELP for help. Opt-in is recorded with consent timestamp and source (web_form or sms_keyword).
```



### Sample messages (include brand + STOP/HELP)

**Welcome (Sample 1)**

```
Lonell's Soul Food Cuisine: Welcome to the Soul Food Family! Show this message for 10% off your dinner plate. Expires [DATE]. Msg & data rates may apply. Reply HELP for help. Reply STOP to opt out. Terms: https://lonellssoulfood.com/terms Privacy: https://lonellssoulfood.com/privacy
```

**Ongoing marketing (Sample 2)**

```
Lonell's Soul Food Cuisine: Live jazz tonight 6-9pm. Walk in or call (323) 451-3104 to reserve. Reply HELP for help. Reply STOP to opt out.
```

**Opt-out confirmation**

```
Lonell's Soul Food Cuisine: You have been unsubscribed. You will not receive any more messages. Reply START to resubscribe.
```

**HELP**

```
Lonell's Soul Food Cuisine: Text MENU for our menu, EVENTS for upcoming events, or STOP to cancel. Msg & data rates may apply. Visit https://lonellssoulfood.com for more. Reply HELP for help. Reply STOP to opt out.
```

---



## Why the prior submission failed

Reviewer note (30909): keyword CTA at `/sms` was listed, but **no hosted proof** of the opt-in surface was provided. Resubmit with:

1. Primary CTA URL = `https://www.lonellssoulfood.com/join` (live unchecked checkbox)
2. Message Flow text above (includes both paths)
3. Proof URL = `https://www.lonellssoulfood.com/a2p-opt-in-proof`
4. Screenshot URL = `https://www.lonellssoulfood.com/media/images/a2p-web-opt-in-proof.png`

---



## Pre-submit checklist

- [x] Open `/join` in a private window — confirm checkbox is **unchecked**, Terms/Privacy links work
- [x] Open `/sms` — keyword, QR, disclosures, and web form visible (no login)
- [x] Open `/a2p-opt-in-proof` — both paths + message flow visible
- [x] Open screenshot PNG URL — matches current single-checkbox form
- [x] Open `/privacy` and `/terms#sms-program`
- [x] Paste Message Flow + sample messages into Twilio Console and resubmit



## Related code

- Opt-in form: `src/components/LoyaltySignupForm.astro`
- Consent copy: `src/data/loyalty-consent.ts`
- Keyword handler: `src/lib/sms.ts`
- Message templates: `src/lib/loyalty.ts`
- Structured payload: `docs/a2p-campaign-payload.json`

