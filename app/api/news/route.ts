import { NextResponse } from "next/server";
import { getNewsForSymbols } from "@/lib/news";
import { WATCHLIST } from "@/config/watchlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getNewsForSymbols(WATCHLIST.map((w) => w.symbol));
    return NextResponse.json({ items, fetchedAt: Math.floor(Date.now() / 1000) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 },
    );
  }
}
