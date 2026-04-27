import yahooFinance from "yahoo-finance2";
import { withCache } from "./cache";
import { mapWithConcurrency } from "./concurrency";

type Interval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";

export type SparklinePoint = { t: number; c: number };

export type Quote = {
  symbol: string;
  currency: string;
  exchangeName: string | null;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayLow: number | null;
  dayHigh: number | null;
  marketTime: number | null;
  sparkline: SparklinePoint[];
  source: "yahoo" | "alphavantage";
};

export type HistoricalPoint = { t: number; close: number };
export type Historical = {
  symbol: string;
  currency: string;
  points: HistoricalPoint[];
};

function rangeToPeriod1(range: string): Date {
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  switch (range) {
    case "1d":
      return new Date(now - 1.5 * day);
    case "5d":
      return new Date(now - 8 * day);
    case "1mo":
      return new Date(now - 35 * day);
    case "3mo":
      return new Date(now - 95 * day);
    case "1y":
      return new Date(now - 370 * day);
    default:
      return new Date(now - 8 * day);
  }
}

function toEpoch(value: Date | number | undefined | null): number | null {
  if (value == null) return null;
  if (value instanceof Date) return Math.floor(value.getTime() / 1000);
  if (typeof value === "number") return value;
  return null;
}

type AlphaVantageGlobalQuote = {
  "Global Quote"?: {
    "01. symbol"?: string;
    "05. price"?: string;
    "08. previous close"?: string;
    "03. high"?: string;
    "04. low"?: string;
  };
};

async function alphaVantageQuote(symbol: string): Promise<Quote> {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) throw new Error("ALPHA_VANTAGE_KEY not set");
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
    symbol,
  )}&apikey=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`);
  const json = (await res.json()) as AlphaVantageGlobalQuote;
  const q = json["Global Quote"];
  const price = q?.["05. price"] ? Number(q["05. price"]) : NaN;
  const previousClose = q?.["08. previous close"]
    ? Number(q["08. previous close"])
    : NaN;
  if (!Number.isFinite(price) || !Number.isFinite(previousClose)) {
    throw new Error("Alpha Vantage: missing fields");
  }
  return {
    symbol: q?.["01. symbol"] ?? symbol,
    currency: "USD",
    exchangeName: null,
    price,
    previousClose,
    change: price - previousClose,
    changePercent: ((price - previousClose) / previousClose) * 100,
    dayLow: q?.["04. low"] ? Number(q["04. low"]) : null,
    dayHigh: q?.["03. high"] ? Number(q["03. high"]) : null,
    marketTime: Math.floor(Date.now() / 1000),
    sparkline: [],
    source: "alphavantage",
  };
}

type ChartQuote = {
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
};

type ChartMeta = {
  symbol: string;
  currency?: string;
  exchangeName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketTime?: Date | number;
};

type ChartResult = {
  meta: ChartMeta;
  quotes: ChartQuote[];
};

async function yahooChart(
  symbol: string,
  interval: Interval,
  range: string,
): Promise<ChartResult> {
  const result = await yahooFinance.chart(symbol, {
    period1: rangeToPeriod1(range),
    interval,
  });
  return result as unknown as ChartResult;
}

export async function getQuote(symbol: string): Promise<Quote> {
  return withCache(`quote:${symbol}`, 60, async () => {
    try {
      const result = await yahooChart(symbol, "5m", "1d");
      const meta = result.meta;
      const price = meta.regularMarketPrice;
      const previousClose =
        meta.chartPreviousClose ?? (meta as { previousClose?: number }).previousClose;
      if (price == null || previousClose == null) {
        throw new Error("Yahoo: missing price fields");
      }
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      const sparkline: SparklinePoint[] = (result.quotes ?? [])
        .filter((q): q is typeof q & { close: number } => typeof q.close === "number")
        .map((q) => ({
          t: Math.floor(q.date.getTime() / 1000),
          c: q.close,
        }));
      return {
        symbol: meta.symbol,
        currency: meta.currency ?? "USD",
        exchangeName: meta.exchangeName ?? null,
        price,
        previousClose,
        change,
        changePercent,
        dayLow: meta.regularMarketDayLow ?? null,
        dayHigh: meta.regularMarketDayHigh ?? null,
        marketTime: toEpoch(meta.regularMarketTime as Date | number | undefined),
        sparkline,
        source: "yahoo",
      };
    } catch (err) {
      if (process.env.ALPHA_VANTAGE_KEY) {
        return alphaVantageQuote(symbol);
      }
      throw err;
    }
  });
}

export async function getQuotes(
  symbols: string[],
): Promise<Array<Quote | { symbol: string; error: string }>> {
  return mapWithConcurrency(symbols, 2, async (s) => {
    try {
      return await getQuote(s);
    } catch (err) {
      return {
        symbol: s,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  });
}

export async function getHistorical(
  symbol: string,
  interval: string,
  range: string,
): Promise<Historical> {
  return withCache(`hist:${symbol}:${interval}:${range}`, 120, async () => {
    const result = await yahooChart(symbol, interval as Interval, range);
    const points: HistoricalPoint[] = (result.quotes ?? [])
      .filter((q): q is typeof q & { close: number } => typeof q.close === "number")
      .map((q) => ({
        t: Math.floor(q.date.getTime() / 1000),
        close: q.close,
      }));
    return {
      symbol: result.meta.symbol,
      currency: result.meta.currency ?? "USD",
      points,
    };
  });
}
