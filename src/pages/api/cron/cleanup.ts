import type { APIRoute } from "astro";
import { cleanupOldOptOuts } from "../../../lib/cron";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const count = await cleanupOldOptOuts();
    return new Response(JSON.stringify({ removed: count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Cron] cleanup error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
