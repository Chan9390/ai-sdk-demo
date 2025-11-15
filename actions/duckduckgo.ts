import { DuckDuckGoResult } from "@/types/duckduckgo";
import { load } from "cheerio";
import { decode } from "he";

const LITE_ENDPOINT = "https://lite.duckduckgo.com/lite/";
const USER_AGENT =
  "Mozilla/5.0 (compatible; AI-SDK-Demo/1.0; +https://github.com/vercel/ai)";

function sanitizeHtml(value: string): string {
  return decode(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function resolveDuckDuckGoRedirect(rawHref: string): string {
  const normalizedHref = rawHref.startsWith("//")
    ? `https:${rawHref}`
    : rawHref.startsWith("/")
    ? `https://lite.duckduckgo.com${rawHref}`
    : rawHref;

  try {
    const url = new URL(normalizedHref);
    const uddg = url.searchParams.get("uddg");
    if (uddg) {
      return decodeURIComponent(uddg);
    }
    return url.toString();
  } catch {
    return normalizedHref;
  }
}

export async function searchDuckDuckGo(
  query: string,
  max_results: number = 5
): Promise<DuckDuckGoResult> {
  const safeMaxResults = Math.max(1, Math.min(max_results, 20));

  try {
    const response = await fetch(
      `${LITE_ENDPOINT}?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      return {
        query,
        results: [],
        error: `Failed to fetch DuckDuckGo: ${response.status} ${response.statusText}`,
      };
    }

    const html = await response.text();
    const $ = load(html);

    const results: DuckDuckGoResult["results"] = [];

    $("a.result-link").each((_, element) => {
      if (results.length >= safeMaxResults) {
        return false;
      }

      const rawHref = $(element).attr("href") ?? "";
      const rawTitle = $(element).text();

      const snippetCell = $(element)
        .closest("tr")
        .next()
        .find("td.result-snippet");
      const rawSnippet =
        snippetCell.length > 0
          ? snippetCell
              .html()
              ?.replace(/<br\s*\/?>/gi, " ")
              .replace(/\s+/g, " ")
          : "";

      const title = sanitizeHtml(rawTitle);
      const url = resolveDuckDuckGoRedirect(rawHref);
      const description = sanitizeHtml(rawSnippet || "");

      if (!title || !url) {
        return;
      }

      results.push({
        title,
        url,
        description,
      });
    });

    if (results.length === 0) {
      return {
        query,
        results: [],
        message: "No results found for this query.",
      };
    }

    return {
      query,
      results,
      count: results.length,
    };
  } catch (error) {
    return {
      query,
      results: [],
      error: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
