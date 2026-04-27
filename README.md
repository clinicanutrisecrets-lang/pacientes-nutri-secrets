# Stock Watchlist Dashboard

Single-page Next.js dashboard that displays live market data for a small
personal watchlist. Stateless: no auth, no database, no user accounts.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts, lucide-react
- Fraunces (display) + JetBrains Mono (data) via Google Fonts
- Yahoo Finance unofficial chart endpoint (server-side proxy with cache)
- Optional Alpha Vantage fallback when `ALPHA_VANTAGE_KEY` is set

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Configuration

Edit watchlist, sectors, and small-cap picks without touching code:

- `config/watchlist.ts` — tickers shown in the grid + movers chart + reports
- `config/sectors.ts` — six sector ETFs
- `config/smallcaps.ts` — three curated small-cap picks

## Deployment

Push to GitHub, import the repo in Vercel. No env vars required for the
default Yahoo flow; set `ALPHA_VANTAGE_KEY` if you want the fallback.
