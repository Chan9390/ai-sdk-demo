import { tool } from "ai";
import { webScraperSchema } from "@/types/web-scraper";
import { scrapeUrl } from "@/actions/web-scraper";

// Fetch tool - scrapes and extracts content from URLs
export const fetchTool = tool({
  description:
    "Scrape and extract text content from a given URL. Useful for reading articles, documentation, or web pages.",
  inputSchema: webScraperSchema,
  execute: async ({ url }) => {
    return await scrapeUrl(url);
  },
});
