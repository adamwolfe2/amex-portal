import { describe, it, expect } from "vitest";
import { search } from "../search";
import type { SearchResultType } from "../search";

describe("search", () => {
  it("returns empty array for empty query", () => {
    expect(search("")).toEqual([]);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(search("   ")).toEqual([]);
  });

  it('matches "uber" to Uber Cash benefit', () => {
    const results = search("uber");
    expect(results.length).toBeGreaterThan(0);

    const uberResult = results.find((r) => r.title === "Uber Cash");
    expect(uberResult).toBeDefined();
    expect(uberResult!.type).toBe("benefit");
  });

  it("performs case-insensitive matching", () => {
    const lower = search("uber");
    const upper = search("UBER");
    const mixed = search("Uber");

    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(mixed.length);

    // Same titles in same order
    expect(lower.map((r) => r.title)).toEqual(upper.map((r) => r.title));
    expect(lower.map((r) => r.title)).toEqual(mixed.map((r) => r.title));
  });

  it("results are capped at 15 total", () => {
    // Use a very broad query that matches many items
    const results = search("a");
    expect(results.length).toBeLessThanOrEqual(15);
  });

  it("results have correct types", () => {
    const validTypes: SearchResultType[] = [
      "benefit",
      "checklist",
      "tip",
      "tool",
      "source",
    ];

    const results = search("platinum");
    for (const result of results) {
      expect(validTypes).toContain(result.type);
    }
  });

  it("results have href strings", () => {
    const results = search("uber");
    for (const result of results) {
      expect(typeof result.href).toBe("string");
      expect(result.href.length).toBeGreaterThan(0);
    }
  });

  it("benefit results have query-encoded hrefs", () => {
    const results = search("uber");
    const benefitResults = results.filter((r) => r.type === "benefit");
    for (const result of benefitResults) {
      expect(result.href).toMatch(/^\/benefits\?q=/);
    }
  });

  it("returns no results for nonsense query", () => {
    const results = search("zzzzzzzzxxxxxxxxxxyyyyyy");
    expect(results).toEqual([]);
  });

  it("matches across different categories", () => {
    // "resy" should match benefits, checklist items, tips, tools, and possibly sources
    const results = search("resy");
    const types = new Set(results.map((r) => r.type));
    expect(types.size).toBeGreaterThanOrEqual(2);
  });

  it("matches on description as well as title", () => {
    // "grubhub" appears in the dining credit description but not its title
    const results = search("grubhub");
    expect(results.length).toBeGreaterThan(0);
  });

  it("results have title and description strings", () => {
    const results = search("hotel");
    for (const result of results) {
      expect(typeof result.title).toBe("string");
      expect(result.title.length).toBeGreaterThan(0);
      expect(typeof result.description).toBe("string");
      expect(result.description.length).toBeGreaterThan(0);
    }
  });
});
