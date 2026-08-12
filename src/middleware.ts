import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { authorizeAdmin } from "./lib/admin-auth";
import { adminApiError } from "./lib/admin-api";
import { serverEnv } from "./lib/env";

const SITE_URL = serverEnv("PUBLIC_SITE_URL") || "https://lonellssoulfood.com";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/", "/menu(.*)", "/our-story", "/entertainment(.*)", "/private-events",
  "/reviews", "/faq", "/contact", "/join", "/sms", "/a2p-opt-in-proof",
  "/privacy", "/privacy-policy", "/terms", "/terms-and-conditions", "/sms-terms",
  "/accessibility", "/sign-in(.*)", "/sign-up(.*)", "/access-denied",
]);
const isPublicApiRoute = createRouteMatcher([
  "/api/sms-subscribe", "/api/sms-webhook", "/api/sms-status-callback",
  "/api/cron(.*)",
]);

function urlWithBase(urlStr: string): string {
  // Use SITE_URL as the base so redirects are absolute – Clerk uses this for
  // post-sign-in redirects. If the URL is already absolute, return as-is.
  if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) return urlStr;
  return `${SITE_URL}${urlStr.startsWith("/") ? "" : "/"}${urlStr}`;
}

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
      const signInUrl = new URL("/sign-in", SITE_URL);
      signInUrl.searchParams.set("redirect_url", urlWithBase(urlStr));
      return Response.redirect(signInUrl.toString());
    }

    if (await authorizeAdmin(userId, sessionClaims)) {
      return;
    }

    if (urlStr.includes("/api/")) {
      return adminApiError(403);
    }
    return Response.redirect(new URL("/access-denied", SITE_URL).toString());
  }
});
