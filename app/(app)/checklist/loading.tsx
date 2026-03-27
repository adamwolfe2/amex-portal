export default function ChecklistLoading() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with toggle skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-[#f0efed] rounded animate-pulse" />
            <div className="h-6 w-36 bg-[#f0efed] rounded animate-pulse" />
          </div>
          {/* Toggle button skeleton */}
          <div className="h-8 w-32 bg-[#f0efed] rounded-md animate-pulse" />
        </div>
        <div className="h-4 w-72 bg-[#f0efed] rounded animate-pulse" />
      </div>

      {/* Card group skeletons */}
      <div className="space-y-6">
        {[1, 2].map((group) => (
          <div
            key={group}
            className="border border-[#e0ddd9] rounded-lg bg-white overflow-hidden"
          >
            {/* Group header */}
            <div className="px-4 py-3 border-b border-[#e0ddd9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#f0efed] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[#f0efed] rounded animate-pulse" />
              </div>
              <div className="h-3 w-20 bg-[#f0efed] rounded animate-pulse" />
            </div>
            {/* Checklist item rows */}
            <div className="divide-y divide-[#e0ddd9]">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="px-4 py-3 flex items-start gap-3">
                  <div className="h-4 w-4 bg-[#f0efed] rounded animate-pulse mt-0.5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-4 w-48 bg-[#f0efed] rounded animate-pulse" />
                      <div className="h-3 w-14 bg-[#f0efed] rounded animate-pulse shrink-0" />
                    </div>
                    <div className="h-3 w-full bg-[#f0efed] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
