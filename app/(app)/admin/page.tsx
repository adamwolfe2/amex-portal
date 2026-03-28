import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import {
  getAdminStats,
  getRecentUsers,
  getRecentApplications,
  getPendingTips,
} from "@/lib/db/queries";
import { Users, CreditCard, GitFork, FileText, MessageSquare } from "lucide-react";
import { PendingTipsTable } from "@/components/admin/pending-tips-table";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId || !isAdmin(userId)) {
    redirect("/dashboard");
  }

  const [stats, recentUsers, recentApplications, pendingTips] =
    await Promise.all([
      getAdminStats(),
      getRecentUsers(10),
      getRecentApplications(5),
      getPendingTips(10),
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-xl font-semibold text-[#1a1a2e]">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
        />
        <StatCard
          label="Paid Users"
          value={stats.paidUsers}
          icon={CreditCard}
        />
        <StatCard
          label="Referrals"
          value={stats.totalReferrals}
          detail={`${stats.paidReferrals} paid`}
          icon={GitFork}
        />
        <StatCard
          label="Applications"
          value={stats.totalApplications}
          detail={`${stats.pendingApplications} pending`}
          icon={FileText}
        />
      </div>

      {/* Feedback + Revenue summary */}
      <div className="rounded-lg border border-[#e0ddd9] bg-white p-4">
        <p className="text-sm text-[#666666]">
          Feedback responses: <span className="font-medium text-[#1a1a2e]">{stats.totalFeedback}</span>
        </p>
      </div>

      {/* Recent Users */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-[#1a1a2e]">
          Recent Users
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[#e0ddd9] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0ddd9] text-left text-[#666666]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#e0ddd9] last:border-0"
                >
                  <td className="px-4 py-3 text-[#1a1a2e]">
                    {user.name ?? "--"}
                  </td>
                  <td className="px-4 py-3 text-[#666666]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.subscriptionStatus === "pro" ||
                        user.subscriptionStatus === "active" ||
                        user.subscriptionStatus === "trialing"
                          ? "bg-[#1a1a2e] text-white"
                          : "bg-[#f0efed] text-[#666666]"
                      }`}
                    >
                      {user.subscriptionStatus ?? "free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#666666]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-[#999999]"
                  >
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending Community Tips */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-[#1a1a2e] flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#8B6914]" />
          Pending Tips
          {pendingTips.length > 0 && (
            <span className="rounded-full bg-[#8B6914]/10 px-2 py-0.5 text-xs font-medium text-[#8B6914]">
              {pendingTips.length}
            </span>
          )}
        </h2>
        <PendingTipsTable initialTips={pendingTips} />
      </section>

      {/* Recent Applications */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-[#1a1a2e]">
          Recent Applications
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[#e0ddd9] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0ddd9] text-left text-[#666666]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[#e0ddd9] last:border-0"
                >
                  <td className="px-4 py-3 text-[#1a1a2e]">{app.name}</td>
                  <td className="px-4 py-3 text-[#666666]">{app.email}</td>
                  <td className="px-4 py-3 text-[#666666]">{app.platform}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        app.status === "approved"
                          ? "bg-[#1a1a2e] text-white"
                          : app.status === "pending"
                            ? "bg-[#8B6914]/10 text-[#8B6914]"
                            : "bg-[#f0efed] text-[#666666]"
                      }`}
                    >
                      {app.status ?? "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#666666]">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[#999999]"
                  >
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-[#e0ddd9] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#666666]">{label}</p>
        <Icon className="h-4 w-4 text-[#999999]" />
      </div>
      <p className="mt-1 text-2xl font-semibold text-[#1a1a2e]">{value}</p>
      {detail && (
        <p className="mt-0.5 text-xs text-[#999999]">{detail}</p>
      )}
    </div>
  );
}
