import { db, schema, isDbReady } from "../db/index";
import { eq, lt, and } from "drizzle-orm";
import { sendSms } from "./sms";

// ── Weekly promo sender (run via Cron Job on Vercel) ──
export async function sendWeeklyPromo(): Promise<{ sent: number; simulated: boolean; error?: string }> {
  const simulated = process.env.SMS_ENABLED !== "true";

  if (!isDbReady()) {
    console.error("[Cron] Weekly promo: DB not configured");
    return { sent: 0, simulated, error: "Database not configured" };
  }

  const subscribers = await db!
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.optOut, false))
    .limit(500);

  let sent = 0;
  const body = `Lonell's Soul Food Cuisine: Weekly special — use code SOUL10 for 10% off your next order. This week only, come through! Reply HELP for help, STOP to cancel.`;

  for (const sub of subscribers) {
    try {
      const result = await sendSms(sub.phoneNumber!, body);
      if (result.success) sent++;
    } catch (err) {
      console.error(`[Cron] Failed to send promo to ${sub.phoneNumber}:`, err);
    }
  }

  console.log(`[Cron] Weekly promo: sent ${sent}/${subscribers.length} messages (simulated: ${simulated})`);
  return { sent, simulated };
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
