"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { WATCHLIST } from "@/config/watchlist";
import type { Quote } from "@/lib/quotes";
import { StockCard } from "./StockCard";
import { MoversChart } from "./MoversChart";
import { formatTime } from "@/lib/format";

type QuotesResponse = {
  quotes: Array<Quote | { symbol: string; error: string }>;
  fetchedAt: number;
};

export function WatchlistDashboard() {
  const [quotes, setQuotes] = useState<Array<Quote | { symbol: string; error: string }>>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const symbols = WATCHLIST.map((w) => w.symbol).join(",");
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as QuotesResponse;
      setQuotes(json.quotes);
      setUpdatedAt(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quotes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const id = setInterval(fetchQuotes, 60_000);
    return () => clearInterval(id);
  }, [fetchQuotes]);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-amber-400" size={26} />
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
            Watchlist
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">
            {updatedAt
              ? `Updated ${formatTime(updatedAt)}`
              : loading
                ? "Loading…"
                : "—"}
          </span>
          <button
            type="button"
            onClick={fetchQuotes}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 border border-border hover:border-neutral-500 rounded px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh quotes"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-card border border-red-900 text-red-400 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {WATCHLIST.map((entry) => {
          const match = quotes.find((q) => q.symbol === entry.symbol);
          const quote = match && !("error" in match) ? match : null;
          const err = match && "error" in match ? match.error : undefined;
          return (
            <StockCard
              key={entry.symbol}
              entry={entry}
              quote={quote}
              error={err}
            />
          );
        })}
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Today&apos;s Movers</h2>
        <MoversChart quotes={quotes} />
      </div>
    </section>
  );
}
