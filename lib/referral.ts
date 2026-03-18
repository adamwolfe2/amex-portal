import { nanoid } from "nanoid";

export const COMMISSION_RATE = 0.3;
export const LIFETIME_PRICE = 29;

export function calculateCommission(): number {
  return LIFETIME_PRICE * COMMISSION_RATE;
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
