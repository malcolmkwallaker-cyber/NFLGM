"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Public playtest</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">The whole file is open.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Career mode, historical teams, advanced stat lines, and private leagues are free while public testing is active.
          No payment details are requested, stored, or charged.
        </p>
      </header>
      <ul className="space-y-2 text-sm">
        {[
          "Multi-season career with aging, expiring deals, and a new draft each year",
          "Hired, fired, and hired again, with a transparent in-game legacy score",
          "A generated career retrospective when you retire",
          "1985 Bears, 1993 Cowboys, 1999 Rams, 2007 Patriots, 2013 Seahawks, 1989 49ers",
          "Private leagues by pasting share cards",
        ].map((item) => (
          <li key={item} className="rounded-lg border border-white/10 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm">
        <p className="w-full">Free testing access is already active for this browser.</p>
        <Button nativeButton={false} render={<Link href="/career" />}>Start a career</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/daily" />}>Play today&apos;s challenge</Button>
      </div>
    </div>
  );
}
