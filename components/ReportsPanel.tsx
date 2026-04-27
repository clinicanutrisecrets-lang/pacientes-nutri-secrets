"use client";

import { useState } from "react";
import { BarChart2 } from "lucide-react";
import { formatPercent, formatPrice } from "@/lib/format";

type Period = "eod" | "wtd" | "mtd";

const PERIODS: Array<{ key: Period; label: string }> = [
  { key: "eod", label: "End of Day" },
  { key: "wtd", label: "Week to Date" },
  { key: "mtd", label: "Month to Date" },
];

type ReportRow = {
  symbol: string;
  name: string;
  currency: string;
  price: number | null;
  baselinePrice: number | null;
  changePercent: number | null;
  error?: string;
};

type ReportResponse = {
  period: Period;
  label: string;
  rows: ReportRow[];
  best: ReportRow | null;
  worst: ReportRow | null;
  averagePercent: number | null;
};

export function ReportsPanel() {
  const [active, setActive] = useState<Period | null>(null);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (period: Period) => {
    if (active === period) {
      setActive(null);
      setData(null);
      return;
    }
    setActive(period);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/report?period=${period}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ReportResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <BarChart2 className="text-amber-400" size={20} />
        <h2 className="font-display text-2xl">Performance Reports</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PERIODS.map((p) => {
          const isActive = active === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => load(p.key)}
              className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded border transition-colors ${
                isActive
                  ? "bg-amber-400 text-neutral-900 border-amber-400"
                  : "text-amber-400 border-border hover:border-neutral-500"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="bg-card border border-border rounded-lg p-4">
          {loading && <div className="text-sm text-neutral-400">Loading {active.toUpperCase()} report…</div>}
          {error && !loading && <div className="text-sm text-red-400">{error}</div>}
          {!loading && !error && data && <ReportTable data={data} />}
        </div>
      )}
    </section>
  );
}

function ReportTable({ data }: { data: ReportResponse }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <SummaryCard label="Best" row={data.best} />
        <SummaryCard label="Worst" row={data.worst} />
        <SummaryCard
          label="Average (equal-weighted)"
          value={data.averagePercent}
        />
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="text-[11px] uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="text-left py-2 px-3">Ticker</th>
              <th className="text-left py-2 px-3 hidden sm:table-cell">Name</th>
              <th className="text-right py-2 px-3 font-mono">Price</th>
              <th className="text-right py-2 px-3 font-mono">{data.label}</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => {
              const positive = (row.changePercent ?? 0) >= 0;
              const colorClass = positive ? "text-green-400" : "text-red-400";
              return (
                <tr key={row.symbol} className="border-t border-border">
                  <td className="py-2 px-3 font-mono">{row.symbol}</td>
                  <td className="py-2 px-3 text-neutral-300 hidden sm:table-cell">
                    {row.name}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {row.price != null ? formatPrice(row.price, row.currency) : "—"}
                  </td>
                  <td className={`py-2 px-3 text-right font-mono ${colorClass}`}>
                    {row.changePercent != null
                      ? formatPercent(row.changePercent)
                      : row.error ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  row,
  value,
}: {
  label: string;
  row?: ReportRow | null;
  value?: number | null;
}) {
  const pct = row?.changePercent ?? value ?? null;
  const positive = (pct ?? 0) >= 0;
  const colorClass = positive ? "text-green-400" : "text-red-400";
  return (
    <div className="bg-neutral-900 border border-border rounded p-3">
      <div className="text-[11px] uppercase tracking-wider text-neutral-400">{label}</div>
      <div className={`font-mono text-xl mt-1 ${colorClass}`}>
        {pct != null ? formatPercent(pct) : "—"}
      </div>
      {row && (
        <div className="text-xs text-neutral-300 mt-1">
          <span className="font-mono">{row.symbol}</span> · {row.name}
        </div>
      )}
    </div>
  );
}
