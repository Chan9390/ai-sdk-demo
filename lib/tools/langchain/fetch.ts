import { tool } from "langchain";
import { webScraperSchema } from "@/types/web-scraper";
import { scrapeUrl } from "@/actions/web-scraper";

// Fetch tool - scrapes and extracts content from URLs
export const fetchTool = tool(
  async ({ url }) => {
    const result = await scrapeUrl(url);
    return JSON.stringify(result);
  },
  {
    name: "fetch",
    description:
      "Scrape and extract text content from a given URL. Useful for reading articles, documentation, or web pages.",
    schema: webScraperSchema,
  }
);
