export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user?.stripeCustomerId) {
      return Response.json(
        { error: "No billing account found" },
        { status: 404 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    logger.error("Failed to create billing portal session", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
