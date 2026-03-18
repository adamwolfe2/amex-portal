"use client";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
}

export function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <div
        className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[#777777] mb-1.5"
      >
        {label}
      </div>
      <div
        className="text-xl sm:text-[1.8rem] font-bold leading-none tracking-[-0.03em] text-[#111111]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      {subtitle && (
        <div className="text-[0.73rem] text-[#444444] mt-1">{subtitle}</div>
      )}
    </div>
  );
}
