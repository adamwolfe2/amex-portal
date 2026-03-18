"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Calendar,
  Lightbulb,
  Wrench,
  Lock,
  Settings,
  Users,
  Menu,
} from "lucide-react";
import { UserButton, Show } from "@clerk/nextjs";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Benefits", href: "/benefits", icon: Gift },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Tips", href: "/tips", icon: Lightbulb },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Vault", href: "/vault", icon: Lock },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Refer", href: "/refer", icon: Users },
];

function NavContent({
  pathname,
  plan,
}: {
  pathname: string;
  plan: "free" | "pro";
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <Image
          src="/centurion-logo.png"
          alt="Amex OS"
          width={36}
          height={36}
          className="rounded-md"
        />
        <div>
          <div className="text-sm font-semibold text-[#111111]">Amex OS</div>
          <div className="text-xs text-[#666666]">Rewards Tracker</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-[#f0efed] text-[#111111]"
                    : "text-[#666666] hover:bg-[#f0efed] hover:text-[#111111]"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#1a1a2e] rounded-r-full" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Plan badge + User */}
      <div className="px-5 py-4 border-t border-[#e0ddd9] flex items-center justify-between">
        <span
          className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
              plan === "pro"
                ? "bg-[#1a1a2e] text-white"
                : "bg-[#f0efed] text-[#666666]"
            }
          `}
        >
          {plan === "pro" ? "Pro" : "Free"}
        </span>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
        </Show>
      </div>
    </div>
  );
}

export function Sidebar({ plan = "free" }: { plan?: "free" | "pro" }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col border-r border-[#e0ddd9] bg-[#fafaf9]">
        <NavContent pathname={pathname} plan={plan} />
      </aside>

      {/* Mobile hamburger + sheet */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 bg-[#fafaf9] border-b border-[#e0ddd9] md:hidden">
        <Sheet>
          <SheetTrigger className="p-2 -ml-2 rounded-md hover:bg-[#f0efed]">
            <Menu className="h-5 w-5 text-[#111111]" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#fafaf9]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <NavContent pathname={pathname} plan={plan} />
          </SheetContent>
        </Sheet>
        <div className="ml-3 flex items-center gap-2">
          <Image
            src="/centurion-logo.png"
            alt="Amex OS"
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="text-sm font-semibold text-[#111111]">Amex OS</span>
        </div>
        <div className="ml-auto">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-7 w-7",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </>
  );
}
