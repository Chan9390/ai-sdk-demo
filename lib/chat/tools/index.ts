// Export all tools from a central location
export { webScraperTool, webScraperSchema } from "./web-scraper";
export { duckduckgoSearchTool, duckduckgoSearchSchema } from "./duckduckgo-search";
export { hackernewsTool, hackernewsSchema } from "./hackernews";

// Export array of all tools for easy import
import { webScraperTool } from "./web-scraper";
import { duckduckgoSearchTool } from "./duckduckgo-search";
import { hackernewsTool } from "./hackernews";

export const allTools = [
  webScraperTool,
  duckduckgoSearchTool,
  hackernewsTool,
];
