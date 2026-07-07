export function authorizePosWebhook(request: Request): Response | null {
  const secret = process.env.POS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[POS Webhook] POS_WEBHOOK_SECRET is not configured — webhook disabled");
    return new Response(JSON.stringify({ error: "Webhook not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
