import { db, schema, isDbReady } from "../db/index";
import { eq } from "drizzle-orm";

const SMS_ENABLED = process.env.SMS_ENABLED === "true";
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "+14242958020";
const SITE_URL = process.env.PUBLIC_SITE_URL || "https://lonellssoulfood.com";

function log(level: "info" | "error", message: string, data?: Record<string, unknown>) {
  const prefix = SMS_ENABLED ? "SMS" : "SMS:SIMULATED";
  const fn = level === "error" ? console.error : console.log;
  fn(`[${prefix}] ${message}`, data ?? "");
}

// ── Send SMS (real or simulated) ──
export async function sendSms(to: string, body: string): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!isDbReady()) {
    log("error", "DB not configured, cannot log message", { to });
    return { success: false, error: "Database not configured" };
  }

  if (!SMS_ENABLED) {
    log("info", `SIMULATED send to ${to}: "${body}"`);
    try {
      const [msg] = await db!
        .insert(schema.messages)
        .values({
          toNumber: to,
          fromNumber: TWILIO_FROM_NUMBER,
          body,
          direction: "outbound",
          status: "simulated",
          simulated: true,
        })
        .returning();
      return { success: true, messageId: msg.id };
    } catch (err) {
      log("error", `Failed to record simulated SMS to ${to}`, { error: String(err) });
      return { success: false, error: String(err) };
    }
  }

  try {
    const { default: twilio } = await import("twilio");
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
    }
    const client = twilio(accountSid, authToken);
    const statusCallback = `${SITE_URL}/api/sms-status-callback`;
    const result = await client.messages.create({
      to,
      from: TWILIO_FROM_NUMBER,
      body,
      statusCallback,
    });

    const [msg] = await db!
      .insert(schema.messages)
      .values({
        toNumber: to,
        fromNumber: TWILIO_FROM_NUMBER,
        body,
        direction: "outbound",
        status: "sent",
        twilioSid: result.sid,
        simulated: false,
      })
      .returning();

    log("info", `Sent via Twilio to ${to}`, { sid: result.sid });
    return { success: true, messageId: msg.id };
  } catch (err) {
    log("error", `Failed to send SMS to ${to}`, { error: String(err) });
    return { success: false, error: String(err) };
  }
}

// ── Handle inbound keywords (TCPA/CTIA compliant) ──
export async function handleInbound(from: string, keyword: string): Promise<string> {
  const normalized = keyword.trim().toUpperCase();

  if (normalized === "STOP") {
    if (isDbReady()) {
      const existing = await db!
        .select()
        .from(schema.subscribers)
        .where(eq(schema.subscribers.phoneNumber, from))
        .limit(1);

      if (existing.length > 0) {
        await db!
          .update(schema.subscribers)
          .set({ optOut: true, optOutAt: new Date() })
          .where(eq(schema.subscribers.phoneNumber, from));
      }
    }

    const reply = "Lonell's Soul Food Cuisine: You've been unsubscribed. Reply SOUL to rejoin anytime.";
    await sendSms(from, reply);
    return reply;
  }

  if (normalized === "HELP") {
    const reply = `Lonell's Soul Food Cuisine: Text MENU for our menu, EVENTS for upcoming events, or STOP to cancel. Visit ${SITE_URL} for more.`;
    await sendSms(from, reply);
    return reply;
  }

  if (normalized === "SOUL") {
    if (isDbReady()) {
      const existing = await db!
        .select()
        .from(schema.subscribers)
        .where(eq(schema.subscribers.phoneNumber, from))
        .limit(1);

      if (existing.length > 0) {
        if (existing[0].optOut) {
          await db!
            .update(schema.subscribers)
            .set({ optOut: false, optOutAt: null, consentAt: new Date() })
            .where(eq(schema.subscribers.phoneNumber, from));

          const reply = "Lonell's Soul Food Cuisine: You are opted back in. Promo code SOUL10 — 10% off + free champagne brunch upgrade. For help, reply HELP. To opt-out, reply STOP.";
          await sendSms(from, reply);
          return reply;
        }
        const reply = "Lonell's Soul Food Cuisine: You are already a member. Promo code SOUL10 — 10% off + free champagne brunch upgrade. For help, reply HELP. To opt-out, reply STOP.";
        await sendSms(from, reply);
        return reply;
      }

      await db!.insert(schema.subscribers).values({
        phoneNumber: from,
        keyword: "SOUL",
        consentSource: "sms_keyword",
        promoCode: "SOUL10",
      });
    }

    const reply = "Lonell's Soul Food Cuisine: You are now opted in. Promo code SOUL10 — 10% off + free champagne brunch upgrade. For help, reply HELP. To opt-out, reply STOP.";
    await sendSms(from, reply);
    return reply;
  }

  if (normalized === "MENU") {
    const reply = `Lonell's Soul Food Cuisine: menu at ${SITE_URL}/menu. Favorites: Pork Chop, Fried Chicken, Catfish, and Peach Cobbler! Reply HELP for help, STOP to cancel.`;
    await sendSms(from, reply);
    return reply;
  }

  if (normalized === "EVENTS") {
    const reply = `Lonell's Soul Food Cuisine: See our latest events and schedule at ${SITE_URL}/events. Reply HELP for help, STOP to cancel.`;
    await sendSms(from, reply);
    return reply;
  }

  const reply = `Lonell's Soul Food Cuisine: Reply SOUL to join, MENU for menu, EVENTS for events, HELP for info, STOP to cancel. Visit ${SITE_URL}.`;
  await sendSms(from, reply);
  return reply;
}
