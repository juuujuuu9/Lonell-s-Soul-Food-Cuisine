import type { APIRoute } from "astro";
import { authorizeCron } from "../../../lib/cron-auth";
import { sendWeeklyBrunch } from "../../../lib/cron";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = authorizeCron(request);
  if (denied) return denied;

  try {
    const result = await sendWeeklyBrunch();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Cron] weekly-brunch error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
