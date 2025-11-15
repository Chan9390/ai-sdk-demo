import { tool } from "ai";
import { duckduckgoSearchSchema } from "@/types/duckduckgo";
import { searchDuckDuckGo } from "@/actions/duckduckgo";

// Web Search tool - searches DuckDuckGo
export const webSearchTool = tool({
  description:
    "Search the internet using DuckDuckGo. Returns a list of relevant web pages with titles, URLs, and descriptions. Useful for finding current information, news, or answering questions that require web search.",
  inputSchema: duckduckgoSearchSchema,
  execute: async ({ query, max_results = 5 }) => {
    return await searchDuckDuckGo(query, max_results);
  },
});
