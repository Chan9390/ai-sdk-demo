import { tool } from "ai";
import { hackernewsSchema } from "@/types/hackernews";
import { fetchHackerNews } from "@/actions/hackernews";

// Hacker News tool - fetches top stories from Hacker News
export const hackernewsTool = tool({
  description:
    "Fetch the latest top stories from Hacker News. Returns a list of trending stories with titles, URLs, scores, authors, and timestamps. Useful for getting current tech news and discussions.",
  inputSchema: hackernewsSchema,
  execute: async ({ limit = 10 }) => {
    return await fetchHackerNews(limit);
  },
});
