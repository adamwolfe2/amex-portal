import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerk_id").unique().notNull(),
    email: text("email").notNull(),
    name: text("name"),
    referralCode: text("referral_code").unique().notNull(),
    referredBy: text("referred_by"),
    cards: json("cards").$type<string[]>().default([]),
    subscriptionStatus: text("subscription_status").default("free"),
    planType: text("plan_type").default("free"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    trialEndsAt: timestamp("trial_ends_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("users_clerk_id_idx").on(table.clerkId),
    index("users_referral_code_idx").on(table.referralCode),
    index("users_email_idx").on(table.email),
  ]
);

export const benefitClaims = pgTable(
  "benefit_claims",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    benefitId: text("benefit_id").notNull(),
    claimedAt: timestamp("claimed_at").defaultNow(),
    amount: numeric("amount"),
    period: text("period"),
    notes: text("notes"),
  },
  (table) => [
    index("benefit_claims_user_id_idx").on(table.userId),
    index("benefit_claims_benefit_id_idx").on(table.benefitId),
  ]
);

export const referrals = pgTable(
  "referrals",
  {
    id: serial("id").primaryKey(),
    referrerId: integer("referrer_id")
      .references(() => users.id)
      .notNull(),
    referredUserId: integer("referred_user_id")
      .references(() => users.id)
      .notNull(),
    status: text("status").default("pending"),
    stripePaymentId: text("stripe_payment_id"),
    commissionAmount: numeric("commission_amount"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("referrals_referrer_id_idx").on(table.referrerId),
    index("referrals_referred_user_id_idx").on(table.referredUserId),
    uniqueIndex("referrals_referrer_referred_unique").on(table.referrerId, table.referredUserId),
  ]
);

export const ambassadorApplications = pgTable("ambassador_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  handle: text("handle").notNull(),
  platform: text("platform").notNull(),
  followerCount: text("follower_count").notNull(),
  cards: json("cards").$type<string[]>().default([]),
  reason: text("reason"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbackResponses = pgTable("feedback_responses", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  cards: json("cards").$type<string[]>().default([]),
  mainProblem: text("main_problem").notNull(),
  wishFeature: text("wish_feature").notNull(),
  priceWillingness: text("price_willingness").notNull(),
  currentTracking: json("current_tracking").$type<string[]>().default([]),
  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const checklistProgress = pgTable(
  "checklist_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    itemId: text("item_id").notNull(),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("checklist_progress_user_id_idx").on(table.userId),
    uniqueIndex("checklist_progress_user_item_unique").on(table.userId, table.itemId),
  ]
);
