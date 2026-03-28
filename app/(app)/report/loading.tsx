export default function ReportLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#e0ddd9]" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-[#e0ddd9]" />
          <div className="h-4 w-36 rounded bg-[#f0efed]" />
        </div>
      </div>
      <div className="rounded-lg border border-[#e0ddd9] bg-white p-6 space-y-4">
        <div className="h-4 w-32 rounded bg-[#f0efed]" />
        <div className="h-10 w-48 rounded bg-[#e0ddd9]" />
        <div className="h-3 w-full rounded-full bg-[#f0efed]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-5 space-y-2">
            <div className="h-4 w-20 rounded bg-[#f0efed]" />
            <div className="h-8 w-24 rounded bg-[#e0ddd9]" />
          </div>
        ))}
      </div>
    </div>
  );
}
