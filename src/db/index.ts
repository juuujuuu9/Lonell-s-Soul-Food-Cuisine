import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error(
    "\n  ⚠ DATABASE_URL is not set\n" +
    "  ─────────────────────────────\n" +
    "  Add it to your .env.local file:\n\n" +
    "    DATABASE_URL=postgresql://user:password@host:5432/dbname\n\n" +
    "  Get your database URL from:\n" +
    "    • Neon Console: https://console.neon.tech\n" +
    "    • Vercel: Dashboard → Storage → Neon\n" +
    "  Then restart the dev server.\n"
  );
}

const sql = dbUrl ? neon(dbUrl) : null;
export const db = sql ? drizzle(sql, { schema }) : null;
export { schema };
export function isDbReady(): boolean {
  return db !== null;
}
