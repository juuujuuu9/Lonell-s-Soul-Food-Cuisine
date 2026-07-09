import { eq } from "drizzle-orm";
import { db, schema, isDbReady } from "../db/index";

export interface PosOrderPayload {
  geniusOrderId: string;
  phoneNumber: string;
  items?: { name: string; quantity?: number; price?: string; category?: string }[];
  total?: string;
  promoCode?: string;
  orderType?: "dine_in" | "takeout" | "delivery" | "online";
  orderSource?: string;
  orderedAt?: string;
}

export type ProcessOrderResult =
  | { success: true; subscriberMatched: boolean; promoRedeemed: boolean }
  | { success: false; error: string };

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** ponytail: inline validation avoids pulling in a zod dependency for one endpoint. */
function validatePayload(data: unknown): { valid: false; error: string } | { valid: true; data: PosOrderPayload } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Payload must be a JSON object" };
  }

  const d = data as Record<string, unknown>;

  if (typeof d.geniusOrderId !== "string" || d.geniusOrderId.length === 0) {
    return { valid: false, error: "geniusOrderId is required" };
  }
  if (typeof d.phoneNumber !== "string" || d.phoneNumber.length === 0 || d.phoneNumber.length > 20) {
    return { valid: false, error: "phoneNumber is required (max 20 chars)" };
  }

  const payload: PosOrderPayload = {
    geniusOrderId: d.geniusOrderId,
    phoneNumber: d.phoneNumber,
    total: typeof d.total === "string" ? d.total : undefined,
    promoCode: typeof d.promoCode === "string" ? d.promoCode : undefined,
    orderType: ["dine_in", "takeout", "delivery", "online"].includes(d.orderType as string)
      ? (d.orderType as PosOrderPayload["orderType"])
      : undefined,
    orderSource: typeof d.orderSource === "string" ? d.orderSource : undefined,
    orderedAt: typeof d.orderedAt === "string" ? d.orderedAt : undefined,
  };

  if (Array.isArray(d.items)) {
    payload.items = d.items
      .filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        name: String(item.name ?? ""),
        quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
        price: typeof item.price === "string" ? item.price : undefined,
        category: typeof item.category === "string" ? item.category : undefined,
      }))
      .filter((item) => item.name.length > 0);
  }

  return { valid: true, data: payload };
}

export async function processPosOrder(data: unknown): Promise<ProcessOrderResult> {
  if (!isDbReady()) {
    return { success: false, error: "Database not configured" };
  }

  const validation = validatePayload(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const { geniusOrderId, phoneNumber, items, total, promoCode, orderType, orderSource, orderedAt } = validation.data;

  const normalizedPhone = normalizePhone(phoneNumber);
  if (normalizedPhone.length < 10) {
    return { success: false, error: "Phone number too short after normalization" };
  }

  // Find matching subscriber
  const [subscriber] = await db
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.phoneNumber, normalizedPhone))
    .limit(1);

  const subscriberId = subscriber?.id ?? null;
  const subscriberMatched = subscriber !== undefined;

  // Mark known promos as redeemed (only once)
  const knownPromos = ["SOUL10"];
  let promoRedeemed = false;
  if (promoCode && subscriber && !subscriber.promoRedeemed) {
    if (knownPromos.includes(promoCode.trim().toUpperCase())) {
      await db
        .update(schema.subscribers)
        .set({ promoRedeemed: true })
        .where(eq(schema.subscribers.id, subscriber.id));
      promoRedeemed = true;
    }
  }

  // Update last visit for matched subscribers
  if (subscriber) {
    await db
      .update(schema.subscribers)
      .set({ lastVisitAt: new Date() })
      .where(eq(schema.subscribers.id, subscriber.id));
  }

  // Record the order (skip if duplicate geniusOrderId)
  const orderTimestamp = orderedAt ? new Date(orderedAt) : new Date();
  await db
    .insert(schema.posOrders)
    .values({
      phoneNumber: normalizedPhone,
      subscriberId,
      geniusOrderId,
      items: items ?? null,
      total: total ?? null,
      promoCode: promoCode ?? null,
      promoRedeemed,
      orderType: orderType ?? null,
      orderSource: orderSource ?? null,
      rawPayload: data as Record<string, unknown>,
      orderedAt: orderTimestamp,
    })
    .onConflictDoNothing({ target: schema.posOrders.geniusOrderId });

  return { success: true, subscriberMatched, promoRedeemed };
}
