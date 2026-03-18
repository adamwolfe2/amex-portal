"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Info,
  CreditCard,
} from "lucide-react";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";

const priorityConfig = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low: { dot: "bg-blue-400", label: "Low" },
} as const;

export default function ChecklistPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/checklist")
      .then((r) => r.json())
      .then((data) => {
        setCompletedIds(new Set(data.completedIds ?? []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (itemId: string) => {
    const newCompleted = !completedIds.has(itemId);
    const next = new Set(completedIds);
    if (newCompleted) {
      next.add(itemId);
    } else {
      next.delete(itemId);
    }
    setCompletedIds(next);

    await fetch("/api/user/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, completed: newCompleted }),
    });
  };

  const platItems = CHECKLIST_ITEMS.filter((t) => t.card === "platinum");
  const goldItems = CHECKLIST_ITEMS.filter((t) => t.card === "gold");
  const platDone = platItems.filter((t) => completedIds.has(t.id)).length;
  const goldDone = goldItems.filter((t) => completedIds.has(t.id)).length;

  const renderGroup = (
    label: string,
    items: typeof CHECKLIST_ITEMS,
    done: number,
    accentColor: string
  ) => (
    <div className="border border-[#e0ddd9] rounded-lg bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e0ddd9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" style={{ color: accentColor }} />
          <h2 className="text-sm font-medium text-[#111111]">{label}</h2>
        </div>
        <span className="text-xs text-[#666666]">
          {done}/{items.length} complete
        </span>
      </div>
      <div className="divide-y divide-[#e0ddd9]">
        {items.map((item) => {
          const checked = completedIds.has(item.id);
          const pConfig = priorityConfig[item.priority];
          return (
            <div
              key={item.id}
              className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                checked ? "bg-[#fafaf9]" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(item.id)}
                className="mt-0.5 h-4 w-4 rounded border-[#e0ddd9] cursor-pointer"
                style={{ accentColor }}
                aria-label={`Mark "${item.title}" as ${checked ? "incomplete" : "complete"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-sm font-medium ${
                      checked
                        ? "text-[#999999] line-through"
                        : "text-[#111111]"
                    }`}
                  >
                    {item.title}
                  </p>
                  <span
                    className={`inline-flex items-center h-4 w-4 rounded-full shrink-0 ${pConfig.dot}`}
                    title={`${pConfig.label} priority`}
                  />
                </div>
                <p className="text-xs text-[#666666] mt-0.5">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#1a1a2e] hover:underline mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open enrollment
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CheckSquare className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">
            Setup Checklist
          </h1>
        </div>
        <p className="text-sm text-[#666666]">
          Complete these one-time tasks to activate all your card benefits
        </p>
      </div>

      <div className="space-y-6">
        {renderGroup("Platinum Card", platItems, platDone, "#1a1a2e")}
        {renderGroup("Gold Card", goldItems, goldDone, "#8B6914")}
      </div>
    </div>
  );
}
