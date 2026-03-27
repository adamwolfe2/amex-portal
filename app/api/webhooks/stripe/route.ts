import Stripe from "stripe";
import {
  getUserByClerkId,
  getUserByReferralCode,
  updateUserPlan,
  createReferral,
  getUserByStripeSubscriptionId,
  getUserByStripeCustomerId,
} from "@/lib/db/queries";
import { calculateCommission } from "@/lib/referral";
import { sendReferralNotification } from "@/lib/email";
import type { PlanType } from "@/lib/referral";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured");
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const referralCode = session.metadata?.referralCode;
        const plan = (session.metadata?.plan as PlanType) ?? "annual";
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : undefined;
        const stripeSubscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : undefined;

        if (!userId) {
          logger.error("Stripe webhook: missing userId in session metadata");
          return Response.json(
            { error: "Missing userId metadata" },
            { status: 400 }
          );
        }

        // Determine trial end if applicable
        let trialEndsAt: Date | null = null;
        if (plan === "annual" && stripeSubscriptionId) {
          try {
            const sub = await getStripe().subscriptions.retrieve(
              stripeSubscriptionId
            );
            if (sub.trial_end) {
              trialEndsAt = new Date(sub.trial_end * 1000);
            }
          } catch {
            // Continue without trial info if retrieval fails
          }
        }

        // Upgrade user
        await updateUserPlan(userId, plan === "lifetime" ? "lifetime" : "pro", {
          stripeCustomerId,
          stripeSubscriptionId,
          trialEndsAt,
          subscriptionStatus: "pro",
        });

        // Handle referral commission (idempotent — duplicate webhook replays are safe)
        if (referralCode) {
          const referrer = await getUserByReferralCode(referralCode);
          const purchaser = await getUserByClerkId(userId);

          if (referrer && purchaser) {
            const commission = calculateCommission(plan);
            try {
              await createReferral({
                referrerId: referrer.id,
                referredUserId: purchaser.id,
                status: "paid",
                stripePaymentId: session.payment_intent as string,
                commissionAmount: commission.toFixed(2),
              });

              // Send referral notification email
              if (referrer.email) {
                const purchaserName = purchaser.name ?? purchaser.email;
                sendReferralNotification(
                  referrer.email,
                  referrer.name,
                  purchaserName,
                  commission,
                  plan
                ).catch(() => {}); // Fire and forget — don't block webhook response
              }
            } catch (err) {
              // Unique constraint violation means referral already exists — safe to ignore
              const message = err instanceof Error ? err.message : String(err);
              if (message.includes("unique") || message.includes("duplicate")) {
                logger.info("Duplicate referral skipped (idempotent)");
              } else {
                throw err;
              }
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await getUserByStripeSubscriptionId(subscription.id);
        if (!user) break;

        const statusMap: Record<string, string> = {
          active: "pro",
          trialing: "pro",
          past_due: "past_due",
          canceled: "free",
          unpaid: "past_due",
          incomplete: "free",
          incomplete_expired: "free",
          paused: "free",
        };

        const newStatus = statusMap[subscription.status] ?? "free";
        const planType = newStatus === "free" ? "free" : user.planType;

        let trialEndsAt: Date | null = null;
        if (subscription.trial_end) {
          trialEndsAt = new Date(subscription.trial_end * 1000);
        }

        await updateUserPlan(user.clerkId, planType ?? "free", {
          subscriptionStatus: newStatus,
          trialEndsAt,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await getUserByStripeSubscriptionId(subscription.id);
        if (!user) break;

        await updateUserPlan(user.clerkId, "free", {
          subscriptionStatus: "free",
          stripeSubscriptionId: undefined,
          trialEndsAt: null,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : null;
        if (!customerId) break;

        const user = await getUserByStripeCustomerId(customerId);
        if (!user) break;

        await updateUserPlan(user.clerkId, user.planType ?? "free", {
          subscriptionStatus: "past_due",
        });
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("Stripe webhook handler error", { error: message });
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return Response.json({ received: true });
}
