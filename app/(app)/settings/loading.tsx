export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse space-y-6">
      <div className="h-8 w-32 rounded bg-[#e0ddd9]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[#e0ddd9] bg-white p-6 space-y-3">
          <div className="h-5 w-40 rounded bg-[#e0ddd9]" />
          <div className="h-4 w-full rounded bg-[#f0efed]" />
          <div className="h-4 w-3/4 rounded bg-[#f0efed]" />
          <div className="h-10 w-32 rounded bg-[#e0ddd9]" />
        </div>
      ))}
    </div>
  );
}
