import Link from "next/link";
import { TodayDaily } from "@/components/game/today-daily";
import { Button } from "@/components/ui/button";

export default function DailyPage() {
  return (
    <div className="space-y-6">
      <TodayDaily />
      <section className="rounded-xl border border-primary/30 bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Daily historic turnaround</p>
          <h2 className="mt-1 font-display text-3xl tracking-wide">Rewrite History</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Run today’s sourced season setup with the same deterministic seed as every other player.
          </p>
        </div>
        <Button className="mt-4 !h-11 sm:mt-0" nativeButton={false} render={<Link href="/turnaround" />}>
          Play today’s turnaround
        </Button>
      </section>
    </div>
  );
}
