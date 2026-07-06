import { createClerkClient } from "@clerk/astro/server";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { staff } from "../db/schema";

const ADMIN_ROLES = ["owner", "manager", "staff"] as const;

export function isAdminRole(role: string | undefined): boolean {
  return !!(role && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]));
}

function roleFromSessionClaims(sessionClaims: Record<string, unknown> | null | undefined): string | undefined {
  const metadata = sessionClaims?.publicMetadata;
  if (!metadata || typeof metadata !== "object") return undefined;
  const role = (metadata as Record<string, unknown>).role;
  return typeof role === "string" ? role : undefined;
}

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(neon(process.env.DATABASE_URL), { schema: { staff } });
  }
  return _db;
}

async function roleFromStaffTable(userId: string): Promise<string | undefined> {
  const db = getDb();
  if (!db) return undefined;
  try {
    const [member] = await db
      .select({ role: staff.role, active: staff.active })
      .from(staff)
      .where(eq(staff.clerkId, userId))
      .limit(1);
    if (!member?.active) return undefined;
    return member.role ?? undefined;
  } catch (e) {
    console.error("[admin-auth] staff lookup failed:", e);
    return undefined;
  }
}

async function roleFromClerkApi(userId: string): Promise<string | undefined> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return undefined;
  try {
    const client = createClerkClient({ secretKey });
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;
    return typeof role === "string" ? role : undefined;
  } catch (e) {
    console.error("[admin-auth] Clerk user lookup failed:", e);
    return undefined;
  }
}

export async function authorizeAdmin(
  userId: string,
  sessionClaims: Record<string, unknown> | null | undefined,
): Promise<boolean> {
  const dbRole = await roleFromStaffTable(userId);
  if (isAdminRole(dbRole)) return true;

  const jwtRole = roleFromSessionClaims(sessionClaims);
  if (isAdminRole(jwtRole)) return true;

  const apiRole = await roleFromClerkApi(userId);
  return isAdminRole(apiRole);
}
