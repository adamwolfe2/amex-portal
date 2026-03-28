export default function ActionsLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-8 w-36 rounded bg-[#e0ddd9]" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-[#e0ddd9] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-[#e0ddd9]" />
            <div className="h-3 w-full rounded bg-[#f0efed]" />
          </div>
        </div>
      ))}
    </div>
  );
}
