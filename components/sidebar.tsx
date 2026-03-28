"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  AlertCircle,
  CreditCard,
  Gift,
  Calendar,
  CheckSquare,
  ArrowLeftRight,
  Lightbulb,
  Wrench,
  BookOpen,
  Lock,
  Settings,
  Users,
  Menu,
  Shield,
  BarChart3,
} from "lucide-react";
import { UserButton, Show } from "@clerk/nextjs";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notification-bell";
import { SearchCommand } from "@/components/search-command";

interface SerializedNotification {
  id: string;
  title: string;
  body: string;
  type: "reset" | "streak" | "action" | "setup";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

const navSections = [
  {
    label: "Control Center",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Actions", href: "/actions", icon: AlertCircle },
      { label: "Best Card", href: "/bestcard", icon: CreditCard },
    ],
  },
  {
    label: "Benefits",
    items: [
      { label: "Benefits", href: "/benefits", icon: Gift },
      { label: "Calendar", href: "/calendar", icon: Calendar },
      { label: "Checklist", href: "/checklist", icon: CheckSquare },
      { label: "Compare", href: "/compare", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Tips", href: "/tips", icon: Lightbulb },
      { label: "Tools", href: "/tools", icon: Wrench },
      { label: "Sources", href: "/sources", icon: BookOpen },
    ],
  },
  {
    label: "Personal",
    items: [
      { label: "Report", href: "/report", icon: BarChart3 },
      { label: "Claim History", href: "/vault", icon: Lock },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Refer", href: "/refer", icon: Users },
    ],
  },
];

function NavContent({
  pathname,
  plan,
  notifications,
  isAdmin,
}: {
  pathname: string;
  plan: "free" | "pro";
  notifications: SerializedNotification[];
  isAdmin: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo + Search */}
      <div className="flex items-center gap-3 px-5 py-6">
        <Image
          src="/logo.png"
          alt="CreditOS"
          width={36}
          height={24}
          className="rounded"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#111111]">CreditOS</div>
          <div className="text-xs text-[#666666]">Rewards Command Center</div>
        </div>
        <SearchCommand />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[10px] font-medium text-[#999999] uppercase tracking-wider">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-[#f0efed] text-[#111111]"
                          : "text-[#666666] hover:bg-[#f0efed] active:bg-[#e5e3e0] hover:text-[#111111]"
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
            </div>
          </div>
        ))}

        {/* Admin link */}
        {isAdmin && (
          <div>
            <p className="px-3 mb-1 text-[10px] font-medium text-[#999999] uppercase tracking-wider">
              Admin
            </p>
            <div className="space-y-0.5">
              <Link
                href="/admin"
                aria-current={pathname === "/admin" ? "page" : undefined}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    pathname === "/admin"
                      ? "bg-[#f0efed] text-[#111111]"
                      : "text-[#666666] hover:bg-[#f0efed] active:bg-[#e5e3e0] hover:text-[#111111]"
                  }
                `}
              >
                {pathname === "/admin" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#1a1a2e] rounded-r-full" />
                )}
                <Shield className="h-4 w-4 shrink-0" />
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Footer: Plan badge + Notifications + User */}
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
        <div className="flex items-center gap-2">
          <NotificationBell notifications={notifications} />
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
    </div>
  );
}

export function Sidebar({
  plan = "free",
  notifications = [],
  isAdmin = false,
}: {
  plan?: "free" | "pro";
  notifications?: SerializedNotification[];
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col border-r border-[#e0ddd9] bg-[#fafaf9]">
        <NavContent pathname={pathname} plan={plan} notifications={notifications} isAdmin={isAdmin} />
      </aside>

      {/* Mobile hamburger + sheet */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 bg-[#fafaf9] border-b border-[#e0ddd9] md:hidden pt-[env(safe-area-inset-top)]">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            className="p-3 -ml-3 rounded-md hover:bg-[#f0efed] active:bg-[#e5e3e0]"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-[#111111]" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#fafaf9]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <NavContent pathname={pathname} plan={plan} notifications={notifications} isAdmin={isAdmin} />
          </SheetContent>
        </Sheet>
        <div className="ml-3 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="CreditOS"
            width={28}
            height={18}
            className="rounded"
          />
          <span className="text-sm font-semibold text-[#111111]">
            CreditOS
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <SearchCommand />
          <NotificationBell notifications={notifications} />
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
