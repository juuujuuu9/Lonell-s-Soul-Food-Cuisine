import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// ponytail: Node 21+ built-in; `.env` is gitignored, so on Vercel DATABASE_URL comes from the platform env
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
