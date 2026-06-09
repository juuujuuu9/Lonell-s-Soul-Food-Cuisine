import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/", "/menu(.*)", "/our-story", "/events(.*)", "/private-events",
  "/reviews", "/faq", "/contact", "/privacy", "/sms-terms", "/accessibility",
  "/api(.*)", "/sign-in(.*)", "/sign-up(.*)",
]);

export const onRequest = clerkMiddleware((auth, request) => {
  const { userId, sessionClaims } = auth();

  // Allow public routes
  if (isPublicRoute(request)) {
    return;
  }

  // Protect admin routes
  if (isAdminRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return Response.redirect(signInUrl.toString());
    }

    // Check role from Clerk user public metadata
    // Set this in Clerk Dashboard: Users → user → Metadata → public → { "role": "owner" }
    const role = sessionClaims?.publicMetadata?.role as string | undefined;
    if (!role || !["owner", "manager"].includes(role)) {
      return new Response("Unauthorized", { status: 403 });
    }
  }
});
