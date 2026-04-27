import { NextResponse } from "next/server";
import { getHistorical } from "@/lib/quotes";
import { WATCHLIST } from "@/config/watchlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Period = "eod" | "wtd" | "mtd";

const PERIOD_PARAMS: Record<Period, { interval: string; range: string; label: string }> = {
  eod: { interval: "1d", range: "5d", label: "End of Day" },
  wtd: { interval: "1d", range: "5d", label: "Week to Date" },
  mtd: { interval: "1d", range: "1mo", label: "Month to Date" },
};

export type ReportRow = {
  symbol: string;
  name: string;
  currency: string;
  price: number | null;
  baselinePrice: number | null;
  changePercent: number | null;
  error?: string;
};

export type ReportResponse = {
  period: Period;
  label: string;
  rows: ReportRow[];
  best: ReportRow | null;
  worst: ReportRow | null;
  averagePercent: number | null;
  fetchedAt: number;
};

function pickBaselineIndex(period: Period, count: number, timestamps: number[]): number {
  if (period === "eod") {
    return Math.max(0, count - 2);
  }
  if (period === "wtd") {
    const lastTs = timestamps[count - 1];
    if (!lastTs) return 0;
    const last = new Date(lastTs * 1000);
    const day = last.getUTCDay();
    const daysSinceMonday = (day + 6) % 7;
    const mondayMidnight = Date.UTC(
      last.getUTCFullYear(),
      last.getUTCMonth(),
      last.getUTCDate() - daysSinceMonday,
    ) / 1000;
    for (let i = 0; i < count; i++) {
      if (timestamps[i] >= mondayMidnight) {
        return Math.max(0, i - 1);
      }
    }
    return 0;
  }
  return 0;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") ?? "eod") as Period;
  const params = PERIOD_PARAMS[period];
  if (!params) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const rows = await Promise.all(
    WATCHLIST.map(async (entry): Promise<ReportRow> => {
      try {
        const hist = await getHistorical(entry.symbol, params.interval, params.range);
        if (hist.points.length < 2) {
          return {
            symbol: entry.symbol,
            name: entry.name,
            currency: hist.currency,
            price: hist.points.at(-1)?.close ?? null,
            baselinePrice: null,
            changePercent: null,
            error: "Not enough data",
          };
        }
        const timestamps = hist.points.map((p) => p.t);
        const baselineIdx = pickBaselineIndex(period, hist.points.length, timestamps);
        const baseline = hist.points[baselineIdx].close;
        const last = hist.points[hist.points.length - 1].close;
        const pct = ((last - baseline) / baseline) * 100;
        return {
          symbol: entry.symbol,
          name: entry.name,
          currency: hist.currency,
          price: last,
          baselinePrice: baseline,
          changePercent: pct,
        };
      } catch (err) {
        return {
          symbol: entry.symbol,
          name: entry.name,
          currency: "USD",
          price: null,
          baselinePrice: null,
          changePercent: null,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }),
  );

  const valid = rows.filter((r) => r.changePercent != null);
  const best = valid.reduce<ReportRow | null>(
    (acc, r) => (acc == null || (r.changePercent ?? -Infinity) > (acc.changePercent ?? -Infinity) ? r : acc),
    null,
  );
  const worst = valid.reduce<ReportRow | null>(
    (acc, r) => (acc == null || (r.changePercent ?? Infinity) < (acc.changePercent ?? Infinity) ? r : acc),
    null,
  );
  const averagePercent =
    valid.length > 0
      ? valid.reduce((acc, r) => acc + (r.changePercent ?? 0), 0) / valid.length
      : null;

  const body: ReportResponse = {
    period,
    label: params.label,
    rows,
    best,
    worst,
    averagePercent,
    fetchedAt: Math.floor(Date.now() / 1000),
  };
  return NextResponse.json(body);
}
