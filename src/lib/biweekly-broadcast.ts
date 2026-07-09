export type EntertainmentSlot = "jazz" | "brunch";

const FORTNIGHT_MS = 14 * 24 * 60 * 60 * 1000;

// ponytail: anchor moves with the env var so new deployments don't need a code change
const DEFAULT_ANCHOR = "2026-01-07T19:00:00.000Z";
const ANCHOR_MS = Date.parse(process.env.BROADCAST_ANCHOR_DATE || DEFAULT_ANCHOR);

export function entertainmentSlot(now = new Date()): EntertainmentSlot {
  const index = Math.floor((now.getTime() - ANCHOR_MS) / FORTNIGHT_MS);
  return index % 2 === 0 ? "jazz" : "brunch";
}

export function isJazzBroadcastWeek(now = new Date()): boolean {
  return entertainmentSlot(now) === "jazz";
}

export function isBrunchBroadcastWeek(now = new Date()): boolean {
  return entertainmentSlot(now) === "brunch";
}

if (import.meta.env?.DEV) {
  console.assert(entertainmentSlot(new Date("2026-01-07T19:00:00.000Z")) === "jazz", "anchor week is jazz");
  console.assert(entertainmentSlot(new Date("2026-01-08T19:00:00.000Z")) === "jazz", "same fortnight stays jazz");
  console.assert(entertainmentSlot(new Date("2026-01-21T19:00:00.000Z")) === "brunch", "next fortnight is brunch");
  console.assert(isJazzBroadcastWeek(new Date("2026-01-07T19:00:00.000Z")), "jazz week gate");
  console.assert(isBrunchBroadcastWeek(new Date("2026-01-21T19:00:00.000Z")), "brunch week gate");
}
