import type { APIRoute } from "astro";
import { authorizeCron } from "../../../lib/cron-auth";
import { sendDay7Nudges } from "../../../lib/cron";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = authorizeCron(request);
  if (denied) return denied;

  try {
    const result = await sendDay7Nudges();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Cron] day7-nudge error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
