"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["\u2318", "K"], description: "Open search" },
  { keys: ["Esc"], description: "Close dialogs" },
  { keys: ["\u2191\u2193"], description: "Navigate search results" },
  { keys: ["\u21B5"], description: "Select search result" },
  { keys: ["?"], description: "Show this help" },
];

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="bg-white border border-[#e0ddd9] rounded-lg shadow-lg w-80 max-w-[calc(100vw-2rem)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-[#666666]" />
            <span className="text-sm font-semibold text-[#111111]">
              Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded hover:bg-[#f0efed] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close shortcuts help"
          >
            <X className="h-4 w-4 text-[#999999]" />
          </button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.description} className="flex items-center justify-between">
              <span className="text-sm text-[#666666]">{s.description}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-medium text-[#666666] bg-[#f0efed] border border-[#e0ddd9] rounded"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
