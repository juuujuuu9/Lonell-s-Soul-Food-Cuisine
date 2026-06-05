/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly CLERK_PUBLISHABLE_KEY: string;
  readonly CLERK_SECRET_KEY: string;
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly PUBLIC_CLERK_SIGN_IN_URL: string;
  readonly PUBLIC_CLERK_SIGN_UP_URL: string;
  readonly TWILIO_ACCOUNT_SID: string;
  readonly TWILIO_AUTH_TOKEN: string;
  readonly TWILIO_FROM_NUMBER: string;
  readonly SMS_ENABLED: string;
  readonly GOOGLE_REVIEW_URL: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
