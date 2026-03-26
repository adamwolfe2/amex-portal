"use client";

interface ValueCapturedProps {
  captured: number;
  available: number;
}

export function ValueCaptured({ captured, available }: ValueCapturedProps) {
  const percent = available > 0 ? Math.min(100, Math.round((captured / available) * 100)) : 0;

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <span className="text-sm font-semibold text-[#111111]">
        Value Captured
      </span>
      <div className="flex items-baseline gap-1 mt-2 mb-2">
        <span
          className="text-2xl font-semibold text-[#111111]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          ${captured.toLocaleString()}
        </span>
        <span className="text-sm text-[#999999]">
          of ${available.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#f0eeeb] rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: "#1a1a2e" }}
        />
      </div>
      <p className="text-[11px] text-[#999999]">
        {percent}% of available value this year
      </p>
    </div>
  );
}
