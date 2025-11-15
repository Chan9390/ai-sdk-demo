import { WebScraperResult } from "@/types/web-scraper";
import { load } from "cheerio";

export async function scrapeUrl(url: string): Promise<WebScraperResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChatBot/1.0)",
      },
    });

    if (!response.ok) {
      return {
        content: "",
        type: "html",
        error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return { content: data, type: "json" };
    }

    const html = await response.text();
    const $ = load(html);
    $("script, style, noscript").remove();

    const title = $("head > title").text().trim();
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const combinedText = [title, bodyText].filter(Boolean).join(" - ");
    const cleanText = combinedText.substring(0, 10000);

    return {
      url,
      content: cleanText,
      type: "html",
      length: cleanText.length,
    };
  } catch (error) {
    return {
      content: "",
      type: "html",
      error: `Failed to scrape URL: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
