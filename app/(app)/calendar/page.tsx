"use client";

import { useMemo, useState, useEffect, useCallback, useTransition } from "react";
import { BENEFITS, CARDS } from "@/lib/data";
import { Download, Calendar as CalendarIcon, Check } from "lucide-react";
import { quickClaimBenefit } from "@/lib/actions/claims";
import { toast } from "sonner";

type ResetEvent = {
  benefitId: string;
  name: string;
  card: "platinum" | "gold";
  value: number | null;
  cadence: string;
  resetDate: Date;
  daysUntil: number;
};

function getNextResetDates(now: Date): ResetEvent[] {
  const events: ResetEvent[] = [];

  for (const b of BENEFITS) {
    // Skip ongoing/multi-year benefits — they don't have periodic resets
    if (b.cadence === "ongoing" || b.cadence === "multi-year") continue;

    if (b.cadence === "monthly" && b.resetDay !== null) {
      // Next 3 monthly resets
      for (let i = 0; i < 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, b.resetDay);
        if (d <= now) {
          const next = new Date(
            now.getFullYear(),
            now.getMonth() + i + 1,
            b.resetDay
          );
          events.push({
            benefitId: b.id,
            name: b.name,
            card: b.card,
            value: b.value,
            cadence: b.cadence,
            resetDate: next,
            daysUntil: Math.ceil(
              (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        } else {
          events.push({
            benefitId: b.id,
            name: b.name,
            card: b.card,
            value: b.value,
            cadence: b.cadence,
            resetDate: d,
            daysUntil: Math.ceil(
              (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      }
    } else if (b.resetMonths && b.resetMonths.length > 0) {
      // Quarterly / semiannual / annual with known reset months
      for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
        for (const month of b.resetMonths) {
          const d = new Date(now.getFullYear() + yearOffset, month - 1, 1);
          if (d > now) {
            events.push({
              benefitId: b.id,
              name: b.name,
              card: b.card,
              value: b.value,
              cadence: b.cadence,
              resetDate: d,
              daysUntil: Math.ceil(
                (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              ),
            });
          }
        }
      }
    } else if (b.cadence === "annual") {
      // Annual with no specific month — reset Jan 1
      let d = new Date(now.getFullYear() + 1, 0, 1);
      if (d <= now) d = new Date(now.getFullYear() + 2, 0, 1);
      events.push({
        benefitId: b.id,
        name: b.name,
        card: b.card,
        value: b.value,
        cadence: b.cadence,
        resetDate: d,
        daysUntil: Math.ceil(
          (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
      });
    }
  }

  // Deduplicate by benefitId+date, keeping earliest
  const seen = new Set<string>();
  const unique: ResetEvent[] = [];
  for (const e of events) {
    const key = `${e.benefitId}-${e.resetDate.toISOString().slice(0, 10)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(e);
    }
  }

  // Sort by date, then within the next 6 months
  return unique
    .filter((e) => e.daysUntil <= 180 && e.daysUntil > 0)
    .sort((a, b) => a.resetDate.getTime() - b.resetDate.getTime());
}

function groupByMonth(events: ResetEvent[]) {
  const groups: Record<string, ResetEvent[]> = {};
  for (const e of events) {
    const key = e.resetDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return groups;
}

function generateICS(events: ResetEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CreditOS//Benefits Calendar//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const e of events) {
    const d = e.resetDate;
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    lines.push("BEGIN:VEVENT");
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`DTEND;VALUE=DATE:${dateStr}`);
    lines.push(
      `SUMMARY:${e.name} Reset${e.value ? ` ($${e.value})` : ""} - ${e.card === "platinum" ? "Platinum" : "Gold"}`
    );
    lines.push(
      `DESCRIPTION:${e.cadence.charAt(0).toUpperCase() + e.cadence.slice(1)} benefit reset for your ${e.card === "platinum" ? "Platinum" : "Gold"} card.`
    );
    lines.push(`UID:${e.benefitId}-${dateStr}@creditos`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(events: ResetEvent[]) {
  const content = generateICS(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "creditos-benefit-resets.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type Claim = {
  id: number;
  benefitId: string;
  period: string | null;
  claimedAt: string;
};

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const now = useMemo(() => new Date(), []);
  const events = useMemo(() => getNextResetDates(now), [now]);
  const grouped = useMemo(() => groupByMonth(events), [events]);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [claimsLoaded, setClaimsLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/claims");
      if (res.ok) {
        const data: Claim[] = await res.json();
        const period = currentPeriod();
        const ids = new Set(
          data
            .filter((c) => c.period === period)
            .map((c) => c.benefitId)
        );
        setClaimedIds(ids);
      }
    } finally {
      setClaimsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleQuickClaim = (benefitId: string) => {
    startTransition(async () => {
      const result = await quickClaimBenefit(benefitId);
      if (result.success) {
        setClaimedIds((prev) => new Set([...prev, benefitId]));
        toast.success("Benefit claimed!");
      } else {
        toast.error(result.error ?? "Failed to claim");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">
            Calendar & Resets
          </h1>
          <p className="text-sm text-[#777] mt-1">
            Track monthly, quarterly, semiannual, and annual benefit resets
          </p>
        </div>
        <button
          onClick={() => downloadICS(events)}
          className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-[#1a1a2e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a3e] transition-colors"
        >
          <Download className="size-3.5" />
          Download ICS
        </button>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center py-12 text-sm text-[#999]">
          No upcoming resets found.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="size-4 text-[#999]" />
                <h2 className="text-sm font-semibold text-[#111111]">
                  {month}
                </h2>
              </div>

              <div className="space-y-2">
                {items.map((e, i) => {
                  const dotColor =
                    e.card === "platinum"
                      ? CARDS.platinum.color
                      : CARDS.gold.color;
                  return (
                    <div
                      key={`${e.benefitId}-${i}`}
                      className="flex items-center gap-3 rounded-lg border border-[#e0ddd9] bg-white px-4 py-3"
                    >
                      <div
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">
                            {e.name}
                          </span>
                          {e.value !== null && (
                            <span className="text-xs font-semibold text-[#1a1a2e]">
                              ${e.value}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#999] mt-0.5">
                          {e.resetDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {claimsLoaded && claimedIds.has(e.benefitId) ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#999999]">
                            <Check className="size-3.5" />
                            <span className="hidden sm:inline">Claimed</span>
                          </span>
                        ) : claimsLoaded && e.daysUntil <= 30 ? (
                          <button
                            onClick={() => handleQuickClaim(e.benefitId)}
                            disabled={isPending}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-[#1a1a2e] px-3 text-xs font-medium text-white hover:bg-[#2a2a3e] transition-colors disabled:opacity-50"
                          >
                            {isPending ? "..." : "Claim"}
                          </button>
                        ) : null}
                        <span
                          className={`text-xs font-medium ${
                            e.daysUntil <= 7
                              ? "text-red-500"
                              : e.daysUntil <= 30
                                ? "text-amber-500"
                                : "text-[#999]"
                          }`}
                        >
                          {e.daysUntil === 1
                            ? "Tomorrow"
                            : `${e.daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#999] mt-6 text-center">
        Calendar shows benefit resets within the next 6 months. Download the ICS
        file to add reminders to your calendar app.
      </p>
    </div>
  );
}
