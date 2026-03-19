import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="h-12 w-12 text-[#999999] mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-[#111111] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[#666666] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a3e] transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
