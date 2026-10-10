#!/usr/bin/env node
/**
 * Wipes SMS subscribers and message log for a clean opt-in list.
 * Keeps pos_orders but clears subscriber_id links.
 *
 * Usage: node scripts/reset-sms-subscribers.mjs --confirm
 */
import { existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (existsSync(".env")) process.loadEnvFile(".env");
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

if (!process.argv.includes("--confirm")) {
  console.error("Refusing to run without --confirm (deletes all subscribers and messages).");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

const [subCount] = await sql`SELECT COUNT(*)::int AS n FROM subscribers`;
const [msgCount] = await sql`SELECT COUNT(*)::int AS n FROM messages`;

console.log(`Before: ${subCount.n} subscribers, ${msgCount.n} messages`);

await sql`UPDATE pos_orders SET subscriber_id = NULL WHERE subscriber_id IS NOT NULL`;
await sql`DELETE FROM messages`;
await sql`DELETE FROM subscribers`;
await sql`ALTER SEQUENCE subscribers_id_seq RESTART WITH 1`;
await sql`ALTER SEQUENCE messages_id_seq RESTART WITH 1`;

const [subAfter] = await sql`SELECT COUNT(*)::int AS n FROM subscribers`;
const [msgAfter] = await sql`SELECT COUNT(*)::int AS n FROM messages`;

console.log(`After: ${subAfter.n} subscribers, ${msgAfter.n} messages`);
console.log("Done. POS orders kept; subscriber links cleared.");
