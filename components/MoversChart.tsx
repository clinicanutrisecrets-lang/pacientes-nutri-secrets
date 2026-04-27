"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { formatPercent, formatChange, formatPrice } from "@/lib/format";
import type { Quote } from "@/lib/quotes";

type Props = {
  quotes: Array<Quote | { symbol: string; error: string }>;
};

export function MoversChart({ quotes }: Props) {
  const rows = quotes
    .filter((q): q is Quote => !("error" in q))
    .map((q) => ({
      symbol: q.symbol,
      currency: q.currency,
      changePercent: q.changePercent,
      change: q.change,
      price: q.price,
    }))
    .sort((a, b) => b.changePercent - a.changePercent);

  if (rows.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-sm text-neutral-400">
        No data available.
      </div>
    );
  }

  const max = Math.max(...rows.map((r) => Math.abs(r.changePercent)), 0.01);

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <ul className="flex flex-col">
        {rows.map((r, idx) => {
          const positive = r.changePercent >= 0;
          const widthPct = (Math.abs(r.changePercent) / max) * 50;
          const color = positive ? "#4ade80" : "#f87171";
          const colorClass = positive ? "text-green-400" : "text-red-400";
          return (
            <li
              key={r.symbol}
              className={`flex items-center gap-3 py-2.5 ${
                idx > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="font-mono text-sm w-16 sm:w-20 shrink-0">
                {r.symbol}
              </div>

              <div className="hidden sm:block relative flex-1 h-2.5">
                <div className="absolute inset-y-0 left-1/2 w-px bg-neutral-700" />
                <div
                  className="absolute inset-y-0 rounded-sm"
                  style={{
                    backgroundColor: color,
                    width: `${widthPct}%`,
                    left: positive ? "50%" : `${50 - widthPct}%`,
                  }}
                />
              </div>

              <div className="flex items-center gap-1 ml-auto sm:ml-0 shrink-0">
                {positive ? (
                  <ArrowUp size={14} className={colorClass} />
                ) : (
                  <ArrowDown size={14} className={colorClass} />
                )}
                <span className={`font-mono text-base font-semibold w-20 text-right ${colorClass}`}>
                  {formatPercent(r.changePercent)}
                </span>
              </div>

              <div className={`font-mono text-xs hidden md:block w-20 text-right ${colorClass}`}>
                {formatChange(r.change)}
              </div>

              <div className="font-mono text-xs hidden lg:block w-24 text-right text-neutral-400">
                {formatPrice(r.price, r.currency)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
