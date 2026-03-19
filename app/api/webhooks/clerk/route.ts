import { Webhook } from "svix";
import {
  createUser,
  getUserByClerkId,
  getUserByReferralCode,
} from "@/lib/db/queries";
import { generateReferralCode } from "@/lib/referral";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name?: string | null;
    last_name?: string | null;
    unsafe_metadata?: Record<string, unknown>;
  };
}

export async function POST(request: Request) {
  const body = await request.text();

  // Svix signature verification
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      unsafe_metadata,
    } = event.data;

    const email = email_addresses[0]?.email_address;
    if (!email) {
      return Response.json({ error: "No email found" }, { status: 400 });
    }

    // Idempotency check
    const existing = await getUserByClerkId(clerkId);
    if (existing) {
      return Response.json({ received: true });
    }

    const name =
      [first_name, last_name].filter(Boolean).join(" ") || undefined;

    // Generate referral code with uniqueness retry
    let referralCode = generateReferralCode();
    let retries = 0;
    while (retries < 5) {
      const collision = await getUserByReferralCode(referralCode);
      if (!collision) break;
      referralCode = generateReferralCode();
      retries++;
    }

    if (retries >= 5) {
      console.error("Referral code generation failed after 5 retries");
      return Response.json(
        { error: "Referral code generation failed" },
        { status: 500 }
      );
    }

    // Check for referral from unsafe_metadata (set during sign-up from cookie)
    const refCode = (unsafe_metadata?.amex_ref as string) ?? undefined;
    let referredBy: string | undefined;

    if (refCode) {
      const referrer = await getUserByReferralCode(refCode);
      if (referrer) {
        referredBy = referrer.referralCode;
      }
    }

    await createUser({
      clerkId,
      email,
      name,
      referralCode,
      referredBy,
    });
  }

  if (event.type === "user.updated") {
    const { id: clerkId, email_addresses, first_name, last_name } = event.data;

    const existing = await getUserByClerkId(clerkId);
    if (!existing) {
      return Response.json({ received: true });
    }

    const email = email_addresses[0]?.email_address;
    const name =
      [first_name, last_name].filter(Boolean).join(" ") || undefined;

    if (email || name) {
      const { db } = await import("@/lib/db");
      const { users } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");

      await db
        .update(users)
        .set({
          ...(email ? { email } : {}),
          ...(name ? { name } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkId));
    }
  }

  return Response.json({ received: true });
}
