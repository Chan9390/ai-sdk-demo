import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Zod schema for Hacker News
export const hackernewsSchema = z.object({
  limit: z
    .number()
    .optional()
    .default(10)
    .describe("Number of top stories to fetch (default: 10, max: 30)"),
});

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

// Tool implementation
export const hackernewsTool = new DynamicStructuredTool({
  name: "hackernews",
  description:
    "Fetch the latest top stories from Hacker News. Returns a list of trending stories with titles, URLs, scores, authors, and timestamps. Useful for getting current tech news and discussions.",
  schema: hackernewsSchema,
  func: async ({ limit = 10 }) => {
    try {
      // Ensure limit is between 1 and 30
      const safeLimit = Math.min(Math.max(limit, 1), 30);

      // Fetch top story IDs
      const topStoriesResponse = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );

      if (!topStoriesResponse.ok) {
        return JSON.stringify({
          error: `Failed to fetch top stories: ${topStoriesResponse.status}`,
        });
      }

      const storyIds: number[] = await topStoriesResponse.json();

      // Fetch individual stories in parallel
      const storyPromises = storyIds.slice(0, safeLimit).map(async (id) => {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!response.ok) return null;
        return response.json();
      });

      const stories = (await Promise.all(storyPromises)).filter(
        (story): story is HNStory => story !== null && story.type === "story"
      );

      // Format stories for readability
      const formattedStories = stories.map((story) => ({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        score: story.score,
        author: story.by,
        comments: story.descendants || 0,
        time: new Date(story.time * 1000).toISOString(),
      }));

      return JSON.stringify({
        stories: formattedStories,
        count: formattedStories.length,
        fetched_at: new Date().toISOString(),
      });
    } catch (error) {
      return JSON.stringify({
        error: `Failed to fetch Hacker News: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
});
