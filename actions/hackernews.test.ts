import { describe, it, expect } from "vitest";
import { fetchHackerNews } from "./hackernews";

describe("fetchHackerNews", () => {
  it("fetches a limited list of stories", async () => {
    const limit = 5;
    const result = await fetchHackerNews(limit);

    expect(result.error).toBeUndefined();
    expect(result.count).toBeDefined();
    expect(result.count).toBeLessThanOrEqual(limit);

    const stories = result.stories ?? [];
    expect(stories.length).toBe(result.count);
    expect(stories.length).toBeGreaterThan(0);
    expect(result.fetched_at).toBeDefined();

    const firstStory = stories[0];
    expect(firstStory.title).toBeTruthy();
    expect(firstStory.author).toBeTruthy();
    expect(firstStory.url).toMatch(
      /^https?:\/\/|^https:\/\/news\.ycombinator\.com/
    );
  }, 20000);
});
