import { DynamicStructuredTool } from "@langchain/core/tools";
import { duckduckgoSearchSchema } from "@/types/duckduckgo";
import { searchDuckDuckGo } from "@/actions/duckduckgo";

// Web Search tool - searches DuckDuckGo
export const webSearchTool = new DynamicStructuredTool({
  name: "web_search",
  description:
    "Search the internet using DuckDuckGo. Returns a list of relevant web pages with titles, URLs, and descriptions. Useful for finding current information, news, or answering questions that require web search.",
  schema: duckduckgoSearchSchema,
  func: async ({ query, max_results = 5 }) => {
    const result = await searchDuckDuckGo(query, max_results);
    return JSON.stringify(result);
  },
});
