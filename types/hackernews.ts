import { z } from "zod";

export const hackernewsSchema = z.object({
  limit: z
    .number()
    .optional()
    .default(10)
    .describe("Number of top stories to fetch (default: 10, max: 30)"),
});

export type HackerNewsInput = z.infer<typeof hackernewsSchema>;

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type?: string;
}

export type HackerNewsResult = {
  stories?: Array<{
    title: string;
    url: string;
    score: number;
    author: string;
    comments: number;
    time: string;
  }>;
  count?: number;
  fetched_at?: string;
  error?: string;
};
