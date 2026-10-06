export const LOYALTY_SMS_NUMBER = "+14242958020";
export const LOYALTY_SMS_DISPLAY = "(424) 295-8020";
export const LOYALTY_KEYWORD = "SOUL";
export const PROMO_CODE = "SOUL10";
export const PROMO_VALID_DAYS = 30;
export const WIN_BACK_VALID_DAYS = 14;
export const LOYALTY_SIGNUP_ID = "sms-signup";
export const MANAGER_PHONE = "(323) 451-3104";
export const MANAGER_PHONE_TEL = "+13234513104";
export const RESERVATIONS_EMAIL = "reservations@lonellssoulfood.com";
export const STREET_ADDRESS = "8501 S Vermont Ave";
export const CITY = "Los Angeles";
export const STATE = "CA";
export const POSTAL_CODE = "90044";
export const CONTACT_CARD_PATH = "/lonells.vcf";
export const CONTACT_PHOTO_PATH = "/media/images/lonells-gold-logo.png";

export const YELP_REVIEW_URL =
  "https://www.yelp.com/biz/lonells-soul-food-cuisine-los-angeles";

/** Direct link to leave a Google review */
export const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ9SofQgDJwoAR5WXKjHDAQLk";

export function loyaltySmsHref(body = LOYALTY_KEYWORD): string {
  return `sms:${LOYALTY_SMS_NUMBER}?body=${encodeURIComponent(body)}`;
}
