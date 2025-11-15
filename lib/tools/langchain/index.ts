// Export all langchain tools from a central location
export { fetchTool } from "./fetch";
export { webSearchTool } from "./web-search";
export { hackernewsTool } from "./hackernews";

// Export array of all tools for easy import
import { fetchTool } from "./fetch";
import { webSearchTool } from "./web-search";
import { hackernewsTool } from "./hackernews";

export const allTools = [fetchTool, webSearchTool, hackernewsTool];
