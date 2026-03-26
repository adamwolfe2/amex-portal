"use client";

import type { Benefit, CardKey } from "@/lib/data/types";
import { ExternalLink } from "lucide-react";

const CARD_LABELS: Record<CardKey, string> = {
  platinum: "Platinum",
  gold: "Gold",
};

interface NotEnrolledProps {
  benefits: Benefit[];
}

export function NotEnrolled({ benefits }: NotEnrolledProps) {
  const enrollmentRequired = benefits.filter((b) => b.enrollmentRequired);

  if (enrollmentRequired.length === 0) {
    return null;
  }

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          Not Yet Enrolled
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="space-y-0">
          {enrollmentRequired.slice(0, 5).map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-2 py-2 border-b border-[#f0eeeb] last:border-b-0 text-[0.8rem]"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[#111111] font-medium truncate" title={b.name}>
                  {b.name}
                </span>
                <span className="text-[11px] text-[#999999] shrink-0">
                  {CARD_LABELS[b.card]}
                </span>
              </div>
              {b.portalLink && (
                <a
                  href={b.portalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enroll in ${b.name}`}
                  className="flex items-center justify-center min-h-[44px] min-w-[44px] text-[#777777] hover:text-[#111111] transition-colors shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
