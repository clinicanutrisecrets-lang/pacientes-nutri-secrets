import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/quotes";
import { SECTORS } from "@/config/sectors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const quotes = await getQuotes(SECTORS.map((s) => s.symbol));
  const items = SECTORS.map((s) => {
    const q = quotes.find((x) => x.symbol === s.symbol || ("error" in x && x.symbol === s.symbol));
    if (!q || "error" in q) {
      return {
        label: s.label,
        symbol: s.symbol,
        proxy: s.proxy,
        changePercent: null,
        price: null,
        error: q && "error" in q ? q.error : "No data",
      };
    }
    return {
      label: s.label,
      symbol: s.symbol,
      proxy: s.proxy,
      changePercent: q.changePercent,
      price: q.price,
      currency: q.currency,
    };
  });
  return NextResponse.json({ items, fetchedAt: Math.floor(Date.now() / 1000) });
}
