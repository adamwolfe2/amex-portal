"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-lg font-semibold text-[#111111] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[#666666] mb-6">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
