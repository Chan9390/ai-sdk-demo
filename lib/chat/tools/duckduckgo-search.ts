import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { search, SafeSearchType } from "duck-duck-scrape";

// Zod schema for DuckDuckGo search
export const duckduckgoSearchSchema = z.object({
  query: z.string().describe("The search query to look up on DuckDuckGo"),
  max_results: z
    .number()
    .optional()
    .default(5)
    .describe("Maximum number of results to return (default: 5)"),
});

// Tool implementation
export const duckduckgoSearchTool = new DynamicStructuredTool({
  name: "duckduckgo_search",
  description:
    "Search the internet using DuckDuckGo. Returns a list of relevant web pages with titles, URLs, and descriptions. Useful for finding current information, news, or answering questions that require web search.",
  schema: duckduckgoSearchSchema,
  func: async ({ query, max_results = 5 }) => {
    try {
      const searchResults = await search(query, {
        safeSearch: SafeSearchType.MODERATE,
      });

      if (searchResults.noResults || !searchResults.results) {
        return JSON.stringify({
          query,
          results: [],
          message: "No results found for this query.",
        });
      }

      // Limit results to max_results
      const limitedResults = searchResults.results
        .slice(0, max_results)
        .map((result) => ({
          title: result.title,
          url: result.url,
          description: result.description || "",
        }));

      return JSON.stringify({
        query,
        results: limitedResults,
        count: limitedResults.length,
      });
    } catch (error) {
      return JSON.stringify({
        error: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
});
