# Run The Roster

A browser-based football general manager simulation. The Daily bank combines sourced historical decisions with clearly labeled original fictional scenarios. Public testing includes Single Season, multi-season Career, historical-inspired seasons, and on-device score rooms for free.

This is an unofficial fan game. It is not affiliated with, endorsed by, or connected to the National Football League or any team. The site uses abbreviations and colors, not logos.

The simulation does not need an API key. Results come from rules and a seeded random number generator.

## Run it

```bash
npm install
npm test
npm run dev
```

The dev server listens on [http://127.0.0.1:43117](http://127.0.0.1:43117).

`npm run build` writes a static site to `out/`. No Node server is required to play it. Any static host can serve that folder. `public/_redirects` is copied into `out/` so a host such as Netlify rewrites unknown paths to `index.html`.

The save lives in `localStorage` under `nfl-gm-career-v1`. There is no account server or cloud sync. Single Season and Career use separate slots; `profile.active` only selects which saved desk `/play` opens. Their landing pages reactivate the requested slot, and accessible confirmation dialogs protect a slot before replacement. `lib/access.ts` explicitly enables free-testing mode while retaining the legacy entitlement field only for save compatibility. No payment details are requested or charged.

The personal leaderboard at `/leaderboard` is derived from that same on-device save. It is explicitly not global and uploads nothing. A dormant, versioned contract for a future verified shared leaderboard lives in `lib/leaderboard.ts`. The deterministic Daily Historic Turnaround at `/turnaround` rotates sourced season facts, but uses current generic simulation rosters and modern 17-game rules rather than claiming an authentic historical replay. See `docs/LEADERBOARD_AND_HISTORIC_DAILY.md`.

## How a day works

**Daily GM Challenge** (free) is the same puzzle for everyone. The 101-item bank contains 33 sourced historical decisions and 68 explicitly fictional scenarios. You pick one option and get a green / yellow / orange / red process grade. No global rank is shown because results are not uploaded. Share cards use an `RTR1` machine line; the parser still accepts legacy `NFLGM1` cards.

**Single season** (free) is one team, one year: owner meeting, four hires, cap, three waves of free agency, trades, a three-round draft plus visible staff picks in rounds 4–7, camp cuts, then a week-by-week season with injuries, a deadline, and locker-room calls. Owner confidence at 20 or below fires you. The schedule is a generated circle slate, so every team plays once a week. It is not the real NFL schedule.

**Public playtest access** adds:

- Career mode. After the recap, the next year ages players, expires deals, and raises the cap 5%. A firing offers three weaker teams. Retirement writes a generated career retrospective and legacy status.
- Six historical-inspired starts: 1985 Bears, 1993 Cowboys, 1999 Rams, 2007 Patriots, 2013 Seahawks, 1989 49ers. Featured rosters contain selected real player names and simplified ratings; opponents, staff, contracts, free agents, and draft classes are incomplete or synthetic.
- Advanced stat lines (Pythagorean wins, cap sheet, top contracts).
- Private leagues stored on this device. Friends paste a share card. There is no server sync.

Free keeps one in-progress season on the device. Starting another replaces it.

## Add a daily challenge

Edit `lib/data/daily-challenges.ts`. **Append** the new object. Inserting or reordering in the middle changes which puzzle falls on which date.

Each challenge needs:

- `id`, `category` (`Trade`, `Draft`, `Contract`, `Roster`, or `Coach`), `year`, `team`, `teamName`
- `title`, `situation`, `question`, `whatHappened`, `actualOptionId`
- exactly four `options`, exactly one with `grade: "green"`
- each option: `id`, `label`, `detail`, `grade` (`green` | `yellow` | `orange` | `red`), `score`, `popularity`, `why`, `echo`
- popularities that sum to about 1

`npm test` checks the list.

## Add a historical team

Add a pack to `HISTORICAL` in `lib/data/historical.ts`.

- `id`, `year`, `title`, `summary`, `teamId`, `weeks` (16 or 17)
- `capMode`: `"hard"` or `"payroll"`
- `capLimit` and `deadMoney` in millions
- `legends`: real coaches you want on the hire board (`role` must be `hc`, `oc`, `dc`, or `scout`)
- `teams`: one entry with a real `roster` for the club you run, plus era opponents

Opponents without a roster use `off` and `def` ratings and do not sign free agents. Featured roster names must be sourced; unsupported names or contract claims should not be added. Keep the camp roster between 22 and 26 players, including a quarterback. A ripple (a decision that returns later) can be added in `seedEraRipples` inside `lib/engine/season.ts`.

## Rosters

Modern teams come from `lib/data/rosters.json`, built from an nflverse roster CSV:

```bash
node scripts/build-rosters.mjs path/to/roster.csv
```

The checked-in file is a 2026 roster snapshot (through the week the file was published), mapped onto a projected 2027 cap of $322M. Cap hits are estimates scaled so the league is tight. Overalls are game ratings, with a short list of star overrides. Los Angeles Rams are `LAR` (nflverse uses `LA`).

## Narrative hook

Headlines are written by rules in `lib/engine/headlines.ts`. The owner-meeting note is read for keywords (`win`, `youth`, `stars`, `fiscal`, `culture`) in `lib/engine/keywords.ts`.

Headlines are generated locally from game rules. The dormant provider module is not exposed in the static UI and no request is made to `/api/narrative`.

## Accounts and payments, later

The profile in `lib/storage.ts` contains the on-device name, compatibility flags, Daily results, one season, one career, and local rooms. There is no login, server save, checkout, or automatic upload. The legacy `pro` field remains only so older saves continue to load.

## What is done, and what is stubbed

Done:

- 101 Daily challenges, streak freezes, honest on-device results, and text/PNG share cards
- A full single season from the owner meeting through the playoffs, the Super Bowl, or a firing
- Stakeholder meters, three fictional outlets, consequences that return as later decisions
- Career rollover, job offers after a firing, legacy score, and generated career retrospective
- Six historical teams
- Explicit free-testing access control with legacy entitlement data preserved only for save compatibility
- Deterministic sim covered by `npm test`

Stubbed or simplified:

- No global Daily rank or shared leaderboard is claimed
- Schedule is generated, not the real slate
- Cap numbers are estimates, not contract filings
- Draft prospects and most free-agent logic outside your roster are fictional
- Historical seasons are one year on a shortened era field, not a full 32-team historical league
- CPU teams do not rebuild their rosters in free agency
- Leagues do not sync
- Headlines stay rule-based. The static export does not include an API route
- No login, cloud sync, billing, or server save
- "Unlimited careers" means you can keep playing year to year and start again after you retire. This build stores one career and one season on the device

## Roadmap

1. An operator-approved account and privacy design before any optional cloud save or shared score service.
2. A server-verified Daily service before displaying any global rank.
3. League rooms on that service, for the daily card and a shared team.
4. Keep rule-based headlines unless a future server-backed narrative feature is explicitly approved and configured.
5. Richer contracts from public cap data, and a schedule closer to the real one.
6. More historical packs, and a career that can start inside an era instead of only playing that one season.
