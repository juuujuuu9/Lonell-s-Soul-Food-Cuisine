import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { authorizeAdmin } from "./lib/admin-auth";
import { adminApiError } from "./lib/admin-api";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/", "/menu(.*)", "/our-story", "/entertainment(.*)", "/private-events",
  "/reviews", "/faq", "/contact", "/join", "/privacy", "/terms", "/sms-terms", "/accessibility",
  "/sign-in(.*)", "/sign-up(.*)", "/access-denied",
]);
const isPublicApiRoute = createRouteMatcher([
  "/api/sms-subscribe", "/api/sms-webhook", "/api/sms-status-callback",
  "/api/cron(.*)",
]);

export const onRequest = clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = auth();

  if (isPublicRoute(request) || isPublicApiRoute(request)) {
    return;
  }

  if (isAdminRoute(request)) {
    const urlStr = typeof request.url === "string" ? request.url : request.url.toString();

    if (!userId) {
      if (urlStr.includes("/api/")) {
        return adminApiError(401);
      }
      const signInUrl = new URL("/sign-in", urlStr);
      signInUrl.searchParams.set("redirect_url", urlStr);
      return Response.redirect(signInUrl.toString());
    }

    if (await authorizeAdmin(userId, sessionClaims)) {
      return;
    }

    if (urlStr.includes("/api/")) {
      return adminApiError(403);
    }
    return Response.redirect(new URL("/access-denied", urlStr).toString());
  }
});
