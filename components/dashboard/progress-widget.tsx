"use client";

interface ProgressWidgetProps {
  title: string;
  completed: number;
  total: number;
  color: string;
}

export function ProgressWidget({ title, completed, total, color }: ProgressWidgetProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#111111]">{title}</span>
        <span className="text-xs font-medium text-[#777777]">
          {completed} / {total}
        </span>
      </div>
      <div className="h-1.5 bg-[#f0eeeb] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-600"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
