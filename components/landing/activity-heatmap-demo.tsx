"use client";

const WEEKS = 26;
const DAYS = 7;
const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

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

const colors = ["#f0eeeb", "#c7c3bd", "#6b6a7a", "#3a3a5e", "#1a1a2e"];

function getColor(count: number) {
  return colors[Math.min(count, 4)];
}

const recentClaims = [
  { date: "Mar 28", name: "Uber Cash", card: "Platinum", value: 15 },
  { date: "Mar 25", name: "Digital Entertainment", card: "Platinum", value: 25 },
  { date: "Mar 22", name: "Dunkin' Credit", card: "Gold", value: 7 },
  { date: "Mar 18", name: "Walmart+", card: "Platinum", value: 12.95 },
];

export function ActivityHeatmapDemo() {
  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-bold text-[#111111]">Activity</p>
        <p className="text-xs text-[#666666]">47 claims this year</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-[#111111] tabular-nums">47</p>
          <p className="text-[10px] text-[#666666]">Total Claims</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-[#111111] tabular-nums">6</p>
          <p className="text-[10px] text-[#666666]">This Month</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-[#111111]">7mo</p>
          <p className="text-[10px] text-[#666666]">Streak</p>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex mb-1">
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

      {/* Heatmap grid */}
      <div className="flex gap-[2px]">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((count, di) => (
              <div
                key={di}
                className="w-[12px] h-[12px] rounded-[2px] transition-transform hover:scale-125"
                style={{ backgroundColor: getColor(count) }}
                title={`${count} benefit${count !== 1 ? "s" : ""} claimed`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2.5 justify-end">
        <span className="text-[10px] text-[#999999]">Less</span>
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-[12px] h-[12px] rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[10px] text-[#999999]">More</span>
      </div>

      {/* RECENT CLAIMS section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Recent Claims
      </p>
      <div>
        {recentClaims.map((claim, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-[#f0eeeb]"
          >
            <span className="text-xs text-[#999999] w-12 flex-shrink-0 tabular-nums">
              {claim.date}
            </span>
            <span className="flex-1 text-sm text-[#111111] font-medium">
              {claim.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                claim.card === "Platinum"
                  ? "bg-[#1a1a2e]/10 text-[#1a1a2e]"
                  : "bg-[#8B6914]/10 text-[#8B6914]"
              }`}
            >
              {claim.card}
            </span>
            <span className="text-sm font-semibold text-[#111111] tabular-nums min-w-[40px] text-right">
              ${claim.value}
            </span>
          </div>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}
