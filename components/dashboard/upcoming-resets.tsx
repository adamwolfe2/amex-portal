"use client";

import { useEffect, useState } from "react";
import type { Benefit, CardKey } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

interface ResetItem {
  date: Date;
  name: string;
  card: CardKey;
  type: string;
}

const CARD_LABELS: Record<CardKey, string> = {
  platinum: "Platinum",
  gold: "Gold",
};

function computeUpcomingResets(benefits: Benefit[]): ResetItem[] {
  const now = new Date();
  const resets: ResetItem[] = [];

  benefits.forEach((b) => {
    if (b.cadence === "monthly") {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      resets.push({
        date: nextMonth,
        name: b.name,
        card: b.card,
        type: "Monthly reset",
      });
    } else if (b.cadence === "quarterly" && b.resetMonths) {
      b.resetMonths.forEach((m) => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) {
          resets.push({
            date: d,
            name: b.name,
            card: b.card,
            type: "Quarterly reset",
          });
        }
      });
    } else if (b.cadence === "semiannual" && b.resetMonths) {
      b.resetMonths.forEach((m) => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) {
          resets.push({
            date: d,
            name: b.name,
            card: b.card,
            type: "Semiannual reset",
          });
        }
      });
    } else if (b.cadence === "annual" && b.resetMonths) {
      b.resetMonths.forEach((m) => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) {
          resets.push({
            date: d,
            name: b.name,
            card: b.card,
            type: "Annual reset",
          });
        }
      });
    }
  });

  resets.sort((a, b) => a.date.getTime() - b.date.getTime());
  return resets.slice(0, 5);
}

interface UpcomingResetsProps {
  benefits: Benefit[];
}

export function UpcomingResets({ benefits }: UpcomingResetsProps) {
  const [resets, setResets] = useState<ResetItem[]>([]);

  useEffect(() => {
    setResets(computeUpcomingResets(benefits));
  }, [benefits]);

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          Upcoming Resets
        </span>
      </div>
      <div className="px-4 pb-4">
        {resets.length === 0 ? (
          <p className="text-[0.8rem] text-[#777777] py-2">
            No upcoming resets in the remainder of this year
          </p>
        ) : (
          <ul className="list-none p-0 m-0">
            {resets.map((r, i) => (
              <li
                key={`${r.name}-${r.date.getTime()}-${i}`}
                className="flex items-center gap-2.5 py-2 border-b border-[#f0eeeb] last:border-b-0 text-[0.8rem]"
              >
                <span
                  className="font-semibold text-[#111111] whitespace-nowrap min-w-[50px]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {r.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex-1 text-[#444444]">{r.name}</span>
                <Badge
                  className={
                    r.card === "platinum"
                      ? "bg-[#1a1a2e] text-white border-transparent text-[0.65rem]"
                      : "bg-[#8B6914] text-white border-transparent text-[0.65rem]"
                  }
                >
                  {CARD_LABELS[r.card]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
