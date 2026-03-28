export default function CalendarLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="mb-6 h-8 w-48 rounded bg-[#e0ddd9]" />
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 rounded bg-[#e0ddd9]" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-[#f0efed]" />
        ))}
      </div>
    </div>
  );
}
