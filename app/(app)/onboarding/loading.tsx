export default function OnboardingLoading() {
  return (
    <div className="min-h-dvh bg-[#fafaf9] flex items-center justify-center px-4 animate-pulse">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-[#e0ddd9] mx-auto" />
          <div className="h-7 w-56 rounded bg-[#e0ddd9] mx-auto" />
          <div className="h-4 w-72 rounded bg-[#f0efed] mx-auto" />
        </div>
        <div className="rounded-lg border border-[#e0ddd9] bg-white p-6 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border-2 border-[#f0efed] p-4 space-y-2">
              <div className="h-5 w-32 rounded bg-[#e0ddd9]" />
              <div className="h-4 w-full rounded bg-[#f0efed]" />
            </div>
          ))}
          <div className="h-11 w-full rounded-lg bg-[#e0ddd9]" />
        </div>
      </div>
    </div>
  );
}
