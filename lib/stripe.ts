import Stripe from "stripe";
import type { PlanType } from "./referral";

let _stripe: Stripe | null = null;
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

function getPriceId(plan: PlanType): string {
  const ids: Record<PlanType, string | undefined> = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_ANNUAL_PRICE_ID,
    lifetime: process.env.STRIPE_PRICE_ID,
  };
  const id = ids[plan];
  if (!id) {
    throw new Error(`Missing Stripe price ID for plan: ${plan}`);
  }
  return id;
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  referralCode?: string,
  plan: PlanType = "annual"
): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }
  const isRecurring = plan === "monthly" || plan === "annual";
  const priceId = getPriceId(plan);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: isRecurring ? "subscription" : "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId,
      plan,
      ...(referralCode ? { referralCode } : {}),
    },
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/dashboard?checkout=cancel`,
  };

  // 7-day free trial on annual plan
  if (plan === "annual") {
    sessionParams.subscription_data = {
      trial_period_days: 7,
    };
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);
  return session.url;
}
