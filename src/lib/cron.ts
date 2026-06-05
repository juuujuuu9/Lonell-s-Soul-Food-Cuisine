import { db, schema } from "../db/index";
import { eq, sql } from "drizzle-orm";

// ── Weekly promo sender (run via Cron Job on Vercel) ──
export async function sendWeeklyPromo(): Promise<{ sent: number; simulated: boolean }> {
  const simulated = process.env.SMS_ENABLED !== "true";
  const { default: sendSms } = await import("./sms");

  const subscribers = await db
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.optOut, false));

  let sent = 0;
  for (const sub of subscribers) {
    const body = `Lonell's Soul Food weekly special! Use code SOUL10 for 10% off your next order. This week only — come through! Reply STOP to cancel.`;
    const result = await sendSms.sendSms(sub.phoneNumber!, body);
    if (result.success) sent++;
  }

  console.log(`[Cron] Weekly promo: sent ${sent}/${subscribers.length} messages (simulated: ${simulated})`);
  return { sent, simulated };
}

// ── Opt-out cleanup (remove old opt-outs after 1 year) ──
export async function cleanupOldOptOuts(): Promise<number> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const result = await db
    .delete(schema.subscribers)
    .where(
      sql`${schema.subscribers.optOut} = true AND ${schema.subscribers.optOutAt} < ${oneYearAgo}`
    );

  console.log(`[Cron] Cleanup: removed ${result.count || 0} old opt-outs`);
  return result.count || 0;
}
