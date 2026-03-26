import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, getUserClaims, getChecklistProgress } from "@/lib/db/queries";
import { Sidebar } from "@/components/sidebar";
import { UserProvider } from "@/lib/user-context";
import type { CardKey } from "@/lib/data/types";
import { BENEFITS } from "@/lib/data/benefits";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { generateNotifications } from "@/lib/data/notifications";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let plan: "free" | "pro" = "free";
  let cards: CardKey[] = ["platinum", "gold"];
  let serializedNotifications: Array<{
    id: string;
    title: string;
    body: string;
    type: "reset" | "streak" | "action" | "setup";
    priority: "high" | "medium" | "low";
    createdAt: string;
  }> = [];

  const { userId } = await auth();
  if (userId) {
    const user = await getUserByClerkId(userId);
    if (user) {
      const status = user.subscriptionStatus;
      plan = status === "pro" || status === "past_due" ? "pro" : "free";
      const dbCards = user.cards as string[] | null;
      if (dbCards && dbCards.length > 0) {
        cards = dbCards.filter(
          (c): c is CardKey => c === "platinum" || c === "gold"
        );
      }

      // Compute notifications from existing data
      const [claims, checklistProgress] = await Promise.all([
        getUserClaims(user.id),
        getChecklistProgress(user.id),
      ]);

      const userBenefits = BENEFITS.filter((b) => cards.includes(b.card));
      const userChecklist = CHECKLIST_ITEMS.filter((t) => cards.includes(t.card));

      const notifications = generateNotifications({
        benefits: userBenefits,
        claims: claims.map((c) => ({
          benefitId: c.benefitId,
          claimedAt: c.claimedAt,
        })),
        checklistProgress: checklistProgress.map((p) => ({
          itemId: p.itemId,
          completed: p.completed,
        })),
        checklistItems: userChecklist,
      });

      serializedNotifications = notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      }));
    }
  }

  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      <Sidebar plan={plan} notifications={serializedNotifications} />
      <main className="flex-1 min-w-0 px-4 pb-6 pt-16 md:pt-8 md:px-8 md:pb-8 md:ml-64">
        <UserProvider cards={cards} plan={plan}>
          {children}
        </UserProvider>
      </main>
    </div>
  );
}
