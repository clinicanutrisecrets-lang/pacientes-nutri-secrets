import { Sparkles } from "lucide-react";
import { SMALL_CAPS, type RiskLevel } from "@/config/smallcaps";

const RISK_STYLES: Record<RiskLevel, string> = {
  Low: "bg-green-950 text-green-400 border-green-900",
  Medium: "bg-amber-950 text-amber-400 border-amber-900",
  High: "bg-red-950 text-red-400 border-red-900",
};

export function SmallCapsPanel() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-amber-400" size={20} />
        <h2 className="font-display text-2xl">Promising Small Caps</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SMALL_CAPS.map((pick) => (
          <div
            key={pick.symbol}
            className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold">{pick.symbol}</span>
              <span
                className={`text-[10px] uppercase tracking-wider border rounded px-1.5 py-0.5 ${RISK_STYLES[pick.risk]}`}
              >
                {pick.risk} risk
              </span>
            </div>
            <div className="text-sm text-neutral-200">{pick.name}</div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500">
              {pick.sector}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mt-1">
              {pick.thesis}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
