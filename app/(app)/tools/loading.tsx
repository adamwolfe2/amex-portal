export default function ToolsLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded bg-[#e0ddd9]" />
        <div className="h-4 w-64 rounded bg-[#f0efed]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#e0ddd9]" />
              <div className="h-5 w-32 rounded bg-[#e0ddd9]" />
            </div>
            <div className="h-3 w-full rounded bg-[#f0efed]" />
            <div className="h-8 w-24 rounded bg-[#e0ddd9]" />
          </div>
        ))}
      </div>
    </div>
  );
}
