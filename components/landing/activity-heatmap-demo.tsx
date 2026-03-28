"use client";

const WEEKS = 26;
const DAYS = 7;
const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

// Deterministic sample data - heavier claiming in recent months
function generateData(): number[][] {
  const seed = [
    0,0,1,0,0,1,0, 0,1,0,0,0,0,1, 0,0,0,1,0,0,0, 1,0,0,0,0,1,0,
    0,0,1,0,1,0,0, 0,1,0,0,0,1,0, 1,0,0,1,0,0,1, 0,0,1,0,1,0,0,
    0,1,0,1,0,0,1, 1,0,0,1,0,1,0, 0,1,1,0,0,1,0, 1,0,1,0,1,0,1,
    0,1,0,1,1,0,1, 1,0,1,1,0,1,0, 0,2,1,0,1,1,0, 1,1,0,1,0,1,1,
    1,0,2,1,1,0,1, 0,1,1,2,1,1,0, 2,1,0,1,1,2,1, 1,2,1,1,0,1,2,
    1,1,2,1,2,1,0, 2,1,1,2,1,1,2, 1,2,1,2,1,2,1, 2,1,3,2,1,2,1,
    2,3,1,2,2,1,3, 2,2,3,2,1,4,2,
  ];
  const weeks: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: number[] = [];
    for (let d = 0; d < DAYS; d++) {
      week.push(seed[w * DAYS + d] ?? 0);
    }
    weeks.push(week);
  }
  return weeks;
}

const data = generateData();

const colors = [
  "#f0eeeb",
  "#c7c3bd",
  "#6b6a7a",
  "#3a3a5e",
  "#1a1a2e",
];

function getColor(count: number) {
  return colors[Math.min(count, 4)];
}

export function ActivityHeatmapDemo() {
  return (
    <div className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-[#111111] mb-4">
        Benefit Activity
      </p>

      {/* Month labels */}
      <div className="flex mb-1 pl-0">
        {MONTH_LABELS.map((month, i) => (
          <span
            key={i}
            className="text-[10px] text-[#999999]"
            style={{ width: `${100 / MONTH_LABELS.length}%` }}
          >
            {month}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-[3px]">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((count, di) => (
              <div
                key={di}
                className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-[2px] transition-transform hover:scale-125"
                style={{ backgroundColor: getColor(count) }}
                title={`${count} benefit${count !== 1 ? "s" : ""} claimed`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-[#999999]">Less</span>
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-[11px] h-[11px] rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[10px] text-[#999999]">More</span>
      </div>
    </div>
  );
}
