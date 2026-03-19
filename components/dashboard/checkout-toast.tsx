"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function CheckoutToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast.success("Welcome to Pro! Your upgrade is complete.");
    } else if (checkout === "cancel") {
      toast("Checkout cancelled. You can upgrade anytime from Settings.");
    }
  }, [searchParams]);

  return null;
}
