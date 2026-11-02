import Image from "next/image";
import Link from "next/link";

const MODES = [
  {
    href: "/daily",
    kicker: "Daily Challenge",
    title: "Make one call",
    body: "Choose a front-office response, receive an instant grade, and read why another path may have worked.",
  },
  {
    href: "/season",
    kicker: "Single Season",
    title: "Run the whole year",
    body: "Hire a staff, manage contracts, trade, draft, set the roster, and play through the postseason.",
  },
  {
    href: "/career",
    kicker: "Career GM",
    title: "Keep the chair",
    body: "Carry contracts and results into future seasons, survive owner expectations, change jobs, and build a legacy.",
  },
] as const;

export function HomeStaticIntro() {
  return (
    <section className="yard-lines overflow-hidden rounded-2xl border border-white/10 bg-card">
      <div className="border-b border-primary/30 bg-primary/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary">
        Football front-office simulation
      </div>
      <div className="space-y-5 px-5 py-6">
        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <h1 className="max-w-xl font-display text-5xl leading-[0.9] tracking-wide sm:text-6xl">
              Call the shot. Live with it in January.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Run The Roster is a free browser football management game. Start with one Daily decision, take a team through a full season, or build a multi-year GM career.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[19rem] rounded-2xl border border-white/10 bg-black/20 p-2 shadow-[0_0_42px_rgba(160,255,0,0.08)] sm:max-w-[22rem] lg:max-w-none">
            <Image
              src="/brand/run-the-roster-football-logo.png"
              alt="Run The Roster football logo"
              width={960}
              height={640}
              className="h-auto w-full object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {MODES.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className="flex min-h-48 flex-col rounded-xl border border-primary/40 bg-black/20 p-4 transition-transform hover:-translate-y-0.5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary">{mode.kicker} · Free</span>
              <span className="mt-2 block font-display text-3xl tracking-wide">{mode.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{mode.body}</span>
              <span className="mt-auto block pt-5 text-sm font-medium text-primary">Open mode →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeGuide() {
  return (
    <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6" aria-labelledby="front-office-guide">
      <p className="text-[11px] uppercase tracking-[0.18em] text-primary">How to play</p>
      <h2 id="front-office-guide" className="mt-1 font-display text-4xl tracking-wide">Read the football and the fine print</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Every mode is built around the same job: improve the roster without losing control of the cap, the locker room, or the owner&apos;s confidence.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-2xl tracking-wide">Choose the size of the job</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Daily is one decision. Single Season is one complete year. Career carries results, contracts, aging, drafts, firings, and job changes forward. The game auto-saves one Season and one Career in this browser; there is no cloud save.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-2xl tracking-wide">Build before opening day</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Set the owner&apos;s direction, hire a staff, decide which expiring players to retain, work the outside market, handle trade calls, draft prospects, and make final camp cuts.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-2xl tracking-wide">Know where the cap went</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Cap room is the limit minus active committed contracts and current dead money. Restructuring creates room now by pushing money into a future season. Cutting a player can add dead money even after the contract leaves the roster.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-2xl tracking-wide">Value and approval are different</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Trade cards label the football value you receive as Good, Fair, or Poor. The owner, fans, and locker room can still react differently because the season brief may favor youth, stars, winning now, culture, or cap flexibility.
          </p>
        </article>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Rosters and historical context use sourced material where noted. Ratings, contracts, schedules, draft classes, free-agent markets, and simulated results are modeled game data.
      </p>
    </section>
  );
}
