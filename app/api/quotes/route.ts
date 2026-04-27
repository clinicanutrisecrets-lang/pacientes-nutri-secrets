import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("symbols");
  if (!raw) {
    return NextResponse.json({ error: "Missing symbols" }, { status: 400 });
  }
  const symbols = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json({ error: "No symbols provided" }, { status: 400 });
  }
  const quotes = await getQuotes(symbols);
  return NextResponse.json({ quotes, fetchedAt: Math.floor(Date.now() / 1000) });
}
