import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db, schema, isDbReady } from "../../../db/index";

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
    const { id, action } = data;

    if (!id || typeof id !== "number") {
      return new Response(JSON.stringify({ error: "Subscriber id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action !== "visit" && action !== "redeem") {
      return new Response(JSON.stringify({ error: "action must be visit or redeem" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const updates =
      action === "redeem"
        ? { lastVisitAt: now, promoRedeemed: true, winBackSentAt: null }
        : { lastVisitAt: now, winBackSentAt: null };

    const [updated] = await db!
      .update(schema.subscribers)
      .set(updates)
      .where(eq(schema.subscribers.id, id))
      .returning({ id: schema.subscribers.id });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Subscriber not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] subscriber-action error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
