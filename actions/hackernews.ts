import { HNStory, HackerNewsResult } from "@/types/hackernews";

export async function fetchHackerNews(
  limit: number = 10
): Promise<HackerNewsResult> {
  try {
    const safeLimit = Math.min(Math.max(limit, 1), 30);

    const topStoriesResponse = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    if (!topStoriesResponse.ok) {
      return {
        error: `Failed to fetch top stories: ${topStoriesResponse.status}`,
      };
    }

    const storyIds: number[] = await topStoriesResponse.json();

    const storyPromises = storyIds.slice(0, safeLimit).map(async (id) => {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      if (!response.ok) return null;
      return response.json();
    });

    const stories = (await Promise.all(storyPromises)).filter(
      (story): story is HNStory => story !== null && story.type === "story"
    );

    const formattedStories = stories.map((story) => ({
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      score: story.score,
      author: story.by,
      comments: story.descendants || 0,
      time: new Date(story.time * 1000).toISOString(),
    }));

    return {
      stories: formattedStories,
      count: formattedStories.length,
      fetched_at: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: `Failed to fetch Hacker News: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
