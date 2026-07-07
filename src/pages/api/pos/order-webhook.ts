import type { APIRoute } from "astro";
import { authorizePosWebhook } from "../../../lib/pos-webhook-auth";
import { processPosOrder } from "../../../lib/pos-process-order";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const denied = authorizePosWebhook(request);
  if (denied) return denied;

  try {
    const data = await request.json();
    const result = await processPosOrder(data);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriberMatched: result.subscriberMatched,
        promoRedeemed: result.promoRedeemed,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[POS Webhook] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
