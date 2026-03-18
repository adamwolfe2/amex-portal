export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getUserByClerkId } from "@/lib/db/queries";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const dbUser = await getUserByClerkId(userId);
  const referralCode = dbUser?.referredBy ?? undefined;
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  const url = await createCheckoutSession(userId, email, referralCode);

  if (!url) {
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }

  return Response.json({ url });
}
