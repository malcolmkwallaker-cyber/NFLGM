import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Game Features",
  description: "Explore free Career, Historical Seasons, advanced stats, and on-device score rooms in Run The Roster.",
  alternates: { canonical: "/upgrade/" },
};

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header>
        <h1 className="font-display text-5xl leading-none tracking-wide">Game features</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Career mode, historical teams, advanced stat lines, and on-device score rooms are free to play in the current build.
          No payment details are requested, stored, or charged.
        </p>
      </header>
      <ul className="space-y-2 text-sm">
        {[
          "Multi-season career with aging, expiring deals, and a new draft each year",
          "Hired, fired, and hired again, with a transparent in-game legacy score",
          "A generated career retrospective when you retire",
          "1985 Bears, 1993 Cowboys, 1999 Rams, 2007 Patriots, 2013 Seahawks, 1989 49ers",
          "On-device score rooms created by pasting result cards",
        ].map((item) => (
          <li key={item} className="rounded-lg border border-white/10 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm">
        <Button nativeButton={false} render={<Link href="/career" />}>Start a career</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/daily" />}>Play today&apos;s challenge</Button>
      </div>
    </div>
  );
}
