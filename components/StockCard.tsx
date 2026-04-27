"use client";

import { Sparkline } from "./Sparkline";
import { formatPrice, formatChange, formatPercent } from "@/lib/format";
import type { Quote } from "@/lib/quotes";
import type { WatchlistEntry } from "@/config/watchlist";

type Props = {
  entry: WatchlistEntry;
  quote: Quote | null;
  error?: string;
};

export function StockCard({ entry, quote, error }: Props) {
  const positive = (quote?.change ?? 0) >= 0;
  const colorClass = positive ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-sm tracking-wide">
              {entry.symbol}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 border border-border rounded px-1.5 py-0.5">
              {entry.exchange}
            </span>
          </div>
          <div className="text-sm text-neutral-300 mt-1 truncate">{entry.name}</div>
        </div>
        {quote && (
          <div className="text-right shrink-0">
            <div className="font-mono text-lg">
              {formatPrice(quote.price, quote.currency)}
            </div>
            <div className={`font-mono text-xs ${colorClass}`}>
              {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
            </div>
          </div>
        )}
      </div>

      {quote ? (
        <Sparkline data={quote.sparkline} positive={positive} />
      ) : (
        <div className="h-12 flex items-center text-xs text-neutral-500">
          {error ? `Error: ${error}` : "Loading…"}
        </div>
      )}

      {quote && (quote.dayLow != null || quote.dayHigh != null) && (
        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span>
            L:{" "}
            {quote.dayLow != null
              ? formatPrice(quote.dayLow, quote.currency)
              : "—"}
          </span>
          <span>
            H:{" "}
            {quote.dayHigh != null
              ? formatPrice(quote.dayHigh, quote.currency)
              : "—"}
          </span>
        </div>
      )}

      <p className="text-xs text-neutral-400 leading-relaxed">{entry.description}</p>
    </div>
  );
}
