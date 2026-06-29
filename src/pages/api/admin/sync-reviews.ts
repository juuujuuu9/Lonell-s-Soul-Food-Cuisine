import type { APIRoute } from "astro";
import { syncReviews } from "../../../lib/reviews/sync";

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const result = await syncReviews();
    const hasError = result.google.error && !result.google.upserted;
    const status = hasError ? 502 : 200;
    return new Response(JSON.stringify(result), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] sync-reviews error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
