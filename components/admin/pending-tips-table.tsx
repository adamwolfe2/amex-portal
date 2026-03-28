"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

type PendingTip = {
  id: number;
  title: string;
  body: string;
  card: string;
  category: string | null;
  status: string | null;
  createdAt: Date | null;
  userName: string | null;
  userEmail: string | null;
  userId: number;
};

export function PendingTipsTable({ initialTips }: { initialTips: PendingTip[] }) {
  const [tips, setTips] = useState(initialTips);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function updateStatus(id: number, status: "approved" | "rejected") {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/tips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update tip");
      setTips((prev) => prev.filter((t) => t.id !== id));
      toast.success(status === "approved" ? "Tip approved" : "Tip rejected");
    } catch {
      toast.error("Failed to update tip status");
    } finally {
      setLoadingId(null);
    }
  }

  if (tips.length === 0) {
    return (
      <div className="rounded-lg border border-[#e0ddd9] bg-white">
        <p className="px-4 py-6 text-center text-sm text-[#999999]">No pending tips</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#e0ddd9] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e0ddd9] text-left text-[#666666]">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Submitted By</th>
            <th className="px-4 py-3 font-medium">Card</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tips.map((tip) => (
            <tr key={tip.id} className="border-b border-[#e0ddd9] last:border-0">
              <td className="px-4 py-3">
                <div className="text-[#1a1a2e] font-medium">{tip.title}</div>
                <div className="text-xs text-[#999] mt-0.5 line-clamp-2">{tip.body}</div>
              </td>
              <td className="px-4 py-3 text-[#666666]">{tip.userName ?? tip.userEmail ?? "--"}</td>
              <td className="px-4 py-3 text-[#666666] capitalize">{tip.card}</td>
              <td className="px-4 py-3 text-[#666666] capitalize">{tip.category ?? "--"}</td>
              <td className="px-4 py-3 text-[#666666]">
                {tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : "--"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(tip.id, "approved")}
                    disabled={loadingId === tip.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#1a1a2e] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1a1a2e]/90 disabled:opacity-50 transition-colors"
                    aria-label="Approve tip"
                  >
                    <Check className="size-3" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(tip.id, "rejected")}
                    disabled={loadingId === tip.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e0ddd9] px-2.5 py-1.5 text-xs font-medium text-[#666] hover:bg-[#f5f5f3] disabled:opacity-50 transition-colors"
                    aria-label="Reject tip"
                  >
                    <X className="size-3" />
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
