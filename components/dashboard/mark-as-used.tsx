"use client";

import { useOptimistic, useTransition } from "react";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { quickClaimBenefit } from "@/lib/actions/claims";

interface MarkAsUsedProps {
  benefits: Array<{
    id: string;
    name: string;
    card: "platinum" | "gold";
    monthlyValue: number;
  }>;
  claimedIds: string[];
}

export function MarkAsUsed({ benefits, claimedIds }: MarkAsUsedProps) {
  const [optimisticClaimed, addOptimistic] = useOptimistic(
    claimedIds,
    (state: string[], newId: string) => [...state, newId]
  );
  const [isPending, startTransition] = useTransition();

  const handleClaim = (benefitId: string) => {
    startTransition(async () => {
      addOptimistic(benefitId);
      const result = await quickClaimBenefit(benefitId);
      if (!result.success) {
        toast.error(result.error ?? "Failed to record. Please try again.");
        throw new Error(result.error ?? "Claim failed");
      }
    });
  };

  if (benefits.length === 0) return null;

  const unclaimed = benefits.filter((b) => !optimisticClaimed.includes(b.id));
  const claimed = benefits.filter((b) => optimisticClaimed.includes(b.id));

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          This Month&apos;s Credits
        </span>
        <span className="text-[11px] text-[#999999]">
          {claimed.length}/{benefits.length} used
        </span>
      </div>
      <div className="px-4 pb-4 space-y-0">
        {unclaimed.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-[#f0eeeb] last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111111] truncate" title={b.name}>
                {b.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#999999]">
                  {b.card === "platinum" ? "Platinum" : "Gold"}
                </span>
                {b.monthlyValue > 0 && (
                  <span className="text-[11px] text-[#999999]">
                    ${b.monthlyValue}/mo
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleClaim(b.id)}
              disabled={isPending}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md border border-[#e0ddd9] text-[#666666] hover:bg-[#f5f3f0] hover:text-[#111111] transition-colors disabled:opacity-40"
              aria-label={`Mark ${b.name} as used`}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
        {claimed.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-[#f0eeeb] last:border-b-0 opacity-60 animate-in fade-in duration-300"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#999999] line-through truncate" title={b.name}>
                {b.name}
              </p>
              <span className="text-[11px] text-[#999999]">
                {b.card === "platinum" ? "Platinum" : "Gold"}
              </span>
            </div>
            <div className="flex items-center justify-center min-h-[44px] min-w-[44px]">
              <CheckCheck className="h-4 w-4 text-[#999999] animate-in zoom-in duration-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
