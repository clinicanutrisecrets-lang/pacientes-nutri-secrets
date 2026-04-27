import { NextResponse } from "next/server";
import { getQuote } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }
  try {
    const quote = await getQuote(symbol);
    return NextResponse.json(quote);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error", symbol },
      { status: 502 },
    );
  }
}
