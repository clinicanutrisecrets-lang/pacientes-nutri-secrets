export type RiskLevel = "Low" | "Medium" | "High";

export type SmallCapPick = {
  symbol: string;
  name: string;
  sector: string;
  risk: RiskLevel;
  thesis: string;
};

export const SMALL_CAPS: SmallCapPick[] = [
  {
    symbol: "ASPN",
    name: "Aspen Aerogels",
    sector: "Industrials / EV materials",
    risk: "High",
    thesis:
      "Sole-source thermal-barrier supplier for several EV battery platforms; revenue ramps as OEM programs scale.",
  },
  {
    symbol: "IOT",
    name: "Samsara Inc.",
    sector: "Software / IoT",
    risk: "Medium",
    thesis:
      "Connected-operations platform for trucking and field services; durable subscription growth with improving margins.",
  },
  {
    symbol: "CELH",
    name: "Celsius Holdings",
    sector: "Consumer / Beverages",
    risk: "Medium",
    thesis:
      "Energy-drink share gainer leveraging the PepsiCo distribution deal to expand internationally.",
  },
];
