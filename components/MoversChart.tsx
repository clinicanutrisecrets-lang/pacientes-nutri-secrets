"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import type { Quote } from "@/lib/quotes";

type Props = {
  quotes: Array<Quote | { symbol: string; error: string }>;
};

export function MoversChart({ quotes }: Props) {
  const data = quotes
    .filter((q): q is Quote => !("error" in q))
    .map((q) => ({
      symbol: q.symbol,
      changePercent: Number(q.changePercent.toFixed(2)),
    }))
    .sort((a, b) => b.changePercent - a.changePercent);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-sm text-neutral-400">
        No data available.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => Math.abs(d.changePercent)), 1);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
          >
            <XAxis
              type="number"
              domain={[-max, max]}
              tickFormatter={(v) => `${v}%`}
              stroke="#525252"
              tick={{ fill: "#a3a3a3", fontSize: 11, fontFamily: "var(--font-jetbrains)" }}
            />
            <YAxis
              type="category"
              dataKey="symbol"
              stroke="#525252"
              width={70}
              tick={{ fill: "#e5e5e5", fontSize: 12, fontFamily: "var(--font-jetbrains)" }}
            />
            <Tooltip
              cursor={{ fill: "#262626" }}
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #262626",
                borderRadius: 6,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 12,
              }}
              labelStyle={{ color: "#fafafa" }}
              formatter={(value) => [`${value}%`, "Change"]}
            />
            <Bar dataKey="changePercent" radius={[0, 3, 3, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.symbol}
                  fill={d.changePercent >= 0 ? "#4ade80" : "#f87171"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
