"use client";

import { createContext, useContext } from "react";
import type { CardKey } from "@/lib/data/types";

interface UserContextValue {
  cards: CardKey[];
  plan: "free" | "pro";
  hasCompletedOnboarding: boolean;
}

const UserContext = createContext<UserContextValue>({
  cards: ["platinum", "gold"],
  plan: "free",
  hasCompletedOnboarding: true,
});

export function UserProvider({
  children,
  cards,
  plan,
  hasCompletedOnboarding,
}: {
  children: React.ReactNode;
  cards: CardKey[];
  plan: "free" | "pro";
  hasCompletedOnboarding: boolean;
}) {
  return (
    <UserContext value={{ cards, plan, hasCompletedOnboarding }}>
      {children}
    </UserContext>
  );
}

export function useUser() {
  return useContext(UserContext);
}
