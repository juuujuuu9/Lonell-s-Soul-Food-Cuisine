import type { APIRoute } from "astro";
import { authorizeCron } from "../../../lib/cron-auth";
import { cleanupOldOptOuts } from "../../../lib/cron";

export const prerender = false;
export const config = { maxDuration: 300 };

export const GET: APIRoute = async ({ request }) => {
  const denied = authorizeCron(request);
  if (denied) return denied;

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
