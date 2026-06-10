import type { APIRoute } from "astro";
import { sendWeeklyPromo } from "../../../lib/cron";

export const prerender = false;

// Vercel Cron Job endpoint. Configure in vercel.json or dashboard.
export const GET: APIRoute = async () => {
  try {
    const result = await sendWeeklyPromo();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Cron] weekly-promo error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
