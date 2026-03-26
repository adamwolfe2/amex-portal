"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, RotateCcw, Flame, CheckSquare, Settings, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "reset" | "streak" | "action" | "setup";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

const STORAGE_KEY = "creditos-notifications-read";
const MAX_VISIBLE = 10;

const TYPE_ICONS: Record<string, typeof Bell> = {
  reset: RotateCcw,
  streak: Flame,
  action: CheckSquare,
  setup: Settings,
};

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function setReadIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function NotificationBell({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIdsState] = useState<Set<string>>(() => getReadIds());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const visibleNotifications = notifications
    .filter((n) => !dismissedIds.has(n.id))
    .slice(0, MAX_VISIBLE);

  const unreadCount = visibleNotifications.filter(
    (n) => !readIds.has(n.id)
  ).length;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    const newReadIds = new Set(readIds);
    for (const n of visibleNotifications) {
      newReadIds.add(n.id);
    }
    setReadIdsState(newReadIds);
    setReadIds(newReadIds);
  }, [readIds, visibleNotifications]);

  const handleDismiss = useCallback(
    (id: string) => {
      setDismissedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      // Also mark as read
      const newReadIds = new Set(readIds);
      newReadIds.add(id);
      setReadIdsState(newReadIds);
      setReadIds(newReadIds);
    },
    [readIds]
  );

  if (notifications.length === 0) {
    return (
      <button
        className="p-2.5 rounded-md hover:bg-[#f0efed] transition-colors"
        aria-label="No notifications"
        disabled
      >
        <Bell className="h-4 w-4 text-[#999999]" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-md hover:bg-[#f0efed] transition-colors"
        aria-label={`${unreadCount} unread notifications`}
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4 text-[#666666]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#f0eeeb] text-[10px] font-semibold text-[#333333]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-[#e0ddd9] rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0ddd9]">
            <span className="text-sm font-semibold text-[#111111]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-[#999999] hover:text-[#666666] transition-colors py-2 px-1"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-5 w-5 text-[#cccccc] mx-auto mb-2" />
                <p className="text-xs text-[#999999]">All caught up</p>
              </div>
            ) : (
              visibleNotifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type] ?? Bell;
                const isRead = readIds.has(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={`
                      flex gap-3 px-4 py-3 border-b border-[#f0efed] last:border-b-0
                      transition-colors group
                      ${isRead ? "bg-white" : "bg-[#fafaf9]"}
                    `}
                  >
                    <div className="shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-[#999999]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs leading-snug ${
                            isRead
                              ? "text-[#666666] font-normal"
                              : "text-[#111111] font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <button
                          onClick={() => handleDismiss(notification.id)}
                          className="shrink-0 p-1.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[#f0efed] transition-all"
                          aria-label="Dismiss notification"
                        >
                          <X className="h-3 w-3 text-[#999999]" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#999999] leading-snug mt-0.5 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-[#cccccc] mt-1">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!isRead && (
                      <div className="shrink-0 mt-1.5">
                        <span className="block w-1.5 h-1.5 rounded-full bg-[#333333]" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
