import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db, schema } from "../../../db/index";
import { sendSms } from "../../../lib/sms";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { message } = data;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message body is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subscribers = await db
      .select()
      .from(schema.subscribers)
      .where(eq(schema.subscribers.optOut, false));

    const results = [];
    for (const sub of subscribers) {
      const result = await sendSms(sub.phoneNumber!, message);
      results.push({ phone: sub.phoneNumber, success: result.success });
    }

    return new Response(JSON.stringify({ sent: results.length, total: subscribers.length, results }), {
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
