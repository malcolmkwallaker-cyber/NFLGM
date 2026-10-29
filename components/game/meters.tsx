import { capHealth, capSpace } from "@/lib/engine/cap";
import { FIRING_THRESHOLD } from "@/lib/engine/season";
import { formatMoney } from "@/lib/format";
import type { SeasonState } from "@/lib/types";

function Bar({ label, value, hint }: { label: string; value: number; hint?: string }) {
  const tone = value >= 70 ? "bg-emerald-400" : value >= 40 ? "bg-primary" : "bg-red-400";
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="font-display text-sm tracking-wide text-foreground">{Math.round(value)}</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        <div className={`h-full rounded-full ${tone} motion-safe:transition-[width] motion-safe:duration-300`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Meters({ season }: { season: SeasonState }) {
  const health = capHealth(season);
  const space = capSpace(season);
  const capHint = `${formatMoney(space)} room · ${formatMoney(season.deadMoney)} current dead${season.futureDead ? ` · ${formatMoney(season.futureDead)} pushed to next year` : ""}`;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Bar label="Owner" value={season.meters.owner} hint={season.meters.owner <= 35 ? `Hot seat · job ends at ${FIRING_THRESHOLD} or lower` : `Job ends at ${FIRING_THRESHOLD} or lower`} />
      <Bar label="Fans" value={season.meters.fans} />
      <Bar label="Locker" value={season.meters.locker} />
      <Bar label="Cap flexibility" value={health} hint={season.capMode === "payroll" ? `Payroll guide · ${capHint}` : capHint} />
    </div>
  );
}
