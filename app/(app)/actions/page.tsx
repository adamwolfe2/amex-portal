import type { Metadata } from "next";
import { getActionItems } from "@/lib/data/actions";

export const metadata: Metadata = { title: "Actions" };
import {
  AlertCircle,
  Info,
} from "lucide-react";

const cardLabels = {
  platinum: "Platinum",
  gold: "Gold",
  both: "Both Cards",
} as const;

export default function ActionsPage() {
  const actions = getActionItems();

  const high = actions.filter((a) => a.priority === "high");
  const medium = actions.filter((a) => a.priority === "medium");
  const low = actions.filter((a) => a.priority === "low");

  const groups = [
    { label: "High Priority", items: high, priority: "high" as const },
    { label: "Medium Priority", items: medium, priority: "medium" as const },
    { label: "Low Priority", items: low, priority: "low" as const },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">Actions</h1>
        </div>
        <p className="text-sm text-[#666666]">
          Time-sensitive reminders based on your benefit reset schedule
        </p>
      </div>

      {groups.length === 0 && (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-8 text-center">
          <Info className="h-8 w-8 text-[#999999] mx-auto mb-3" />
          <p className="text-sm text-[#666666]">
            No time-sensitive actions right now. Check back at the start of the
            month or quarter.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
            <div key={group.priority}>
              <h2 className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                    <div
                      key={`${group.priority}-${i}`}
                      className="border border-[#e0ddd9] rounded-lg bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-0.5">
                        <p className="text-sm font-medium text-[#111111]">
                          {item.title}
                        </p>
                        <span className="text-[11px] text-[#999999] shrink-0 mt-0.5">
                          {cardLabels[item.card]}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
