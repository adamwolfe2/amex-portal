"use client";

import { useState, useMemo } from "react";
import { TRAVEL_TOOLS } from "@/lib/data";

type FilterKey =
  | "all"
  | "Hotels"
  | "Booking"
  | "Points"
  | "Dining"
  | "Airport"
  | "Transportation"
  | "Shopping";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Hotels", label: "Hotels" },
  { key: "Booking", label: "Booking" },
  { key: "Points", label: "Points" },
  { key: "Dining", label: "Dining" },
  { key: "Airport", label: "Airport" },
  { key: "Transportation", label: "Transportation" },
  { key: "Shopping", label: "Shopping" },
];


export default function ToolsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return TRAVEL_TOOLS;
    return TRAVEL_TOOLS.filter((t) => t.category === filter);
  }, [filter]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#111111]">
          Travel & Points Tools
        </h1>
        <p className="text-sm text-[#777] mt-1">
          Portals, search tools, and resources for Platinum & Gold travelers
        </p>
      </div>

      {/* Filter row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[44px] flex items-center ${
              filter === f.key
                ? "bg-[#1a1a2e] text-white"
                : "bg-white border border-[#e0ddd9] text-[#555] hover:bg-[#f5f5f3]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[#999] mb-3">
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Tool cards — 2 cols desktop, 1 col mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-[#e0ddd9] bg-white px-4 py-3 hover:border-[#ccc] transition-colors block"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-sm text-[#111111] group-hover:text-[#1a1a2e] transition-colors">
                  {t.name}
                </span>
                <span className="text-[11px] text-[#999999] shrink-0 mt-0.5">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-[#666] leading-relaxed">
                {t.description}
              </p>
            </a>
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm text-[#999]">
          No tools match your filter.
        </div>
      )}
    </div>
  );
}
