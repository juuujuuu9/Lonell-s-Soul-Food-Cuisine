import { db, schema, isDbReady } from "../db/index";
import { eq } from "drizzle-orm";
import { PROMO_CODE } from "../data/business";
import {
  existingMemberMessage,
  eventsMessage,
  helpMessage,
  menuMessage,
  promoExpiresAt,
  rejoinMessage,
  stopConfirmationMessage,
  unknownKeywordMessage,
  welcomeMessage,
} from "./loyalty";
import { isSmsEnabled, serverEnv } from "./env";

function twilioFromNumber(): string {
  return serverEnv("TWILIO_FROM_NUMBER") || "+14242958020";
}

function siteUrl(): string {
  return serverEnv("PUBLIC_SITE_URL") || "https://lonellssoulfood.com";
}

function log(level: "info" | "error", message: string, data?: Record<string, unknown>) {
  const prefix = isSmsEnabled() ? "SMS" : "SMS:SIMULATED";
  const fn = level === "error" ? console.error : console.log;
  fn(`[${prefix}] ${message}`, data ?? "");
}

export async function logOutboundMessage(
  to: string,
  body: string,
  opts?: { simulated?: boolean; twilioSid?: string }
): Promise<void> {
  if (!isDbReady()) return;

  const simulated = opts?.simulated ?? !isSmsEnabled();
  await db!.insert(schema.messages).values({
    toNumber: to,
    fromNumber: twilioFromNumber(),
    body,
    direction: "outbound",
    status: simulated ? "simulated" : "sent",
    twilioSid: opts?.twilioSid,
    simulated,
  });
}

// ── Send SMS (real or simulated) ──
export async function sendSms(to: string, body: string): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!isDbReady()) {
    log("error", "DB not configured, cannot log message", { to });
    return { success: false, error: "Database not configured" };
  }

  if (!isSmsEnabled()) {
    log("info", `SIMULATED send to ${to}: "${body}"`);
    try {
      const [msg] = await db!
        .insert(schema.messages)
        .values({
          toNumber: to,
          fromNumber: twilioFromNumber(),
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
    const accountSid = serverEnv("TWILIO_ACCOUNT_SID");
    const authToken = serverEnv("TWILIO_AUTH_TOKEN");
    if (!accountSid || !authToken) {
      throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
    }
    const client = twilio(accountSid, authToken);
    const statusCallback = `${siteUrl()}/api/sms-status-callback`;
    const result = await client.messages.create({
      to,
      from: twilioFromNumber(),
      body,
      statusCallback,
    });

    const [msg] = await db!
      .insert(schema.messages)
      .values({
        toNumber: to,
        fromNumber: twilioFromNumber(),
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

// ── Handle inbound keywords (TCPA/CTIA compliant). Returns reply text only — webhook sends via TwiML. ──
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
    return stopConfirmationMessage();
  }

  if (normalized === "HELP") {
    return helpMessage(siteUrl());
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
          const expires = promoExpiresAt();
          await db!
            .update(schema.subscribers)
            .set({
              optOut: false,
              optOutAt: null,
              consentAt: new Date(),
              promoExpiresAt: expires,
              reviewPromptSentAt: null,
              day7NudgeSentAt: null,
              winBackSentAt: null,
              lastVisitAt: null,
            })
            .where(eq(schema.subscribers.phoneNumber, from));
          return rejoinMessage(expires);
        }
        return existingMemberMessage(existing[0].promoExpiresAt);
      }

      const expires = promoExpiresAt();
      await db!.insert(schema.subscribers).values({
        phoneNumber: from,
        keyword: "SOUL",
        consentSource: "sms_keyword",
        promoCode: PROMO_CODE,
        promoExpiresAt: expires,
      });
      return welcomeMessage(expires);
    }

    return welcomeMessage(promoExpiresAt());
  }

  if (normalized === "MENU") {
    return menuMessage(siteUrl());
  }

  if (normalized === "EVENTS") {
    return eventsMessage(siteUrl());
  }

  return unknownKeywordMessage(siteUrl());
}
