import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL;

const _db = dbUrl ? drizzle(neon(dbUrl), { schema }) : null;

export const db: ReturnType<typeof drizzle> = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_, prop) {
      if (!_db) {
        throw new Error(
          "\n  DATABASE_URL is not set\n" +
          "  ─────────────────────────────\n" +
          "  Add it to your .env.local file:\n\n" +
          "    DATABASE_URL=postgresql://user:password@host:5432/dbname\n\n" +
          "  Then restart the dev server.\n"
        );
      }
      return Reflect.get(_db, prop, _db);
    },
  }
);

export { schema };
export function isDbReady(): boolean {
  return _db !== null;
}
