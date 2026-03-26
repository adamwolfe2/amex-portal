import { BENEFITS } from "./benefits";
import { CHECKLIST_ITEMS } from "./checklist";
import { TIPS } from "./tips";
import { TRAVEL_TOOLS } from "./tools";
import { SOURCES } from "./sources";

export type SearchResultType = "benefit" | "checklist" | "tip" | "tool" | "source";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
}

const MAX_PER_CATEGORY = 5;
const MAX_TOTAL = 15;

export function search(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const benefits: SearchResult[] = [];
  const checklist: SearchResult[] = [];
  const tips: SearchResult[] = [];
  const tools: SearchResult[] = [];
  const sources: SearchResult[] = [];

  for (const b of BENEFITS) {
    if (benefits.length >= MAX_PER_CATEGORY) break;
    if (
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    ) {
      benefits.push({
        type: "benefit",
        title: b.name,
        description: b.description,
        href: `/benefits?q=${encodeURIComponent(b.name)}`,
      });
    }
  }

  for (const c of CHECKLIST_ITEMS) {
    if (checklist.length >= MAX_PER_CATEGORY) break;
    if (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    ) {
      checklist.push({
        type: "checklist",
        title: c.title,
        description: c.description,
        href: "/checklist",
      });
    }
  }

  for (const t of TIPS) {
    if (tips.length >= MAX_PER_CATEGORY) break;
    if (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    ) {
      tips.push({
        type: "tip",
        title: t.title,
        description: t.description,
        href: "/tips",
      });
    }
  }

  for (const t of TRAVEL_TOOLS) {
    if (tools.length >= MAX_PER_CATEGORY) break;
    if (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    ) {
      tools.push({
        type: "tool",
        title: t.name,
        description: t.description,
        href: "/tools",
      });
    }
  }

  for (const s of SOURCES) {
    if (sources.length >= MAX_PER_CATEGORY) break;
    if (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    ) {
      sources.push({
        type: "source",
        title: s.title,
        description: s.description,
        href: "/sources",
      });
    }
  }

  return [...benefits, ...checklist, ...tips, ...tools, ...sources].slice(
    0,
    MAX_TOTAL
  );
}
