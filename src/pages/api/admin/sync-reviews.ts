import type { APIRoute } from "astro";
import { syncReviews } from "../../../lib/reviews/sync";

export const prerender = false;

export const config = {
  maxDuration: 30,
};

export const POST: APIRoute = async () => {
  try {
    const result = await syncReviews();
    const googleFailed = !!result.google.error && result.google.upserted === 0;
    const status = googleFailed ? 502 : 200;
    return new Response(JSON.stringify(result), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] sync-reviews error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
