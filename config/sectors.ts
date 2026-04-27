export type SectorEntry = {
  label: string;
  symbol: string;
  proxy: string;
};

export const SECTORS: SectorEntry[] = [
  { label: "Semiconductors", symbol: "SMH", proxy: "VanEck Semiconductor ETF" },
  { label: "Uranium / Nuclear", symbol: "URA", proxy: "Global X Uranium ETF" },
  { label: "Large-Cap Tech", symbol: "QQQM", proxy: "Invesco NASDAQ 100 ETF" },
  { label: "Clean Energy", symbol: "ICLN", proxy: "iShares Global Clean Energy ETF" },
  { label: "Consumer Defensive", symbol: "XLP", proxy: "Consumer Staples Select Sector SPDR" },
  { label: "Oil & Gas", symbol: "XLE", proxy: "Energy Select Sector SPDR" },
];
