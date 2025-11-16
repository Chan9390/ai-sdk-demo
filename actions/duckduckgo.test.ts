import { describe, it, expect } from "vitest";
import { searchDuckDuckGo } from "./duckduckgo";

describe("searchDuckDuckGo", () => {
  it("returns clean results for a basic query", async () => {
    const query = "Chandrapal Badshah";
    const limit = 3;
    const result = await searchDuckDuckGo(query, limit);

    expect(result.error).toBeUndefined();
    expect(result.query).toBe(query);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.count).toBeDefined();
    expect(result.count).toBeLessThanOrEqual(limit);
    expect(result.count).toBe(result.results.length);

    const firstResult = result.results[0];
    expect(firstResult.title).toBeTruthy();
    expect(firstResult.url).toMatch(/^https?:\/\//);
    expect(firstResult.description).toBeTruthy();
    expect(firstResult.description).not.toMatch(/<[^>]+>/);
  }, 20000);
});
