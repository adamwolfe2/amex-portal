import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  referralCode?: string,
  plan: "monthly" | "lifetime" = "lifetime"
): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const isMonthly = plan === "monthly";
  const priceId = isMonthly
    ? process.env.STRIPE_MONTHLY_PRICE_ID!
    : process.env.STRIPE_PRICE_ID!;

  const session = await getStripe().checkout.sessions.create({
    mode: isMonthly ? "subscription" : "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
      ...(referralCode ? { referralCode } : {}),
    },
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/dashboard?checkout=cancel`,
  });

  return session.url;
}
