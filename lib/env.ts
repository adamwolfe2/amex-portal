/**
 * Environment variable validation — imported at app startup.
 * Throws if critical env vars are missing; warns for optional ones.
 */

import { logger } from "@/lib/logger";

const required = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;

const optional = [
  "CLERK_WEBHOOK_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_MONTHLY_PRICE_ID",
  "STRIPE_ANNUAL_PRICE_ID",
  "STRIPE_PRICE_ID",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "RESEND_API_KEY",
  "CRON_SECRET",
] as const;

export function validateEnv() {
  // Skip during build (next build sets this)
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (process.env.NODE_ENV === "production") {
    for (const key of optional) {
      if (!process.env[key]) {
        logger.warn("Optional variable not set", { key });
      }
    }
  }
}
