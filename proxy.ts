import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/apply(.*)",
  "/feedback(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/refunds(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Capture ref query param and store in cookie (90 days)
  const url = req.nextUrl;
  const ref = url.searchParams.get("ref");
  const response = NextResponse.next();

  if (ref && ref.length <= 20) {
    response.cookies.set("amex_ref", ref, {
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
