export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionStatus } from "@/lib/db/queries";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getUserSubscriptionStatus(userId);
  if (!status) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    planType: status.planType ?? "free",
    subscriptionStatus: status.subscriptionStatus ?? "free",
    referralCode: status.referralCode,
    trialEndsAt: status.trialEndsAt,
    cards: status.cards ?? [],
  });
}
