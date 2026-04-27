import yahooFinance from "yahoo-finance2";
import { withCache } from "./cache";
import { mapWithConcurrency } from "./concurrency";
import { scoreSentiment, type Sentiment } from "./sentiment";

export type NewsItem = {
  symbol: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  sentiment: Sentiment;
};

type SearchNews = {
  uuid?: string;
  title?: string;
  publisher?: string;
  link?: string;
  providerPublishTime?: Date | number;
};

type SearchResult = {
  news?: SearchNews[];
};

async function fetchSymbolNews(symbol: string): Promise<NewsItem[]> {
  try {
    const result = (await yahooFinance.search(symbol, {
      newsCount: 5,
      quotesCount: 0,
    })) as unknown as SearchResult;
    const items = result.news ?? [];
    return items
      .filter((n) => n.title && n.link && n.providerPublishTime)
      .map((n) => {
        const t = n.providerPublishTime;
        const epoch =
          t instanceof Date
            ? Math.floor(t.getTime() / 1000)
            : typeof t === "number"
              ? t
              : Math.floor(Date.now() / 1000);
        return {
          symbol,
          title: n.title!,
          publisher: n.publisher ?? "Unknown",
          link: n.link!,
          publishedAt: epoch,
          sentiment: scoreSentiment(n.title!),
        };
      });
  } catch {
    return [];
  }
}

export async function getNewsForSymbols(symbols: string[]): Promise<NewsItem[]> {
  return withCache(`news:${symbols.join(",")}`, 600, async () => {
    const all = await mapWithConcurrency(symbols, 2, fetchSymbolNews);
    const seen = new Set<string>();
    const merged: NewsItem[] = [];
    for (const list of all) {
      for (const item of list) {
        if (seen.has(item.link)) continue;
        seen.add(item.link);
        merged.push(item);
      }
    }
    merged.sort((a, b) => b.publishedAt - a.publishedAt);
    return merged.slice(0, 20);
  });
}
