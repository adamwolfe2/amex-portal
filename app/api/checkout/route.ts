export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getUserByClerkId } from "@/lib/db/queries";
import { checkoutSchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(ip);
  if (!ok) return getRateLimitResponse();

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = checkoutSchema.safeParse(body);
  const plan = parsed.success ? parsed.data.plan : "annual";

  try {
    const dbUser = await getUserByClerkId(userId);
    const referralCode = dbUser?.referredBy ?? undefined;
    const email = user.emailAddresses[0]?.emailAddress ?? "";

    const url = await createCheckoutSession(userId, email, referralCode, plan);

    if (!url) {
      return Response.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Checkout session error", { error: message });
    const isMissingConfig = message.includes("Missing Stripe price ID") || message.includes("STRIPE");
    return Response.json(
      { error: isMissingConfig
          ? "Payment system is not configured yet. Please try again later."
          : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
