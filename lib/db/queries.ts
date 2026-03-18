import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { users, benefitClaims, referrals, checklistProgress } from "./schema";

// ── Users ──────────────────────────────────────────────

export async function getUserByClerkId(clerkId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return result[0] ?? null;
}

export async function createUser(data: {
  clerkId: string;
  email: string;
  name?: string;
  referralCode: string;
  referredBy?: string;
}) {
  const result = await db
    .insert(users)
    .values({
      clerkId: data.clerkId,
      email: data.email,
      name: data.name ?? null,
      referralCode: data.referralCode,
      referredBy: data.referredBy ?? null,
    })
    .returning();
  return result[0];
}

export async function getUserByReferralCode(code: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.referralCode, code))
    .limit(1);
  return result[0] ?? null;
}

export async function updateUserSubscription(
  clerkId: string,
  status: string,
  stripeCustomerId?: string
) {
  const values: Record<string, unknown> = {
    subscriptionStatus: status,
    updatedAt: new Date(),
  };
  if (stripeCustomerId !== undefined) {
    values.stripeCustomerId = stripeCustomerId;
  }
  const result = await db
    .update(users)
    .set(values)
    .where(eq(users.clerkId, clerkId))
    .returning();
  return result[0] ?? null;
}

export async function updateUserCards(clerkId: string, cards: string[]) {
  const result = await db
    .update(users)
    .set({ cards, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();
  return result[0] ?? null;
}

// ── Benefit Claims ─────────────────────────────────────

export async function createBenefitClaim(data: {
  userId: number;
  benefitId: string;
  amount?: string;
  period?: string;
  notes?: string;
}) {
  const result = await db
    .insert(benefitClaims)
    .values({
      userId: data.userId,
      benefitId: data.benefitId,
      amount: data.amount ?? null,
      period: data.period ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return result[0];
}

export async function getUserClaims(userId: number) {
  return db
    .select()
    .from(benefitClaims)
    .where(eq(benefitClaims.userId, userId));
}

export async function deleteBenefitClaim(id: number, userId: number) {
  const result = await db
    .delete(benefitClaims)
    .where(
      and(eq(benefitClaims.id, id), eq(benefitClaims.userId, userId))
    )
    .returning();
  return result[0] ?? null;
}

// ── Referrals ──────────────────────────────────────────

export async function createReferral(data: {
  referrerId: number;
  referredUserId: number;
  status?: string;
  stripePaymentId?: string;
  commissionAmount?: string;
}) {
  const result = await db
    .insert(referrals)
    .values({
      referrerId: data.referrerId,
      referredUserId: data.referredUserId,
      status: data.status ?? "pending",
      stripePaymentId: data.stripePaymentId ?? null,
      commissionAmount: data.commissionAmount ?? null,
    })
    .returning();
  return result[0];
}

export async function getReferralsByReferrer(userId: number) {
  return db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId));
}

// ── Checklist Progress ─────────────────────────────────

export async function getChecklistProgress(userId: number) {
  return db
    .select()
    .from(checklistProgress)
    .where(eq(checklistProgress.userId, userId));
}

export async function updateChecklistItem(
  userId: number,
  itemId: string,
  completed: boolean
) {
  // Upsert: update if exists, insert if not
  const existing = await db
    .select()
    .from(checklistProgress)
    .where(
      and(
        eq(checklistProgress.userId, userId),
        eq(checklistProgress.itemId, itemId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const result = await db
      .update(checklistProgress)
      .set({
        completed,
        completedAt: completed ? new Date() : null,
      })
      .where(
        and(
          eq(checklistProgress.userId, userId),
          eq(checklistProgress.itemId, itemId)
        )
      )
      .returning();
    return result[0];
  }

  const result = await db
    .insert(checklistProgress)
    .values({
      userId,
      itemId,
      completed,
      completedAt: completed ? new Date() : null,
    })
    .returning();
  return result[0];
}
