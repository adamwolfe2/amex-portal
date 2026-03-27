export default function BenefitsLoading() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-40 bg-[#f0efed] rounded animate-pulse" />
        <div className="h-4 w-72 bg-[#f0efed] rounded animate-pulse mt-2" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 w-full bg-[#f0efed] rounded-lg animate-pulse mb-4" />

      {/* Filter buttons skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-10 rounded-full bg-[#f0efed] animate-pulse"
            style={{ width: `${56 + i * 8}px` }}
          />
        ))}
      </div>

      {/* Results count skeleton */}
      <div className="h-3 w-20 bg-[#f0efed] rounded animate-pulse mb-3" />

      {/* Benefit card skeletons */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-[#e0ddd9] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-48 bg-[#f0efed] rounded animate-pulse" />
                  <div className="h-4 w-10 bg-[#f0efed] rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-16 bg-[#f0efed] rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-[#f0efed] rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-full bg-[#f0efed] rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-[#f0efed] rounded animate-pulse" />
              </div>
              <div className="h-4 w-4 bg-[#f0efed] rounded animate-pulse shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
