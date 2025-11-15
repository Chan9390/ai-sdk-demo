import { z } from "zod";

export const webScraperSchema = z.object({
  url: z.url().describe("The URL to scrape content from"),
});

export type WebScraperInput = z.infer<typeof webScraperSchema>;

export type WebScraperResult = {
  url?: string;
  content: string | Record<string, unknown>;
  type: "json" | "html";
  length?: number;
  error?: string;
};
