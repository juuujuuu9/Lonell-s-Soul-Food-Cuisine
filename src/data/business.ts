export const LOYALTY_SMS_NUMBER = "+14242958020";
export const LOYALTY_SMS_DISPLAY = "(424) 295-8020";
export const LOYALTY_KEYWORD = "SOUL";
export const PROMO_CODE = "SOUL10";
export const PROMO_VALID_DAYS = 30;
export const WIN_BACK_VALID_DAYS = 14;
export const LOYALTY_SIGNUP_ID = "sms-signup";
export const MANAGER_PHONE = "(323) 451-3104";
export const MANAGER_PHONE_TEL = "+13234513104";

export const YELP_REVIEW_URL =
  "https://www.yelp.com/biz/lonells-soul-food-cuisine-los-angeles";

/** Google Reviews link used on the reviews page */
export const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?sca_esv=53821e7f56e2e48d&q=Lonell%27s+%7C+Soul+Food+Cuisine+Reviews";

export function loyaltySmsHref(body = LOYALTY_KEYWORD): string {
  return `sms:${LOYALTY_SMS_NUMBER}?body=${encodeURIComponent(body)}`;
}
