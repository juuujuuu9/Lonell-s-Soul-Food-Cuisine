import type { APIRoute } from "astro";
import { db, schema, isDbReady } from "../../db/index";
import { eq } from "drizzle-orm";
import { promoExpiresAt, welcomeMessage } from "../../lib/loyalty";
import { PROMO_CODE } from "../../data/business";
import { sendSms } from "../../lib/sms";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isDbReady()) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { phoneNumber } = data;

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

    const existing = await db!
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
    await db!
      .insert(schema.subscribers)
      .values({
        phoneNumber,
        keyword: "SOUL",
        consentSource: "web_form",
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
          promoExpiresAt: expires,
          reviewPromptSentAt: null,
          day7NudgeSentAt: null,
          winBackSentAt: null,
          lastVisitAt: null,
        },
      });

    await sendSms(phoneNumber, welcomeMessage(expires));

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
