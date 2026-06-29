export function authorizeCron(request: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[Cron] CRON_SECRET is not configured");
    return new Response(JSON.stringify({ error: "Cron not configured" }), {
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
