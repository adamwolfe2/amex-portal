export default function SourcesLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-36 rounded bg-[#e0ddd9]" />
        <div className="h-4 w-64 rounded bg-[#f0efed]" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-4 flex gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#e0ddd9] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-[#e0ddd9]" />
              <div className="h-3 w-full rounded bg-[#f0efed]" />
              <div className="h-3 w-2/3 rounded bg-[#f0efed]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
