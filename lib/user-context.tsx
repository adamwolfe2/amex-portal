"use client";

import { createContext, useContext } from "react";
import type { CardKey } from "@/lib/data/types";

interface UserContextValue {
  cards: CardKey[];
  plan: "free" | "pro";
}

const UserContext = createContext<UserContextValue>({
  cards: ["platinum", "gold"],
  plan: "free",
});

export function UserProvider({
  children,
  cards,
  plan,
}: {
  children: React.ReactNode;
  cards: CardKey[];
  plan: "free" | "pro";
}) {
  return <UserContext value={{ cards, plan }}>{children}</UserContext>;
}

export function useUser() {
  return useContext(UserContext);
}
