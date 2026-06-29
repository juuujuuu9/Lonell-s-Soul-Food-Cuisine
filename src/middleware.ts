import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { staff } from "./db/schema";
import { eq } from "drizzle-orm";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/", "/menu(.*)", "/our-story", "/events(.*)", "/private-events",
  "/reviews", "/faq", "/contact", "/join", "/privacy", "/terms", "/sms-terms", "/accessibility",
  "/sign-in(.*)", "/sign-up(.*)",
]);
// API routes that must stay public (webhooks, cron, subscribe)
const isPublicApiRoute = createRouteMatcher([
  "/api/sms-subscribe", "/api/sms-webhook", "/api/sms-status-callback",
  "/api/cron(.*)",
]);

// Lazy-init DB connection for auth lookups
let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(neon(process.env.DATABASE_URL), { schema: { staff } });
  }
  return _db;
}

async function authorizeStaff(userId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const [staffMember] = await db
      .select({ role: staff.role })
      .from(staff)
      .where(eq(staff.clerkId, userId))
      .limit(1);
    const role = staffMember?.role;
    return !!(role && ["owner", "manager"].includes(role));
  } catch (e) {
    console.error("[middleware] DB role lookup failed:", e);
    return false;
  }
}

export const onRequest = clerkMiddleware(async (auth, request) => {
  const { userId } = auth();

  // Allow public routes
  if (isPublicRoute(request) || isPublicApiRoute(request)) {
    return;
  }

  // Protect admin routes (pages + API)
  if (isAdminRoute(request)) {
    if (!userId) {
      const urlStr = typeof request.url === "string" ? request.url : request.url.toString();
      if (urlStr.includes("/api/")) {
        return new Response("Unauthorized", { status: 401 });
      }
      const signInUrl = new URL("/sign-in", urlStr);
      signInUrl.searchParams.set("redirect_url", urlStr);
      return Response.redirect(signInUrl.toString());
    }

    if (await authorizeStaff(userId)) {
      return;
    }

    return new Response("Unauthorized", { status: 403 });
  }
});
