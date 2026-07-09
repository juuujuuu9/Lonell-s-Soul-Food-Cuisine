import { db, schema, isDbReady } from "../db/index";
import { and, eq, isNull, lt, lte, or } from "drizzle-orm";
import {
  day7NudgeMessage,
  offerExpiresAt,
  reviewPromptMessage,
  weeklyBrunchMessage,
  weeklyJazzMessage,
  winBackExpiresAt,
  winBackMessage,
} from "./loyalty";
import { isJazzBroadcastWeek, isBrunchBroadcastWeek } from "./biweekly-broadcast";
import { isSmsEnabled } from "./env";
import { sendSms } from "./sms";

const BATCH_LIMIT = 500;

type CronResult = { sent: number; simulated: boolean; error?: string; skipped?: string };

function isSimulated(): boolean {
  return !isSmsEnabled();
}

async function sendBatch(
  subscribers: { id: number; phoneNumber: string | null }[],
  body: string,
  markSent: (id: number) => Promise<void>
): Promise<number> {
  let sent = 0;
  const groups: typeof subscribers[] = [];
  for (let i = 0; i < subscribers.length; i += 10) {
    groups.push(subscribers.slice(i, i + 10));
  }
  for (const group of groups) {
    const results = await Promise.allSettled(
      group.map(async (sub) => {
        if (!sub.phoneNumber) return false;
        const result = await sendSms(sub.phoneNumber, body);
        if (result.success) {
          await markSent(sub.id);
          return true;
        }
        return false;
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) sent++;
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

  const expires = offerExpiresAt();
  const body = day7NudgeMessage(expires);
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

  const expires = winBackExpiresAt();
  const body = winBackMessage(expires);
  const sent = await sendBatch(candidates, body, async (id) => {
    await db!
      .update(schema.subscribers)
      .set({ winBackSentAt: new Date() })
      .where(eq(schema.subscribers.id, id));
  });

  console.log(`[Cron] Win-back: sent ${sent}/${candidates.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── Biweekly jazz broadcast (alternates with brunch) ──
export async function sendWeeklyJazz(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isJazzBroadcastWeek()) {
    console.log("[Cron] Weekly jazz: skipped (biweekly brunch week)");
    return { sent: 0, simulated, skipped: "biweekly_brunch_week" };
  }
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

// ── Biweekly brunch broadcast (alternates with jazz) ──
export async function sendWeeklyBrunch(): Promise<CronResult> {
  const simulated = isSimulated();
  if (!isBrunchBroadcastWeek()) {
    console.log("[Cron] Weekly brunch: skipped (biweekly jazz week)");
    return { sent: 0, simulated, skipped: "biweekly_jazz_week" };
  }
  if (!isDbReady()) {
    console.error("[Cron] Weekly brunch: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const subscribers = await db!
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.optOut, false))
    .limit(BATCH_LIMIT);

  const expires = offerExpiresAt();
  const sent = await sendBatch(subscribers, weeklyBrunchMessage(expires), async () => {});

  console.log(`[Cron] Weekly brunch: sent ${sent}/${subscribers.length} (simulated: ${simulated})`);
  return { sent, simulated };
}

// ponytail: sendWeeklyPromo removed — use sendWeeklyJazz / sendWeeklyBrunch directly

// ponytail: TCPA record retention — opt-out records already soft-deleted via `optOut=true`.
// Permanent deletion is a compliance risk; skip cleanup entirely.
export async function cleanupOldOptOuts(): Promise<number> {
  return 0;
}
