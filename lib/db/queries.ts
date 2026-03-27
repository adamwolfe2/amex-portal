import { cache } from "react";
import { eq, and, inArray, gte, lt, desc, sql } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  benefitClaims,
  referrals,
  checklistProgress,
  ambassadorApplications,
  feedbackResponses,
  communityTips,
} from "./schema";

// ── Users ──────────────────────────────────────────────

export const getUserByClerkId = cache(async (clerkId: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return result[0] ?? null;
});

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

export async function updateUserPlan(
  clerkId: string,
  planType: string,
  extras?: {
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    trialEndsAt?: Date | null;
    subscriptionStatus?: string;
  }
) {
  const values: Record<string, unknown> = {
    planType,
    updatedAt: new Date(),
  };
  if (extras?.stripeSubscriptionId !== undefined) {
    values.stripeSubscriptionId = extras.stripeSubscriptionId;
  }
  if (extras?.stripeCustomerId !== undefined) {
    values.stripeCustomerId = extras.stripeCustomerId;
  }
  if (extras?.trialEndsAt !== undefined) {
    values.trialEndsAt = extras.trialEndsAt;
  }
  if (extras?.subscriptionStatus !== undefined) {
    values.subscriptionStatus = extras.subscriptionStatus;
  }
  const result = await db
    .update(users)
    .set(values)
    .where(eq(users.clerkId, clerkId))
    .returning();
  return result[0] ?? null;
}

export async function getUserByStripeSubscriptionId(subscriptionId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscriptionId))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserSubscriptionStatus(clerkId: string) {
  const result = await db
    .select({
      planType: users.planType,
      subscriptionStatus: users.subscriptionStatus,
      referralCode: users.referralCode,
      trialEndsAt: users.trialEndsAt,
      cards: users.cards,
      stripeSubscriptionId: users.stripeSubscriptionId,
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
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

export async function getPaidUsers() {
  return db.select().from(users).where(
    inArray(users.subscriptionStatus, ["pro", "active", "trialing", "past_due"])
  );
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

export const getUserClaims = cache(async (userId: number, limit = 200) => {
  return db
    .select()
    .from(benefitClaims)
    .where(eq(benefitClaims.userId, userId))
    .orderBy(desc(benefitClaims.claimedAt))
    .limit(limit);
});

export async function getUserClaimsForYear(userId: number, year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return db
    .select()
    .from(benefitClaims)
    .where(
      and(
        eq(benefitClaims.userId, userId),
        gte(benefitClaims.claimedAt, start),
        lt(benefitClaims.claimedAt, end)
      )
    );
}

export async function getClaimForPeriod(
  userId: number,
  benefitId: string,
  period: string
) {
  const result = await db
    .select()
    .from(benefitClaims)
    .where(
      and(
        eq(benefitClaims.userId, userId),
        eq(benefitClaims.benefitId, benefitId),
        eq(benefitClaims.period, period)
      )
    )
    .limit(1);
  return result[0] ?? null;
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

export async function getReferralsByReferrer(userId: number, limit = 100) {
  return db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(referrals.createdAt))
    .limit(limit);
}

// ── Checklist Progress ─────────────────────────────────

export const getChecklistProgress = cache(async (userId: number) => {
  return db
    .select()
    .from(checklistProgress)
    .where(eq(checklistProgress.userId, userId));
});

export async function updateChecklistItem(
  userId: number,
  itemId: string,
  completed: boolean
) {
  const result = await db
    .insert(checklistProgress)
    .values({
      userId,
      itemId,
      completed,
      completedAt: completed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [checklistProgress.userId, checklistProgress.itemId],
      set: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })
    .returning();
  return result[0];
}

// ── Admin ─────────────────────────────────────────────

export async function getAdminStats() {
  const [userCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [paidCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(
      inArray(users.subscriptionStatus, ["pro", "active", "trialing"])
    );

  const [referralCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(referrals);

  const [paidReferralCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(referrals)
    .where(eq(referrals.status, "paid"));

  const [applicationCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ambassadorApplications);

  const [pendingApplicationCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ambassadorApplications)
    .where(eq(ambassadorApplications.status, "pending"));

  const [feedbackCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(feedbackResponses);

  return {
    totalUsers: Number(userCount.count),
    paidUsers: Number(paidCount.count),
    totalReferrals: Number(referralCount.count),
    paidReferrals: Number(paidReferralCount.count),
    totalApplications: Number(applicationCount.count),
    pendingApplications: Number(pendingApplicationCount.count),
    totalFeedback: Number(feedbackCount.count),
  };
}

export async function getRecentUsers(limit = 10) {
  return db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function getRecentApplications(limit = 5) {
  return db
    .select()
    .from(ambassadorApplications)
    .orderBy(desc(ambassadorApplications.createdAt))
    .limit(limit);
}

// ── Community Tips ──────────────────────────────────────

export async function createCommunityTip(data: {
  userId: number;
  title: string;
  body: string;
  card: string;
  category?: string;
}) {
  const result = await db
    .insert(communityTips)
    .values({
      userId: data.userId,
      title: data.title,
      body: data.body,
      card: data.card,
      category: data.category ?? null,
    })
    .returning();
  return result[0];
}

export async function getPendingTips(limit = 20) {
  return db
    .select({
      id: communityTips.id,
      userId: communityTips.userId,
      title: communityTips.title,
      body: communityTips.body,
      card: communityTips.card,
      category: communityTips.category,
      status: communityTips.status,
      createdAt: communityTips.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(communityTips)
    .leftJoin(users, eq(communityTips.userId, users.id))
    .where(eq(communityTips.status, "pending"))
    .orderBy(desc(communityTips.createdAt))
    .limit(limit);
}

export async function updateTipStatus(id: number, status: string) {
  const result = await db
    .update(communityTips)
    .set({ status })
    .where(eq(communityTips.id, id))
    .returning();
  return result[0] ?? null;
}
