import type { APIRoute } from "astro";
import { db, schema, isDbReady } from "../../db/index";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const messageSid = formData.get("MessageSid")?.toString();
    const messageStatus = formData.get("MessageStatus")?.toString();

    if (!messageSid || !messageStatus) {
      return new Response("Missing MessageSid or MessageStatus", { status: 400 });
    }

    if (!isDbReady()) {
      return new Response("OK", { status: 200 }); // Twilio will retry if we 5xx; 2xx means "got it"
    }

    const status = normalizeStatus(messageStatus);

    await db!
      .update(schema.messages)
      .set({ status })
      .where(eq(schema.messages.twilioSid, messageSid));

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[SMS Status Callback] Error:", err);
    return new Response("OK", { status: 200 }); // Swallow to prevent Twilio retries on our internal errors
  }
};

/*
  Map Twilio's MessageStatus values to our schema's status column.

  Twilio sends: queued, sent, delivered, failed, undelivered, read,
  accepted, scheduled, canceled, receiving, received.

  Our schema only stores: pending, sent, delivered, failed, simulated.
  Everything else collapses to one of these.
*/
function normalizeStatus(twilioStatus: string): string {
  switch (twilioStatus) {
    case "delivered":
    case "read":
    case "received":
      return "delivered";
    case "failed":
    case "undelivered":
      return "failed";
    case "sent":
    case "accepted":
    case "queued":
    case "scheduled":
      return "sent";
    default:
      // canceled, receiving, or any unknown value
      return twilioStatus === "canceled" ? "failed" : "sent";
  }
}
