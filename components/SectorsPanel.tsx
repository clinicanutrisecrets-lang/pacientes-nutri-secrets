"use client";

import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { formatPercent } from "@/lib/format";

type SectorItem = {
  label: string;
  symbol: string;
  proxy: string;
  changePercent: number | null;
  price: number | null;
  currency?: string;
  error?: string;
};

export function SectorsPanel() {
  const [items, setItems] = useState<SectorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/sectors", { cache: "no-store" });
        const json = (await res.json()) as { items: SectorItem[] };
        if (!cancelled) setItems(json.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Layers className="text-amber-400" size={20} />
        <h2 className="font-display text-2xl">Trending Sectors</h2>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {loading && items.length === 0 && (
          <div className="col-span-full text-sm text-neutral-400">Loading…</div>
        )}
        {items.map((item) => {
          const positive = (item.changePercent ?? 0) >= 0;
          const colorClass = positive ? "text-green-400" : "text-red-400";
          return (
            <div
              key={item.symbol}
              className="bg-card border border-border rounded-lg p-4 flex flex-col gap-1"
            >
              <div className="text-xs uppercase tracking-wider text-neutral-400">
                {item.label}
              </div>
              <div className="font-mono text-sm text-neutral-300">{item.symbol}</div>
              <div className={`font-mono text-2xl ${colorClass}`}>
                {item.changePercent != null ? formatPercent(item.changePercent) : "—"}
              </div>
              <div className="text-[11px] text-neutral-500 truncate">{item.proxy}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
