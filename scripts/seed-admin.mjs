#!/usr/bin/env node

/**
 * Seed the first admin user into the staff table.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... node scripts/seed-admin.mjs <clerk_user_id>
 *
 * Find your Clerk user ID:
 *   1. Go to https://dashboard.clerk.com
 *   2. Select your app → Users
 *   3. Click your user → copy the ID (starts with "user_")
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const clerkId = process.argv[2];
if (!clerkId) {
  console.error("\n  Missing Clerk user ID.\n");
  console.error("  Usage: DATABASE_URL=postgresql://... node scripts/seed-admin.mjs <clerk_user_id>\n");
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("\n  DATABASE_URL environment variable is required.\n");
  process.exit(1);
}

const db = drizzle(neon(dbUrl));

try {
  // Check if user already exists
  const [existing] = await db.execute(
    sql`SELECT clerk_id, role FROM staff WHERE clerk_id = ${clerkId}`
  );

  if (existing) {
    console.log(`\n  User ${clerkId} already exists with role: ${existing.role}\n`);
    process.exit(0);
  }

  // Insert as owner
  await db.execute(
    sql`INSERT INTO staff (clerk_id, name, role, email, active)
        VALUES (${clerkId}, 'Admin', 'owner', '', true)`
  );

  console.log(`\n  ✅ User ${clerkId} seeded as owner.\n`);
  console.log("  You can now access /admin\n");
  process.exit(0);
} catch (err) {
  console.error("\n  Failed to seed admin user:", err.message, "\n");
  process.exit(1);
}
