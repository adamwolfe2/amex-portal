import Stripe from "stripe";
import {
  getUserByClerkId,
  getUserByReferralCode,
  updateUserSubscription,
  createReferral,
} from "@/lib/db/queries";
import { calculateCommission } from "@/lib/referral";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe webhook signature verification failed: ${message}`);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const referralCode = session.metadata?.referralCode;
    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : undefined;

    if (!userId) {
      console.error("Stripe webhook: missing userId in session metadata");
      return Response.json(
        { error: "Missing userId metadata" },
        { status: 400 }
      );
    }

    // Upgrade user to pro
    await updateUserSubscription(userId, "pro", stripeCustomerId);

    // Handle referral commission
    if (referralCode) {
      const referrer = await getUserByReferralCode(referralCode);
      const purchaser = await getUserByClerkId(userId);

      if (referrer && purchaser) {
        const commission = calculateCommission();
        await createReferral({
          referrerId: referrer.id,
          referredUserId: purchaser.id,
          status: "completed",
          stripePaymentId: session.payment_intent as string,
          commissionAmount: commission.toFixed(2),
        });
      }
    }
  }

  return Response.json({ received: true });
}
