import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  handle: z.string().min(1).max(200),
  platform: z.enum([
    "Instagram",
    "TikTok",
    "YouTube",
    "Twitter/X",
    "Blog",
    "Other",
  ]),
  followerCount: z.enum([
    "<1K",
    "1K-10K",
    "10K-50K",
    "50K-100K",
    "100K+",
  ]),
  cards: z.array(z.string().max(50)).max(10).default([]),
  reason: z.string().max(2000).optional(),
});

export const feedbackSchema = z.object({
  email: z.string().email().max(320),
  cards: z.array(z.string().max(50)).max(10).default([]),
  mainProblem: z.string().min(1).max(2000),
  wishFeature: z.string().min(1).max(2000),
  priceWillingness: z.string().min(1).max(100),
  currentTracking: z.array(z.string().max(100)).max(10).default([]),
  additionalNotes: z.string().max(5000).optional(),
});

export const checkoutSchema = z.object({
  plan: z.enum(["monthly", "annual", "lifetime"]).default("annual"),
});

export const claimsCreateSchema = z.object({
  benefitId: z.string().min(1).max(200),
  amount: z.string().max(50).optional(),
  period: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export const onboardingSchema = z.object({
  cards: z
    .array(z.enum(["platinum", "gold"]))
    .min(0)
    .max(2),
});

export const checklistSchema = z.object({
  itemId: z.string().min(1).max(200),
  completed: z.boolean(),
});
