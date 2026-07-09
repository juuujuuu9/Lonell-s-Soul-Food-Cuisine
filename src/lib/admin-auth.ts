import { createClerkClient } from "@clerk/astro/server";
import { eq } from "drizzle-orm";
import { db, isDbReady } from "../db/index";
import { staff } from "../db/schema";

const ADMIN_ROLES = ["owner", "manager", "staff"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string | undefined): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

interface SessionClaims {
  publicMetadata?: {
    role?: string;
  };
}

function roleFromSessionClaims(sessionClaims: SessionClaims | null | undefined): string | undefined {
  return sessionClaims?.publicMetadata?.role;
}

async function roleFromStaffTable(userId: string): Promise<string | undefined> {
  if (!isDbReady()) return undefined;
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
  sessionClaims: unknown,
): Promise<boolean> {
  const dbRole = await roleFromStaffTable(userId);
  if (isAdminRole(dbRole)) return true;

  const claims = sessionClaims as SessionClaims | null | undefined;
  const jwtRole = roleFromSessionClaims(claims);
  if (isAdminRole(jwtRole)) return true;

  const apiRole = await roleFromClerkApi(userId);
  return isAdminRole(apiRole);
}
