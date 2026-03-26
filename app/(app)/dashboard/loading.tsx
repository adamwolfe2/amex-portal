export default function DashboardLoading() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-32 bg-[#f0efed] rounded animate-pulse" />
        <div className="h-4 w-64 bg-[#f0efed] rounded animate-pulse mt-2" />
      </div>
      {/* Streak + Monthly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
      {/* Mark as Used */}
      <div className="h-48 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse mb-4" />
      {/* ROI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
      {/* Activity grid */}
      <div className="h-32 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse mb-4" />
      {/* Setup progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
