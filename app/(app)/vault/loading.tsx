export default function VaultLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-8 w-36 rounded bg-[#e0ddd9]" />
      <div className="rounded-lg border border-[#e0ddd9] bg-white overflow-hidden">
        <div className="border-b border-[#e0ddd9] px-4 py-3 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-20 rounded bg-[#e0ddd9]" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-[#f0efed] px-4 py-3 flex gap-4">
            <div className="h-4 w-32 rounded bg-[#f0efed]" />
            <div className="h-4 w-24 rounded bg-[#f0efed]" />
            <div className="h-4 w-20 rounded bg-[#f0efed]" />
            <div className="h-4 w-16 rounded bg-[#f0efed]" />
          </div>
        ))}
      </div>
    </div>
  );
}
