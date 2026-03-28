export default function BestCardLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-[#e0ddd9]" />
        <div className="h-4 w-72 rounded bg-[#f0efed]" />
      </div>
      <div className="rounded-lg border border-[#e0ddd9] bg-white p-4 space-y-3">
        <div className="h-4 w-32 rounded bg-[#f0efed]" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#f0efed]" />
          ))}
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-4 space-y-2">
          <div className="h-5 w-40 rounded bg-[#e0ddd9]" />
          <div className="h-4 w-full rounded bg-[#f0efed]" />
          <div className="h-4 w-3/4 rounded bg-[#f0efed]" />
        </div>
      ))}
    </div>
  );
}
