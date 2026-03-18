import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries";
import { Sidebar } from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let plan: "free" | "pro" = "free";

  const { userId } = await auth();
  if (userId) {
    const user = await getUserByClerkId(userId);
    if (user) {
      const status = user.subscriptionStatus;
      plan = status === "pro" || status === "past_due" ? "pro" : "free";
    }
  }

  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      <Sidebar plan={plan} />
      <main className="flex-1 min-w-0 px-4 pb-6 pt-16 md:pt-8 md:px-8 md:pb-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}
