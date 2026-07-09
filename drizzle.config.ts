import { defineConfig } from "drizzle-kit";

// ponytail: Node 21+ built-in; only `.env` needed for DATABASE_URL
process.loadEnvFile(".env");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
