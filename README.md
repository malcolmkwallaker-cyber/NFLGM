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

## In-house analytics

The game can record cookieless, first-party statistics. Collection defaults off on both the browser and server. Both switches below must be explicitly enabled after approval. Nothing in this first-party collector sets a cookie or calls a third party. A failed request cannot interrupt play. Google Analytics 4 is separate: the site loads it only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set at build time, and then sends a page view on the first page and on each client-side navigation. Leave that variable unset and the tag is omitted.

The browser keeps a random id in `sessionStorage` for the open tab. It can also keep a random seed in `localStorage` and send only a hash of that seed plus the UTC date. The seed never leaves the device. Yesterday’s hash and the hash from seven days earlier are sent with it so the dashboard can compute D1 and D7 return. These are pseudonymous identifiers: the linked hashes can connect visits across days. Do Not Track and Global Privacy Control skip measurement entirely.

Events are `pageview` (path, referrer hostname, and `utm_source` / `utm_medium` / `utm_campaign` / `utm_content`), `game_start` (`Career`, `Season`, `Daily`, `Historical`, or `Turnaround`), `first_action` (once per tab session), `season_complete`, `draft_complete`, `trade_made`, `share_card_click`, and `session_end` with duration. Use `utm_campaign=creator_outreach` and a slug in `utm_content` for each creator, for example `https://runtheroster.com/?utm_source=youtube&utm_medium=creator&utm_campaign=creator_outreach&utm_content=coach-maya`.

Netlify already hosts the static export. This branch adds:

- `POST /api/collect/` as a Netlify Function. The browser ignores failures.
- A Netlify Database table, `analytics_events`, created by `netlify/database/migrations/20261102020000_create_analytics_events/migration.sql`. The deploy applies it. Rows older than 90 days are deleted by a daily scheduled function. A second migration creates `analytics_daily_counts`; a single atomic SQL statement reserves a daily slot and inserts the event, capped at 20,000 per UTC day.
- `GET /analytics/`, an operator page protected with HTTP Basic auth. The password is the token below. The username can be anything. The page does not set a cookie.

`@netlify/database` is a dependency, so the next Netlify deploy of this branch provisions a database. Preview deploys get an isolated database branch initially copied from production. Do not assume a preview starts empty. Production is unchanged until this is merged and the production deploy succeeds. A failed deploy does not replace the current live site.

### Cost

Netlify Database is included on credit-based plans, including the $0 Free plan (300 credits per month, with a hard stop). It is not available on a legacy plan from before September 4, 2025 until that account moves to a credit-based plan. No separate database vendor account is required.

Published rates: database compute is 10 credits per GB-hour while the database is awake, and bandwidth out of the database is 20 credits per GB. On the Free plan the database sleeps after 5 idle minutes, and the plan caps a database at 48 compute units, 5 GB stored, 5 GB written, and 5 GB of bandwidth per billing period. Storage itself was free through July 1, 2026; check Netlify’s current Database billing page before enabling this, because storage rates may now apply. These rows are pseudonymous events, not saves or uploads.

There is no verified cost estimate for this site. At the documented minimum of one compute unit, 30 awake database hours consume 300 credits, before requests, bandwidth, functions and production deploys. A 30-day always-awake database would consume about 7,200 compute credits; the Free plan would hit its limits before that. An always-awake database can consume credits continuously, and exhausting the Free plan’s credits can pause billable Netlify features. Watch the credit meter for a few days after turning collection on. To stop writes, set `ANALYTICS_COLLECTION=off` in the function environment and redeploy as Netlify requires; also set `NEXT_PUBLIC_ANALYTICS=off` and rebuild to stop browser requests. Disabling collection does not remove the database or stop scheduled retention and authenticated dashboard reads from using credits. The row cap limits stored events, not requests or billing. Verify plan, usage, spend limits and any storage charges in the Netlify account before merging. Changing a legacy plan to credit-based is irreversible; obtain separate approval. No account or billing setting was changed during this review.

Official references checked November 2, 2026: [Database billing](https://docs.netlify.com/build/data-and-storage/netlify-database/billing-and-usage/), [credit plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [migrations](https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/). The storage wording still references July 2026 and is not a confirmed current storage quote.

### What to set in Netlify

Set these in the Netlify UI. Do not commit them.

| Variable | Where it is read | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_ANALYTICS` | Game bundle, at build time | Set to `on` to make the browser send events. Any other value, including unset, keeps the game silent. Changing it requires a new deploy. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Game bundle, at build time | GA4 measurement ID (`G-…`). Unset, blank, or any other value skips the tag. Set it in the Netlify UI under Site configuration → Environment variables, then redeploy so the static build inlines it. |
| `ANALYTICS_COLLECTION` | Collector function, runtime | Must equal `on` before any request body is read or database connection is opened. Unset or `off` rejects collection silently. Keep production off pending approval. |
| `ANALYTICS_DASHBOARD_TOKEN` | Dashboard function, at runtime | Password for `/analytics/`. Use at least 12 characters, for example the output of `openssl rand -base64 24`. |

`netlify.toml` pins the existing static build: `npm run build` publishes `out/`. `public/_redirects` sends `/api/collect/` and `/analytics/` to the functions. There is no catch-all rewrite; exported routes and real 404s are preserved.

After approval, test an isolated preview with both `NEXT_PUBLIC_ANALYTICS=on` and `ANALYTICS_COLLECTION=on`. After that deploy, open the preview URL at `/analytics/`, sign in with the token as the password, and visit the game in a browser that is not sending Do Not Track. That visit should appear as a visitor and a session. `npm test` covers the collector, daily hash, dashboard, tracker, function authentication boundaries, and a PGlite Postgres integration test applying both migrations, round-tripping events, enforcing the cap, and deleting expired rows. PGlite does not verify Netlify provisioning, CDN routing, deployed secrets or billing. `netlify dev` plus `netlify database migrations apply` exercises the function against a local database when you want to try the page before production.

## Roadmap

1. An operator-approved account and privacy design before any optional cloud save or shared score service.
2. A server-verified Daily service before displaying any global rank.
3. League rooms on that service, for the daily card and a shared team.
4. Keep rule-based headlines unless a future server-backed narrative feature is explicitly approved and configured.
5. Richer contracts from public cap data, and a schedule closer to the real one.
6. More historical packs, and a career that can start inside an era instead of only playing that one season.
