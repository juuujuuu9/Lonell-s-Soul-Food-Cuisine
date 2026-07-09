import type { APIRoute } from "astro";
import { and, eq, gt } from "drizzle-orm";
import { db, schema, isDbReady } from "../../../db/index";
import { isSmsEnabled } from "../../../lib/env";
import { sendSms } from "../../../lib/sms";

export const prerender = false;

export const config = { maxDuration: 300 };

const BATCH_SIZE = 500;
const CONCURRENCY = 10;

async function sendBatch(
  subscribers: { id: number; phoneNumber: string | null }[],
  message: string
): Promise<number> {
  let sent = 0;
  const groups: typeof subscribers[] = [];
  for (let i = 0; i < subscribers.length; i += CONCURRENCY) {
    groups.push(subscribers.slice(i, i + CONCURRENCY));
  }
  for (const group of groups) {
    const results = await Promise.allSettled(
      group.map((sub) => {
        if (!sub.phoneNumber) return Promise.resolve({ success: false } as const);
        return sendSms(sub.phoneNumber, message);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value.success) sent++;
    }
  }
  return sent;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isDbReady()) {
      return new Response(JSON.stringify({ error: "Database is not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { message } = data;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message body is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trimmed = message.trim();
    if (trimmed.length > 1600) {
      return new Response(JSON.stringify({ error: "Message must be 1600 characters or fewer" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let totalSent = 0;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await db
        .select({ id: schema.subscribers.id, phoneNumber: schema.subscribers.phoneNumber })
        .from(schema.subscribers)
        .where(
          and(eq(schema.subscribers.optOut, false), gt(schema.subscribers.id, offset))
        )
        .orderBy(schema.subscribers.id)
        .limit(BATCH_SIZE);

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      totalSent += await sendBatch(batch, trimmed);
      offset = batch[batch.length - 1].id;
      hasMore = batch.length === BATCH_SIZE;
    }

    return new Response(JSON.stringify({
      sent: totalSent,
      simulated: !isSmsEnabled(),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Broadcast] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
