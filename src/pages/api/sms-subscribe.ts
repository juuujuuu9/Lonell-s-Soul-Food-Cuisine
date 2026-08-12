import type { APIRoute } from "astro";
import { db, schema, isDbReady } from "../../db/index";
import { eq } from "drizzle-orm";
import { promoExpiresAt, welcomeMessage } from "../../lib/loyalty";
import { PROMO_CODE } from "../../data/business";
import { sendSms } from "../../lib/sms";

export const prerender = false;

const VALID_CONSENT_TYPES = ["marketing", "informational"] as const;
type ConsentType = (typeof VALID_CONSENT_TYPES)[number];

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isDbReady()) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { phoneNumber, consentTypes } = data;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (phoneNumber.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(consentTypes) || consentTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: "You must agree to receive marketing messages." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const invalid = consentTypes.filter(
      (t: string) => !VALID_CONSENT_TYPES.includes(t as ConsentType),
    );
    if (invalid.length > 0) {
      return new Response(JSON.stringify({ error: `Invalid consent type(s): ${invalid.join(", ")}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // A2P MARKETING campaign — web opt-in must include marketing consent
    if (!consentTypes.includes("marketing")) {
      return new Response(
        JSON.stringify({ error: "Marketing consent is required to join." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await db
      .select()
      .from(schema.subscribers)
      .where(eq(schema.subscribers.phoneNumber, phoneNumber))
      .limit(1);

    if (existing.length > 0 && !existing[0].optOut) {
      return new Response(JSON.stringify({ message: "Already subscribed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expires = promoExpiresAt();
    await db
      .insert(schema.subscribers)
      .values({
        phoneNumber,
        keyword: "SOUL",
        consentSource: "web_form",
        consentTypes,
        promoCode: PROMO_CODE,
        consentAt: new Date(),
        promoExpiresAt: expires,
        optOut: false,
      })
      .onConflictDoUpdate({
        target: schema.subscribers.phoneNumber,
        set: {
          optOut: false,
          optOutAt: null,
          consentAt: new Date(),
          consentTypes,
          promoExpiresAt: expires,
          reviewPromptSentAt: null,
          day7NudgeSentAt: null,
          winBackSentAt: null,
          lastVisitAt: null,
        },
      });

    const site =
      process.env["PUBLIC_SITE_URL"]?.replace(/\/$/, "") || "https://lonellssoulfood.com";
    await sendSms(phoneNumber, welcomeMessage(expires, site));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[SMS Subscribe] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
