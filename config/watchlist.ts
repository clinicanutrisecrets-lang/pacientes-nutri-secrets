export type WatchlistEntry = {
  symbol: string;
  name: string;
  exchange: string;
  description: string;
};

export const WATCHLIST: WatchlistEntry[] = [
  {
    symbol: "PESO.V",
    name: "PesoRama Inc.",
    exchange: "TSXV",
    description: "Mexican-peso-denominated self-storage operator expanding across Mexico City.",
  },
  {
    symbol: "HG.CN",
    name: "HydroGraph Clean Power",
    exchange: "CSE",
    description: "Producer of high-purity graphene and hydrogen via a patented detonation process.",
  },
  {
    symbol: "CCJ",
    name: "Cameco Corporation",
    exchange: "NYSE",
    description: "One of the world's largest publicly traded uranium miners and fuel-cycle services providers.",
  },
  {
    symbol: "QQQM",
    name: "Invesco NASDAQ 100 ETF",
    exchange: "NASDAQ",
    description: "Lower-cost cousin of QQQ tracking the Nasdaq-100 large-cap growth index.",
  },
  {
    symbol: "SMH",
    name: "VanEck Semiconductor ETF",
    exchange: "NASDAQ",
    description: "Concentrated exposure to the largest US-listed semiconductor manufacturers.",
  },
  {
    symbol: "DOL.TO",
    name: "Dollarama Inc.",
    exchange: "TSX",
    description: "Canada's leading value retailer with over 1,500 fixed-price discount stores.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    description: "Global e-commerce, logistics, and cloud infrastructure leader (AWS).",
  },
];
