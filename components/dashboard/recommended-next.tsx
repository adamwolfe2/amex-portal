import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecommendedNextProps {
  benefits: Array<{
    id: string;
    name: string;
    card: "platinum" | "gold";
    value: number;
    cadence: string;
  }>;
}

export function RecommendedNext({ benefits }: RecommendedNextProps) {
  if (benefits.length === 0) return null;

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          Recommended Next
        </span>
        <span className="text-[11px] text-[#999999]">
          Highest value unclaimed
        </span>
      </div>
      <div className="px-4 pb-4">
        {benefits.map((b) => (
          <Link
            key={b.id}
            href={`/benefits/${b.id}`}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-[#f0eeeb] last:border-b-0 group min-h-[44px]"
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-[#111111] group-hover:underline truncate"
                title={b.name}
              >
                {b.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#999999]">
                  {b.card === "platinum" ? "Platinum" : "Gold"}
                </span>
                <span className="text-[11px] text-[#999999]">
                  ${b.value}/yr
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#999999] group-hover:text-[#111111] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
