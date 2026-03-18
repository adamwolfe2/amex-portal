import { nanoid } from "nanoid";

export const COMMISSION_RATE = 0.3;
export const LIFETIME_PRICE = 29;
export const MONTHLY_PRICE = 9;

export function calculateCommission(
  plan: "monthly" | "lifetime" = "lifetime"
): number {
  const price = plan === "monthly" ? MONTHLY_PRICE : LIFETIME_PRICE;
  return price * COMMISSION_RATE;
}

export function generateReferralCode(): string {
  // 8-char uppercase alphanumeric code
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const id = nanoid(8);
  // Map each character to the allowed alphabet
  return id
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return alphabet[code % alphabet.length];
    })
    .join("");
}
