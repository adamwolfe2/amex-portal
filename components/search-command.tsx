"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CreditCard,
  CheckSquare,
  Lightbulb,
  Wrench,
  BookOpen,
  X,
} from "lucide-react";
import { search, type SearchResult, type SearchResultType } from "@/lib/data/search";

const TYPE_META: Record<
  SearchResultType,
  { label: string; icon: typeof CreditCard }
> = {
  benefit: { label: "Benefits", icon: CreditCard },
  checklist: { label: "Checklist", icon: CheckSquare },
  tip: { label: "Tips", icon: Lightbulb },
  tool: { label: "Tools", icon: Wrench },
  source: { label: "Sources", icon: BookOpen },
};

function groupResults(
  results: SearchResult[]
): Record<SearchResultType, SearchResult[]> {
  const groups: Record<SearchResultType, SearchResult[]> = {
    benefit: [],
    checklist: [],
    tip: [],
    tool: [],
    source: [],
  };
  for (const r of results) {
    groups[r.type].push(r);
  }
  return groups;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = search(query);
  const grouped = groupResults(results);
  const visibleTypes = (
    Object.keys(grouped) as SearchResultType[]
  ).filter((t) => grouped[t].length > 0);

  // Flat list for keyboard nav
  const flatResults = visibleTypes.flatMap((t) => grouped[t]);

  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const navigateTo = useCallback(
    (result: SearchResult) => {
      closeModal();
      router.push(result.href);
    },
    [closeModal, router]
  );

  // Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closeModal();
        } else {
          openModal();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openModal, closeModal]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0 && activeIndex < flatResults.length) {
        e.preventDefault();
        navigateTo(flatResults[activeIndex]);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, flatResults, closeModal, navigateTo]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-search-item]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setActiveIndex(-1);
    },
    []
  );

  let flatIndex = -1;

  return (
    <>
      {/* Desktop trigger */}
      <button
        type="button"
        onClick={openModal}
        className="hidden md:flex items-center justify-center h-11 w-11 rounded-lg hover:bg-[#f0efed] active:bg-[#e5e3e0] transition-colors"
        aria-label="Search (Cmd+K)"
        title="Search (Cmd+K)"
      >
        <Search className="h-4 w-4 text-[#666666]" />
      </button>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={openModal}
        className="md:hidden flex items-center justify-center h-11 w-11 rounded-lg hover:bg-[#f0efed] active:bg-[#e5e3e0] transition-colors"
        aria-label="Search"
        title="Search"
      >
        <Search className="h-5 w-5 text-[#111111]" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Search CreditOS"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg mx-4 mt-[15vh] md:mt-[20vh] bg-[#fafaf9] rounded-xl border border-[#e0ddd9] shadow-2xl overflow-hidden md:mx-auto max-h-[70vh] flex flex-col">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-[#e0ddd9]">
              <Search className="h-4 w-4 text-[#999999] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search benefits, tips, tools, sources..."
                className="flex-1 h-12 md:h-11 bg-transparent text-base md:text-sm text-[#111111] placeholder:text-[#999999] outline-none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={closeModal}
                className="flex items-center justify-center h-7 w-7 rounded hover:bg-[#f0efed]"
                aria-label="Close search"
              >
                <X className="h-4 w-4 text-[#999999]" />
              </button>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="overflow-y-auto overscroll-contain px-2 py-2"
            >
              {query.trim() && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-[#999999]">
                  No results found
                </p>
              )}

              {!query.trim() && (
                <p className="px-3 py-8 text-center text-sm text-[#999999]">
                  Type to search across all CreditOS data
                </p>
              )}

              {visibleTypes.map((type) => {
                const meta = TYPE_META[type];
                const items = grouped[type];
                return (
                  <div key={type} className="mb-2 last:mb-0">
                    <p className="px-3 pt-2 pb-1 text-[11px] font-medium text-[#999999] uppercase tracking-wider">
                      {meta.label}
                    </p>
                    {items.map((item) => {
                      flatIndex += 1;
                      const idx = flatIndex;
                      const Icon = meta.icon;
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={`${item.type}-${item.title}-${idx}`}
                          type="button"
                          data-search-item
                          onClick={() => navigateTo(item)}
                          className={`
                            w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left
                            min-h-[44px] transition-colors
                            ${
                              isActive
                                ? "bg-[#1a1a2e] text-white"
                                : "text-[#111111] hover:bg-[#f0efed]"
                            }
                          `}
                        >
                          <Icon
                            className={`h-4 w-4 mt-0.5 shrink-0 ${
                              isActive ? "text-white" : "text-[#999999]"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium truncate ${
                                isActive ? "text-white" : "text-[#111111]"
                              }`}
                            >
                              {item.title}
                            </p>
                            <p
                              className={`text-[11px] line-clamp-1 ${
                                isActive
                                  ? "text-white/70"
                                  : "text-[#999999]"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-[#e0ddd9] flex items-center gap-4">
              <span className="text-[11px] text-[#999999]">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#e0ddd9] bg-[#f0efed] text-[10px] font-mono text-[#666666]">
                  Esc
                </kbd>{" "}
                to close
              </span>
              <span className="text-[11px] text-[#999999]">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#e0ddd9] bg-[#f0efed] text-[10px] font-mono text-[#666666]">
                  ↑↓
                </kbd>{" "}
                to navigate
              </span>
              <span className="text-[11px] text-[#999999]">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#e0ddd9] bg-[#f0efed] text-[10px] font-mono text-[#666666]">
                  ↵
                </kbd>{" "}
                to select
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
