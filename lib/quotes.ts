import { withCache } from "./cache";

const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

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

type YahooMeta = {
  symbol: string;
  currency?: string;
  exchangeName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketTime?: number;
};

type YahooChartResult = {
  chart: {
    result: Array<{
      meta: YahooMeta;
      timestamp?: number[];
      indicators?: {
        quote?: Array<{ close?: Array<number | null> }>;
      };
    }> | null;
    error: { code: string; description: string } | null;
  };
};

async function yahooChart(
  symbol: string,
  interval: string,
  range: string,
): Promise<YahooChartResult> {
  const url = `${YAHOO_BASE}/${encodeURIComponent(
    symbol,
  )}?interval=${interval}&range=${range}&includePrePost=false`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Yahoo HTTP ${res.status} for ${symbol}`);
  }
  return (await res.json()) as YahooChartResult;
}

function parseQuote(json: YahooChartResult): Quote {
  const result = json.chart.result?.[0];
  if (!result) {
    throw new Error(json.chart.error?.description ?? "Yahoo: empty result");
  }
  const meta = result.meta;
  const price = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose ?? meta.previousClose;
  if (price == null || previousClose == null) {
    throw new Error("Yahoo: missing price fields");
  }
  const change = price - previousClose;
  const changePercent = (change / previousClose) * 100;

  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const sparkline: SparklinePoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i];
    if (typeof c === "number" && Number.isFinite(c)) {
      sparkline.push({ t: timestamps[i], c });
    }
  }

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
    marketTime: meta.regularMarketTime ?? null,
    sparkline,
    source: "yahoo",
  };
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

export async function getQuote(symbol: string): Promise<Quote> {
  return withCache(`quote:${symbol}`, 30, async () => {
    try {
      const json = await yahooChart(symbol, "5m", "1d");
      return parseQuote(json);
    } catch (err) {
      if (process.env.ALPHA_VANTAGE_KEY) {
        return alphaVantageQuote(symbol);
      }
      throw err;
    }
  });
}

export async function getQuotes(symbols: string[]): Promise<Array<Quote | { symbol: string; error: string }>> {
  const results = await Promise.all(
    symbols.map(async (s) => {
      try {
        return await getQuote(s);
      } catch (err) {
        return { symbol: s, error: err instanceof Error ? err.message : "Unknown error" };
      }
    }),
  );
  return results;
}

export async function getHistorical(
  symbol: string,
  interval: string,
  range: string,
): Promise<Historical> {
  return withCache(`hist:${symbol}:${interval}:${range}`, 60, async () => {
    const json = await yahooChart(symbol, interval, range);
    const result = json.chart.result?.[0];
    if (!result) {
      throw new Error(json.chart.error?.description ?? "Yahoo: empty result");
    }
    const timestamps = result.timestamp ?? [];
    const closes = result.indicators?.quote?.[0]?.close ?? [];
    const points: HistoricalPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const c = closes[i];
      if (typeof c === "number" && Number.isFinite(c)) {
        points.push({ t: timestamps[i], close: c });
      }
    }
    return {
      symbol: result.meta.symbol,
      currency: result.meta.currency ?? "USD",
      points,
    };
  });
}
