import {
  GOOGLE_REVIEW_URL as GOOGLE_REVIEW_DEFAULT,
  LOYALTY_KEYWORD,
  MANAGER_PHONE,
  PROMO_VALID_DAYS,
  WIN_BACK_VALID_DAYS,
  YELP_REVIEW_URL,
} from "../data/business";

const BRAND = "Lonell's Soul Food Cuisine";
const FOOTER = "Reply STOP to opt out.";

export type DripSubscriber = {
  consentAt: Date;
  lastVisitAt: Date | null;
  day7NudgeSentAt: Date | null;
  winBackSentAt: Date | null;
  optOut: boolean;
};

export function getGoogleReviewUrl(): string {
  const placeId = process.env["GOOGLE_PLACE_ID"];
  if (placeId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
  }
  return process.env["GOOGLE_REVIEW_URL"] || GOOGLE_REVIEW_DEFAULT;
}

export function promoExpiresAt(from: Date = new Date()): Date {
  const expires = new Date(from);
  expires.setDate(expires.getDate() + PROMO_VALID_DAYS);
  return expires;
}

export function offerExpiresAt(from: Date = new Date()): Date {
  const expires = new Date(from);
  expires.setDate(expires.getDate() + WIN_BACK_VALID_DAYS);
  return expires;
}

export function winBackExpiresAt(from: Date = new Date()): Date {
  return offerExpiresAt(from);
}

export function formatPromoExpiry(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

export function hasReturnedSinceSignup(sub: Pick<DripSubscriber, "consentAt" | "lastVisitAt">): boolean {
  return !!(sub.lastVisitAt && sub.lastVisitAt >= sub.consentAt);
}

export function isEligibleForDay7Nudge(sub: DripSubscriber, now = new Date()): boolean {
  if (sub.optOut || sub.day7NudgeSentAt || hasReturnedSinceSignup(sub)) return false;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 7);
  return sub.consentAt <= cutoff;
}

export function isEligibleForWinBack(sub: DripSubscriber, now = new Date()): boolean {
  if (sub.optOut || sub.winBackSentAt) return false;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  const lastActivity = sub.lastVisitAt ?? sub.consentAt;
  return lastActivity <= cutoff;
}

export function welcomeMessage(expiresAt: Date): string {
  const expiry = formatPromoExpiry(expiresAt);
  return `${BRAND}: Welcome to the Soul Food Family! Show this message for 10% off your dinner plate. Expires ${expiry}. ${FOOTER}`;
}

export function existingMemberMessage(expiresAt: Date | null): string {
  if (expiresAt && expiresAt > new Date()) {
    const expiry = formatPromoExpiry(expiresAt);
    return `${BRAND}: You're already a member. Show this message for 10% off your dinner plate. Expires ${expiry}. Reply HELP for help. ${FOOTER}`;
  }
  return `${BRAND}: You're already a member. Reply HELP for help. ${FOOTER}`;
}

export function rejoinMessage(expiresAt: Date): string {
  return welcomeMessage(expiresAt);
}

export function reviewPromptMessage(): string {
  const google = getGoogleReviewUrl();
  return `${BRAND}: We hope you enjoyed your time with us! If we made your day a little better, we'd love your words on Google or Yelp. Share your experience and show us your posted review for a complimentary side on your next visit.\nGoogle: ${google}\nYelp: ${YELP_REVIEW_URL}\n${FOOTER}`;
}

export function day7NudgeMessage(expiresAt: Date): string {
  const expiry = formatPromoExpiry(expiresAt);
  return `${BRAND}: We'd love to see you again! This Wed: live jazz 6-9pm. This Sun: brunch and live music 1-5pm. Show this message for 10% off your meal. Expires ${expiry}. Walk in or call ${MANAGER_PHONE} to reserve. ${FOOTER}`;
}

export function winBackMessage(expiresAt: Date): string {
  const expiry = formatPromoExpiry(expiresAt);
  return `${BRAND}: We miss you! Come back this week for 15% off your next dinner plate. Show this message to redeem. Valid through ${expiry}. Walk in or call ${MANAGER_PHONE}. ${FOOTER}`;
}

export function weeklyJazzMessage(): string {
  return `${BRAND}: Tonight at Lonell's: Live jazz, 6 to 9! Good food, good music, good company. Walk in or call ${MANAGER_PHONE} to reserve. ${FOOTER}`;
}

export function weeklyBrunchMessage(expiresAt: Date): string {
  const expiry = formatPromoExpiry(expiresAt);
  return `${BRAND}: Sunday Brunch is live at Lonell's! Music starts at 1, the kitchen is open until 5. Show this message for 10% off your meal. Expires ${expiry}. Call ${MANAGER_PHONE} to reserve, or walk in. ${FOOTER}`;
}

export function menuMessage(siteUrl: string): string {
  return `${BRAND}: Menu at ${siteUrl}/menu. Favorites: Pork Chop, Fried Chicken, Catfish, and Peach Cobbler! Reply HELP for help. ${FOOTER}`;
}

export function eventsMessage(siteUrl: string): string {
  return `${BRAND}: See our latest events at ${siteUrl}/events. Reply HELP for help. ${FOOTER}`;
}

export function stopConfirmationMessage(): string {
  return `${BRAND}: You've been unsubscribed. Reply ${LOYALTY_KEYWORD} to rejoin anytime.`;
}

export function helpMessage(siteUrl: string): string {
  return `${BRAND}: Text MENU for our menu, EVENTS for upcoming events, or STOP to cancel. Visit ${siteUrl} for more.`;
}

export function unknownKeywordMessage(siteUrl: string): string {
  return `${BRAND}: Reply ${LOYALTY_KEYWORD} to join, MENU for menu, EVENTS for events, HELP for info, STOP to cancel. Visit ${siteUrl}.`;
}

if (import.meta.env?.DEV) {
  const now = new Date("2026-06-15T12:00:00Z");
  const consent = new Date("2026-06-01T12:00:00Z");
  const base: DripSubscriber = {
    consentAt: consent,
    lastVisitAt: null,
    day7NudgeSentAt: null,
    winBackSentAt: null,
    optOut: false,
  };
  console.assert(isEligibleForDay7Nudge(base, now), "day7: eligible after 7 days with no visit");
  console.assert(!isEligibleForDay7Nudge({ ...base, lastVisitAt: new Date("2026-06-05T12:00:00Z") }, now), "day7: skip after visit");
  console.assert(isEligibleForWinBack(base, now), "winback: eligible after 30 days idle");
  console.assert(!isEligibleForWinBack({ ...base, lastVisitAt: new Date("2026-06-10T12:00:00Z") }, now), "winback: skip after recent visit");
}
