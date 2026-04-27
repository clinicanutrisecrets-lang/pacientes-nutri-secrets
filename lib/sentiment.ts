export type Sentiment = "positive" | "negative" | "neutral";

const POSITIVE = [
  "beats",
  "beat",
  "surge",
  "surges",
  "rally",
  "rallies",
  "soar",
  "soars",
  "jump",
  "jumps",
  "gain",
  "gains",
  "growth",
  "record",
  "high",
  "upgrade",
  "upgraded",
  "buy",
  "outperform",
  "strong",
  "raises",
  "wins",
  "approval",
  "approved",
  "positive",
  "profit",
  "profits",
  "expansion",
];

const NEGATIVE = [
  "falls",
  "fall",
  "drop",
  "drops",
  "miss",
  "misses",
  "loss",
  "losses",
  "down",
  "plunge",
  "plunges",
  "warning",
  "cut",
  "cuts",
  "downgrade",
  "downgraded",
  "sell",
  "underperform",
  "weak",
  "delays",
  "lawsuit",
  "fraud",
  "probe",
  "investigation",
  "halts",
  "halted",
  "negative",
  "decline",
  "declines",
  "slump",
];

export function scoreSentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of POSITIVE) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) score++;
  }
  for (const w of NEGATIVE) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) score--;
  }
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}
