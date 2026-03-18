export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserByClerkId,
  getReferralsByReferrer,
} from "@/lib/db/queries";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const referralRows = await getReferralsByReferrer(user.id);

  // Enrich referrals with referred user info
  const referrals = await Promise.all(
    referralRows.map(async (r) => {
      const referred = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, r.referredUserId))
        .limit(1);
      return {
        id: r.id,
        name: referred[0]?.name ?? "Unknown",
        email: referred[0]?.email ?? "",
        date: r.createdAt,
        status: r.status,
        commission: r.commissionAmount ? Number(r.commissionAmount) : 0,
      };
    })
  );

  const totalReferrals = referrals.length;
  const paidReferrals = referrals.filter((r) => r.status === "paid").length;
  const totalEarnings = referrals
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.commission, 0);

  return NextResponse.json({
    referralCode: user.referralCode,
    stats: { totalReferrals, paidReferrals, totalEarnings },
    referrals,
  });
}
