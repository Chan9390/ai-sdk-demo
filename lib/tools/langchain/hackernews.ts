import { DynamicStructuredTool } from "@langchain/core/tools";
import { hackernewsSchema } from "@/types/hackernews";
import { fetchHackerNews } from "@/actions/hackernews";

// Hacker News tool - fetches top stories from Hacker News
export const hackernewsTool = new DynamicStructuredTool({
  name: "hackernews",
  description:
    "Fetch the latest top stories from Hacker News. Returns a list of trending stories with titles, URLs, scores, authors, and timestamps. Useful for getting current tech news and discussions.",
  schema: hackernewsSchema,
  func: async ({ limit = 10 }) => {
    const result = await fetchHackerNews(limit);
    return JSON.stringify(result);
  },
});
