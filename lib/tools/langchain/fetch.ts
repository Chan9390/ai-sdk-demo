import { DynamicStructuredTool } from "@langchain/core/tools";
import { webScraperSchema } from "@/types/web-scraper";
import { scrapeUrl } from "@/actions/web-scraper";

// Fetch tool - scrapes and extracts content from URLs
export const fetchTool = new DynamicStructuredTool({
  name: "fetch",
  description:
    "Scrape and extract text content from a given URL. Useful for reading articles, documentation, or web pages.",
  schema: webScraperSchema,
  func: async ({ url }) => {
    const result = await scrapeUrl(url);
    return JSON.stringify(result);
  },
});
