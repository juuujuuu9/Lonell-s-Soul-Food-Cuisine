import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db, schema, isDbReady } from "../../../db/index";
import { sendSms } from "../../../lib/sms";

export const prerender = false;

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

    const subscribers = await db!
      .select()
      .from(schema.subscribers)
      .where(eq(schema.subscribers.optOut, false));

    let sent = 0;
    const results = [];
    for (const sub of subscribers) {
      const result = await sendSms(sub.phoneNumber!, trimmed);
      if (result.success) sent++;
      results.push({ phone: sub.phoneNumber, success: result.success });
    }

    return new Response(JSON.stringify({
      sent,
      total: subscribers.length,
      simulated: process.env.SMS_ENABLED !== "true",
      results,
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
