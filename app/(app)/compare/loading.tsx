export default function CompareLoading() {
  return (
    <div className="max-w-5xl animate-pulse space-y-6">
      <div className="h-8 w-44 rounded bg-[#e0ddd9]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-5 space-y-3">
            <div className="h-6 w-32 rounded bg-[#e0ddd9]" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 w-28 rounded bg-[#f0efed]" />
                <div className="h-4 w-16 rounded bg-[#f0efed]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
