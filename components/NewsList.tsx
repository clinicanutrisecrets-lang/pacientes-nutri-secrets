"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import { relativeTime } from "@/lib/format";
import type { Sentiment } from "@/lib/sentiment";

type NewsItem = {
  symbol: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  sentiment: Sentiment;
};

const SENTIMENT_STYLES: Record<Sentiment, string> = {
  positive: "bg-green-950 text-green-400 border-green-900",
  negative: "bg-red-950 text-red-400 border-red-900",
  neutral: "bg-neutral-800 text-neutral-300 border-neutral-700",
};

const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "Positive",
  negative: "Negative",
  neutral: "Neutral",
};

export function NewsList() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { items: NewsItem[] };
        if (!cancelled) setItems(json.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load news");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Newspaper className="text-amber-400" size={20} />
        <h2 className="font-display text-2xl">News</h2>
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {loading && (
          <div className="p-4 text-sm text-neutral-400">Loading headlines…</div>
        )}
        {error && !loading && (
          <div className="p-4 text-sm text-red-400">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="p-4 text-sm text-neutral-400">No recent headlines.</div>
        )}
        {items.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 hover:bg-neutral-900 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 border border-border rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                {item.symbol}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider border rounded px-1.5 py-0.5 mt-0.5 shrink-0 ${SENTIMENT_STYLES[item.sentiment]}`}
              >
                {SENTIMENT_LABEL[item.sentiment]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-neutral-100 leading-snug flex items-start gap-2">
                  <span>{item.title}</span>
                  <ExternalLink size={12} className="text-neutral-500 mt-1 shrink-0" />
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1">
                  {item.publisher} · {relativeTime(item.publishedAt)}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
