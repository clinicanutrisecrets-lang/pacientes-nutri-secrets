"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

type Props = {
  data: Array<{ t: number; c: number }>;
  positive: boolean;
};

export function Sparkline({ data, positive }: Props) {
  if (data.length < 2) {
    return <div className="h-12 text-xs text-neutral-500">No intraday data</div>;
  }
  const stroke = positive ? "#4ade80" : "#f87171";
  const minC = Math.min(...data.map((d) => d.c));
  const maxC = Math.max(...data.map((d) => d.c));
  const pad = (maxC - minC) * 0.05 || 0.01;
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <YAxis hide domain={[minC - pad, maxC + pad]} />
          <Line
            type="monotone"
            dataKey="c"
            stroke={stroke}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
