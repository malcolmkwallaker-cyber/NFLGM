# NFL GM Career

A playable first version of an NFL general manager sim. Football fans get one shared front-office decision every day, and they can take a team from the owner meeting through the Super Bowl. A Pro preview unlocks a multi-season career, historical teams, advanced lines, and private leagues.

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

The save lives in `localStorage` under `nfl-gm-career-v1`. There is no account server. The header switch labeled **Pro preview** flips the paywall without a card. The upgrade page is a mock checkout: any 16 digits are accepted, then discarded. Nothing is charged.

## How a day works

**Daily GM Challenge** (free) is the same puzzle for everyone. The index is the number of UTC days since 2026-03-11, modulo the challenge list. You pick one option, get a green / yellow / orange / red grade, then see what the real front office did. Grades are hindsight: they score how the move turned out. The percentile and rank are a modeled field from each option's popularity, not a live player count. The share card includes an `NFLGM1` line a league can paste back in.

**Single season** (free) is one team, one year: owner meeting, four hires, cap, three waves of free agency, trades, a three-round draft, camp cuts, then a week-by-week season with injuries, a deadline, and locker-room calls. Owner confidence at 10 or below fires you. The schedule is a generated circle slate, so every team plays once a week. It is not the real NFL schedule.

**Pro** adds:

- Career mode. After the recap, the next year ages players, expires deals, and raises the cap 5%. A firing offers three weaker teams. Retire and the game writes a GM Wikipedia page plus a Hall of Fame line.
- Six historical starts: 1985 Bears, 1993 Cowboys, 1999 Rams, 2007 Patriots, 2013 Seahawks, 1989 49ers. Pre-cap years use a payroll guide. Cap years use that season's cap number. Opponent ratings are locked. Your roster uses real names.
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

Opponents without a roster use `off` and `def` ratings and do not sign free agents. Your roster players should use real names. Keep the camp roster between 22 and 26 players, including a quarterback, or the player has to cut down to that range. A ripple (a decision that returns later) can be added in `seedEraRipples` inside `lib/engine/season.ts`.

## Rosters

Modern teams come from `lib/data/rosters.json`, built from an nflverse roster CSV:

```bash
node scripts/build-rosters.mjs path/to/roster.csv
```

The checked-in file is a 2026 roster snapshot (through the week the file was published), mapped onto a projected 2027 cap of $322M. Cap hits are estimates scaled so the league is tight. Overalls are game ratings, with a short list of star overrides. Los Angeles Rams are `LAR` (nflverse uses `LA`).

## Narrative hook

Headlines are written by rules in `lib/engine/headlines.ts`. The owner-meeting note is read for keywords (`win`, `youth`, `stars`, `fiscal`, `culture`) in `lib/engine/keywords.ts`.

The desk button "Ask the wire for a rewrite" calls `POST /api/narrative` and keeps the rule-based headlines when that call fails. The static site has no server, so the call fails and the rules stay. `lib/narrative/provider.ts` is the place to point a later host at a model. The game never waits on it.

## Accounts and payments, later

The profile in `lib/storage.ts` is the whole account: name, Pro flag, daily results, one season, one career, leagues. A real login can store that same JSON on a user id. Pro should become a Stripe subscription (the $6 price is the intended one) instead of the mock form on `/upgrade` or the preview switch. League boards should move off paste-a-card and onto that same account.

## What is done, and what is stubbed

Done:

- 33 daily challenges, grades, modeled percentile and rank, streak, emoji share card
- A full single season from the owner meeting through the playoffs, the Super Bowl, or a firing
- Stakeholder meters, three fictional outlets, consequences that return as later decisions
- Career rollover, job offers after a firing, legacy score, Hall of Fame line, Wikipedia page
- Six historical teams
- Pro gate with a mock upgrade and a testing switch
- Deterministic sim covered by `npm test`

Stubbed or simplified:

- Daily rank is a modeled crowd, not live players
- Schedule is generated, not the real slate
- Cap numbers are estimates, not contract filings
- Draft prospects and most free-agent logic outside your roster are fictional
- Historical seasons are one year on a shortened era field, not a full 32-team historical league
- CPU teams do not rebuild their rosters in free agency
- Leagues do not sync
- Headlines stay rule-based. The static export does not include an API route
- No real auth, no Stripe, no server save
- "Unlimited careers" means you can keep playing year to year and start again after you retire. This build stores one career and one season on the device

## Roadmap

1. Accounts, then Stripe, so Pro is a subscription and the save follows the person.
2. A daily service that records real answers and returns a real rank.
3. League rooms on that service, for the daily card and a shared team.
4. Plug a model into `/api/narrative` for headlines and free-text calls, with the rules as the fallback.
5. Richer contracts from public cap data, and a schedule closer to the real one.
6. More historical packs, and a career that can start inside an era instead of only playing that one season.
