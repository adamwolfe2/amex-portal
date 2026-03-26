"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

export function OnboardingGuard() {
  const { hasCompletedOnboarding } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasCompletedOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [hasCompletedOnboarding, pathname, router]);

  return null;
}
