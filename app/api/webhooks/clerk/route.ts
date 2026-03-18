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
  // Basic webhook verification via Clerk webhook secret
  // For production, consider using svix for full signature verification
  const body = await request.text();

  let event: ClerkWebhookEvent;
  try {
    event = JSON.parse(body) as ClerkWebhookEvent;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const { id: clerkId, email_addresses, first_name, last_name, unsafe_metadata } = event.data;

    const email = email_addresses[0]?.email_address;
    if (!email) {
      return Response.json({ error: "No email found" }, { status: 400 });
    }

    // Check if user already exists (idempotency)
    const existing = await getUserByClerkId(clerkId);
    if (existing) {
      return Response.json({ received: true });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;
    const referralCode = generateReferralCode();

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
    const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

    // Sync email/name changes
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
