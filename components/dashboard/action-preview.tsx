"use client";

import type { ActionItem } from "@/lib/data/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PRIORITY_COLORS: Record<string, string> = {
  high: "#e53e3e",
  medium: "#d69e2e",
  low: "#38a169",
};

interface ActionPreviewProps {
  actions: ActionItem[];
}

export function ActionPreview({ actions }: ActionPreviewProps) {
  const top3 = actions.slice(0, 3);

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          What to Do Now
        </span>
        <Link
          href="/actions"
          className="text-xs font-medium text-[#444444] hover:text-[#111111] flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="px-4 pb-4">
        {top3.length === 0 ? (
          <p className="text-[0.8rem] text-[#777777] py-2">
            No urgent actions right now.
          </p>
        ) : (
          <div className="space-y-0">
            {top3.map((a, i) => (
              <div
                key={`action-${i}`}
                className="flex items-start gap-2.5 py-2.5 border-b border-[#f0eeeb] last:border-b-0"
              >
                <span
                  className="mt-1.5 size-2 rounded-full shrink-0"
                  style={{ backgroundColor: PRIORITY_COLORS[a.priority] }}
                />
                <div className="min-w-0">
                  <div className="text-[0.8rem] font-semibold text-[#111111]">
                    {a.title}
                  </div>
                  <div className="text-[0.73rem] text-[#444444] mt-0.5">
                    {a.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
