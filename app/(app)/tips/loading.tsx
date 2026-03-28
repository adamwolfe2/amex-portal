export default function TipsLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-[#e0ddd9]" />
          <div className="h-4 w-64 rounded bg-[#f0efed]" />
        </div>
        <div className="h-11 w-32 rounded-lg bg-[#e0ddd9]" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-[#e0ddd9]" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white px-4 py-3 space-y-2">
            <div className="h-4 w-48 rounded bg-[#e0ddd9]" />
            <div className="h-3 w-full rounded bg-[#f0efed]" />
            <div className="h-3 w-3/4 rounded bg-[#f0efed]" />
          </div>
        ))}
      </div>
    </div>
  );
}
