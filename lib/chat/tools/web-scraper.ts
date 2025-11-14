import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Zod schema for web scraping
export const webScraperSchema = z.object({
  url: z.url().describe("The URL to scrape content from"),
});

// Tool implementation
export const webScraperTool = new DynamicStructuredTool({
  name: "web_scraper",
  description:
    "Scrape and extract text content from a given URL. Useful for reading articles, documentation, or web pages.",
  schema: webScraperSchema,
  func: async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ChatBot/1.0)",
        },
      });

      if (!response.ok) {
        return JSON.stringify({
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        });
      }

      const contentType = response.headers.get("content-type") || "";

      // Handle JSON responses
      if (contentType.includes("application/json")) {
        const data = await response.json();
        return JSON.stringify({ content: data, type: "json" });
      }

      // Handle HTML/text responses
      const text = await response.text();

      // Basic HTML text extraction (remove scripts, styles, tags)
      const cleanText = text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 10000); // Limit to 10k chars

      return JSON.stringify({
        url,
        content: cleanText,
        type: "html",
        length: cleanText.length,
      });
    } catch (error) {
      return JSON.stringify({
        error: `Failed to scrape URL: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
});
