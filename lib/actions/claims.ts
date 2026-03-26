"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getUserByClerkId,
  createBenefitClaim,
  getClaimForPeriod,
} from "@/lib/db/queries";
import { BENEFITS } from "@/lib/data";

const VALID_IDS = new Set(BENEFITS.map((b) => b.id));

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function quickClaimBenefit(
  benefitId: string
): Promise<{ success: boolean; error?: string }> {
  if (!VALID_IDS.has(benefitId)) {
    return { success: false, error: "Invalid benefit" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const period = currentPeriod();

  // Idempotent — if already claimed this period, return success
  const existing = await getClaimForPeriod(user.id, benefitId, period);
  if (existing) {
    return { success: true };
  }

  const benefit = BENEFITS.find((b) => b.id === benefitId);
  const perPeriodValue =
    benefit?.value && benefit.cadence === "monthly"
      ? (benefit.value / 12).toFixed(2)
      : benefit?.value
        ? String(benefit.value)
        : undefined;

  await createBenefitClaim({
    userId: user.id,
    benefitId,
    amount: perPeriodValue,
    period,
  });

  revalidatePath("/dashboard");
  return { success: true };
}
