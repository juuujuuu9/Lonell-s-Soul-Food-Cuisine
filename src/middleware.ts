import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export const onRequest = clerkMiddleware((auth, request) => {
  if (isAdminRoute(request)) {
    const { has } = auth();
    const hasAdminRole = has({ permission: "org:admin" });
    if (!hasAdminRole) {
      return new Response("Unauthorized", { status: 403 });
    }
  }
});
