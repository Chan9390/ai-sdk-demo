import { z } from "zod";

export const duckduckgoSearchSchema = z.object({
  query: z.string().describe("The search query to look up on DuckDuckGo"),
  max_results: z
    .number()
    .optional()
    .default(5)
    .describe("Maximum number of results to return (default: 5)"),
});

export type DuckDuckGoInput = z.infer<typeof duckduckgoSearchSchema>;

export type DuckDuckGoResult = {
  query: string;
  results: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  count?: number;
  message?: string;
  error?: string;
};
