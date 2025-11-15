// Export all ai-sdk tools from a central location
export { fetchTool } from "./fetch";
export { webSearchTool } from "./web-search";
export { hackernewsTool } from "./hackernews";

// Export object of all tools for easy import
import { fetchTool } from "./fetch";
import { webSearchTool } from "./web-search";
import { hackernewsTool } from "./hackernews";

export const allTools = {
  fetch: fetchTool,
  web_search: webSearchTool,
  hackernews: hackernewsTool,
};
