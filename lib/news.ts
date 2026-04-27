import { withCache } from "./cache";
import { scoreSentiment, type Sentiment } from "./sentiment";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type NewsItem = {
  symbol: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  sentiment: Sentiment;
};

type YahooSearchResponse = {
  news?: Array<{
    uuid?: string;
    title?: string;
    publisher?: string;
    link?: string;
    providerPublishTime?: number;
  }>;
};

async function fetchSymbolNews(symbol: string): Promise<NewsItem[]> {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    symbol,
  )}&newsCount=5&quotesCount=0`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = (await res.json()) as YahooSearchResponse;
  const items = json.news ?? [];
  return items
    .filter((n) => n.title && n.link && n.providerPublishTime)
    .map((n) => ({
      symbol,
      title: n.title!,
      publisher: n.publisher ?? "Unknown",
      link: n.link!,
      publishedAt: n.providerPublishTime!,
      sentiment: scoreSentiment(n.title!),
    }));
}

export async function getNewsForSymbols(symbols: string[]): Promise<NewsItem[]> {
  return withCache(`news:${symbols.join(",")}`, 600, async () => {
    const all = await Promise.all(symbols.map(fetchSymbolNews));
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
