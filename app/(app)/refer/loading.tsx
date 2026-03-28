export default function ReferLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-[#e0ddd9]" />
        <div className="h-4 w-80 rounded bg-[#f0efed]" />
      </div>
      <div className="rounded-lg border border-[#e0ddd9] bg-white p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-[#e0ddd9]" />
        <div className="h-11 w-full rounded-lg bg-[#f0efed]" />
        <div className="h-11 w-40 rounded-lg bg-[#e0ddd9]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-4 space-y-2">
            <div className="h-8 w-8 rounded-full bg-[#e0ddd9]" />
            <div className="h-6 w-12 rounded bg-[#e0ddd9]" />
            <div className="h-3 w-20 rounded bg-[#f0efed]" />
          </div>
        ))}
      </div>
    </div>
  );
}
