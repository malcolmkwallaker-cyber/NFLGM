import { capHealth } from "@/lib/engine/cap";
import type { SeasonState } from "@/lib/types";

function Bar({ label, value, hint }: { label: string; value: number; hint?: string }) {
  const tone = value >= 70 ? "bg-emerald-400" : value >= 40 ? "bg-primary" : "bg-red-400";
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="font-display text-sm tracking-wide text-foreground">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Meters({ season }: { season: SeasonState }) {
  const health = capHealth(season);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Bar label="Owner" value={season.meters.owner} hint="At 10, you are fired" />
      <Bar label="Fans" value={season.meters.fans} />
      <Bar label="Locker" value={season.meters.locker} />
      <Bar label="Cap health" value={health} hint={season.capMode === "payroll" ? "Payroll guide" : "Hard cap"} />
    </div>
  );
}
