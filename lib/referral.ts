import { nanoid } from "nanoid";

export const COMMISSION_RATE = 0.3;
export const MONTHLY_PRICE = 10;
export const ANNUAL_PRICE = 50;
export const LIFETIME_PRICE = 150;

export type PlanType = "monthly" | "annual" | "lifetime";

export function calculateCommission(plan: PlanType = "annual"): number {
  const prices: Record<PlanType, number> = {
    monthly: MONTHLY_PRICE,
    annual: ANNUAL_PRICE,
    lifetime: LIFETIME_PRICE,
  };
  return prices[plan] * COMMISSION_RATE;
}

export function generateReferralCode(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const id = nanoid(8);
  return id
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return alphabet[code % alphabet.length];
    })
    .join("");
}
