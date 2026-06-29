import { db, schema, isDbReady } from "../db/index";
import { and, eq, isNull, lt, lte, or } from "drizzle-orm";
import {
  day7NudgeMessage,
  reviewPromptMessage,
  weeklyBrunchMessage,
  weeklyJazzMessage,
  winBackExpiresAt,
  winBackMessage,
} from "./loyalty";
import { sendSms } from "./sms";

const BATCH_LIMIT = 500;

type CronResult = { sent: number; simulated: boolean; error?: string };

function isSimulated(): boolean {
  return process.env.SMS_ENABLED !== "true";
}

async function sendBatch(
  subscribers: { id: number; phoneNumber: string | null }[],
  body: string,
  markSent: (id: number) => Promise<void>
): Promise<number> {
  let sent = 0;
  for (const sub of subscribers) {
    if (!sub.phoneNumber) continue;
    try {
      const result = await sendSms(sub.phoneNumber, body);
      if (result.success) {
        await markSent(sub.id);
        sent++;
      }
    } catch (err) {
      console.error(`[Cron] Failed to send to ${sub.phoneNumber}:`, err);
    }
  }
  return sent;
}

// ── Day 1 review prompts ──
export async function sendReviewPrompts(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isDbReady()) {
    console.error("[Cron] Review prompts: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 24);

  const subscribers = await db!
    .select()
    .from(schema.subscribers)
    .where(
      and(
        eq(schema.subscribers.optOut, false),
        isNull(schema.subscribers.reviewPromptSentAt),
        lte(schema.subscribers.consentAt, cutoff)
      )
    )
    .limit(BATCH_LIMIT);

  const body = reviewPromptMessage();
  const sent = await sendBatch(subscribers, body, async (id) => {
    await db!
      .update(schema.subscribers)
      .set({ reviewPromptSentAt: new Date() })
      .where(eq(schema.subscribers.id, id));
  });

  console.log(`[Cron] Review prompts: sent ${sent}/${subscribers.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── Day 7 entertainment nudge (no return visit logged) ──
export async function sendDay7Nudges(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isDbReady()) {
    console.error("[Cron] Day 7 nudge: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const candidates = await db!
    .select()
    .from(schema.subscribers)
    .where(
      and(
        eq(schema.subscribers.optOut, false),
        isNull(schema.subscribers.day7NudgeSentAt),
        lte(schema.subscribers.consentAt, cutoff),
        or(
          isNull(schema.subscribers.lastVisitAt),
          lt(schema.subscribers.lastVisitAt, schema.subscribers.consentAt)
        )
      )
    )
    .limit(BATCH_LIMIT);

  const body = day7NudgeMessage();
  const sent = await sendBatch(candidates, body, async (id) => {
    await db!
      .update(schema.subscribers)
      .set({ day7NudgeSentAt: new Date() })
      .where(eq(schema.subscribers.id, id));
  });

  console.log(`[Cron] Day 7 nudge: sent ${sent}/${candidates.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── 30-day win-back (no visit in 30 days) ──
export async function sendWinBackMessages(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isDbReady()) {
    console.error("[Cron] Win-back: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const candidates = await db!
    .select()
    .from(schema.subscribers)
    .where(
      and(
        eq(schema.subscribers.optOut, false),
        isNull(schema.subscribers.winBackSentAt),
        or(
          and(isNull(schema.subscribers.lastVisitAt), lte(schema.subscribers.consentAt, cutoff)),
          lte(schema.subscribers.lastVisitAt, cutoff)
        )
      )
    )
    .limit(BATCH_LIMIT);

  let sent = 0;
  for (const sub of candidates) {
    if (!sub.phoneNumber) continue;
    const expires = winBackExpiresAt();
    const body = winBackMessage(expires);
    try {
      const result = await sendSms(sub.phoneNumber, body);
      if (result.success) {
        await db!
          .update(schema.subscribers)
          .set({ winBackSentAt: new Date() })
          .where(eq(schema.subscribers.id, sub.id));
        sent++;
      }
    } catch (err) {
      console.error(`[Cron] Failed to send win-back to ${sub.phoneNumber}:`, err);
    }
  }

  console.log(`[Cron] Win-back: sent ${sent}/${candidates.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── Wednesday jazz broadcast ──
export async function sendWeeklyJazz(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isDbReady()) {
    console.error("[Cron] Weekly jazz: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const subscribers = await db!
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.optOut, false))
    .limit(BATCH_LIMIT);

  const sent = await sendBatch(subscribers, weeklyJazzMessage(), async () => {});

  console.log(`[Cron] Weekly jazz: sent ${sent}/${subscribers.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── Sunday brunch broadcast ──
export async function sendWeeklyBrunch(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isDbReady()) {
    console.error("[Cron] Weekly brunch: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const subscribers = await db!
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.optOut, false))
    .limit(BATCH_LIMIT);

  const sent = await sendBatch(subscribers, weeklyBrunchMessage(), async () => {});

  console.log(`[Cron] Weekly brunch: sent ${sent}/${subscribers.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

/** @deprecated Use sendWeeklyJazz / sendWeeklyBrunch */
export async function sendWeeklyPromo(): Promise<CronResult> {
  return sendWeeklyJazz();
}

// ── Opt-out cleanup (remove old opt-outs after 1 year) ──
export async function cleanupOldOptOuts(): Promise<number> {
  if (!isDbReady()) {
    console.error("[Cron] Cleanup: DB not configured");
    return 0;
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const result = await db!
    .delete(schema.subscribers)
    .where(
      and(eq(schema.subscribers.optOut, true), lt(schema.subscribers.optOutAt!, oneYearAgo))
    );

  const count = result.count ?? 0;
  console.log(`[Cron] Cleanup: removed ${count} old opt-outs`);
  return count;
}
