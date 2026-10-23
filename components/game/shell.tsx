"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/daily", label: "Daily" },
  { href: "/turnaround", label: "Turnaround" },
  { href: "/play", label: "Desk" },
  { href: "/season", label: "Season" },
  { href: "/career", label: "Career" },
  { href: "/historical", label: "History" },
  { href: "/leaderboard", label: "Scores" },
  { href: "/leagues", label: "Leagues" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1018]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Run The Roster home">
            <Image
              src="/brand/run-the-roster-football-logo-header.png"
              alt=""
              width={360}
              height={240}
              className="h-10 w-auto shrink-0 object-contain sm:h-12"
              priority
              unoptimized
            />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-none tracking-wide text-primary sm:text-xl">RUN THE ROSTER</span>
              <span className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Front office, one decision at a time</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  path === link.href && "bg-white/10 text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="ml-auto text-[10px] uppercase tracking-[0.16em] text-primary md:ml-2">Free playtest</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:max-w-5xl md:pb-12">{children}</main>
      <footer className="mx-auto w-full max-w-5xl space-y-3 px-4 pb-24 text-xs leading-relaxed text-muted-foreground md:pb-8">
        <p className="flex flex-wrap gap-3">
          <Link href="/stats" className="hover:text-foreground">Stats</Link>
          <Link href="/leaderboard" className="hover:text-foreground">Personal leaderboard</Link>
          <Link href="/settings" className="hover:text-foreground">Settings</Link>
          <Link href="/upgrade" className="hover:text-foreground">Playtest access</Link>
        </p>
        <p>
          Run The Roster is an unofficial fan game. It is not affiliated with, endorsed by, or connected to the National
          Football League or any of its teams. Team marks are abbreviations and colors, not logos.
        </p>
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/10 bg-[#0b1018]/95 backdrop-blur md:hidden">
        {[
          { href: "/daily", label: "Daily" },
          { href: "/play", label: "Desk" },
          { href: "/season", label: "Season" },
          { href: "/career", label: "Career" },
          { href: "/historical", label: "History" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-1 py-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground",
              path === link.href && "text-primary",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
