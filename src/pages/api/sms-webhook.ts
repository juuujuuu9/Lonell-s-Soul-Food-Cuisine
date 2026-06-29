import type { APIRoute } from "astro";
import { handleInbound, logOutboundMessage } from "../../lib/sms";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const from = formData.get("From")?.toString();
    const body = formData.get("Body")?.toString();

    if (!from || !body) {
      return new Response("Missing From or Body", { status: 400 });
    }

    const reply = await handleInbound(from, body);
    await logOutboundMessage(from, reply);

    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(reply)}</Message></Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("[SMS Webhook] Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
