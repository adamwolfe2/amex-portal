export default function DashboardLoading() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <div className="h-6 w-32 bg-[#f0efed] rounded animate-pulse" />
        <div className="h-4 w-64 bg-[#f0efed] rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
      <div className="h-32 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
