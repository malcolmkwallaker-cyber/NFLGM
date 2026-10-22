# NFLGM career-mode audit

Date: 2026-10-22  
Branch: `fix/training-camp-persistence`  
Production baseline: `main` at `24787a4`  
Local camp-selection fix: `a9106af` (not pushed or deployed)

## Repair verification (local branch only)

The audited defects are repaired on this branch; production remains unchanged. The repair includes:

- drafted players now join the roster of the team that owns the pick;
- accepted trades move the outgoing player to the offering team exactly once;
- every active modern team receives a replacement quarterback when needed and is restored to a 22-player minimum before camp, including the user team;
- accepting a job rolls the existing league into the next year instead of recreating the 2027 baseline;
- each player can be restructured only once per season;
- free-agent waves page through a stable offseason pool;
- used and stale acquired-pick entries are removed;
- phase-changing UI actions take a synchronous 450 ms lock, preventing a second mobile tap from activating a newly rendered control; training-camp checkbox editing remains responsive.

Post-repair stress command:

```sh
AUDIT_CAREERS=200 AUDIT_SEASONS=20 AUDIT_CONTINUATIONS=0 \
  ./node_modules/.bin/vite-node --config vitest.config.ts scripts/audit-careers.ts
```

Results: all 200 careers completed all 20 seasons without audit-only roster injection (4,000/4,000 seasons, 199,207 actions). All 372,000 CPU draft selections appeared exactly once on the selecting team's roster. The invariant scanner reported zero findings. Direct probes also confirmed a 2036 firing advances to 2037 on a new team, a second same-season restructure is rejected, the traded player has exactly one destination owner, wave-two free agents match the stable expected window, and a roster cut to ten recovers to 22 players with two quarterbacks before a valid camp submission.

Targeted regression results: 21/21 tests pass across two files. ESLint and `tsc --noEmit` pass without warnings or errors.

Emergency roster recovery runs after the draft, at season rollover, and while loading an older save already paused at training camp. If an active modern roster has no quarterback, it first adds a replacement quarterback; it then fills to 22 players using the normal position cycle. User replacements are 60 OVR, CPU replacements are 66 OVR, and every replacement is age 24 on a one-year, $0.9M contract with potential two points above overall. Those charges are ordinary roster payroll and therefore count in cap calculations; they are not hidden audit fillers. Locked historical teams represented only by aggregate ratings are left unchanged.

Existing version-1 saves remain compatible. The two new serialized collections (`restructuredIds` and `faPool`) are optional and default to empty during load. An older save already stuck at camp is normalized to a valid minimum roster and gets recalculated suggested cuts without overwriting the original stored object until the profile is next saved. A pre-update restructure cannot be inferred from legacy data, so a mid-cap legacy save can use one additional restructure after upgrade; subsequent attempts are blocked. A mid-free-agency legacy save remains loadable and establishes its stable pool the next time the board advances, but cannot reconstruct the exact original market snapshot that was never stored.

At a 400×742 responsive Chrome emulation viewport on the isolated local origin, rapid double taps produced exactly one season start, owner decision, staff hire, restructure, free-agency wave change, trade acceptance, draft-trade response, draft selection, weekly decision, played week, and season finish. Ordinary single taps still work. A deliberate later restructure showed the new rejection message. Staff, cap, camp-cut, and week-two state survived reload/navigation interruptions; an unaffordable signing did not mutate the phase; the console reported no application errors. This is browser emulation, not physical-device coverage.

Production-build verification remains blocked by the execution environment. The default Turbopack build still fails when its CSS worker attempts to bind an internal local port, including after an elevated retry. Installing the official `@tailwindcss/postcss` dependency needed for a styled webpack fallback was denied by the environment's dependency-download approval gate. The earlier webpack output remains explicitly non-deploy-ready because it omits generated Tailwind utilities.

The remainder of this document records the original audit evidence that led to these repairs.

## Scope and method

The audit exercised the engine directly with deterministic seeds and JSON save/reload checks. It also used an isolated Chrome Incognito origin for browser checks, so no existing user saves were changed.

Primary stress run:

```sh
AUDIT_CAREERS=200 AUDIT_SEASONS=20 AUDIT_CONTINUATIONS=200 \
  AUDIT_SERIALIZE_CAREERS=2 \
  npx vite-node --config vitest.config.ts scripts/audit-careers.ts
```

Coverage from that run:

- 200 strict careers, targeting 20 seasons each.
- 3,280 naturally completed seasons; 93 careers completed all 20 seasons.
- 107 careers stopped at training camp because the user roster had no quarterback.
- 146,386 engine actions.
- Every naturally reachable phase was exercised: intro, staff, cap, free agency, trade, draft, camp, regular season, playoffs, and recap. The fired state is covered by a serialization regression test and a direct future-year job-change probe.
- 4,000 additional continuation seasons completed after the audit harness inserted a minimum roster and quarterback only when required. These fillers are audit-only and do not conceal the strict-run failure count.
- 314,991 CPU draft selections were recorded; zero selected players appeared on CPU rosters.

A corrected deep-invariant continuation sample also ran 20 careers for 20 seasons (400 seasons). It found 3,420 observations of expired entries retained in `extraPicks` and no duplicate player IDs, ownership collisions, non-finite player values, negative cap charges, cap arithmetic mismatches, invalid current draft owners/overall numbers, retirement-filter violations, or post-camp user/CPU minimum-roster violations.

## Findings

### P0 — CPU draft selections disappear

Impact: CPU teams do not actually receive any of their drafted players. Long-term league development is replaced by generic 66-overall camp fillers, so roster strength and player progression are not credible.

Evidence: all 314,991 CPU selections observed across 3,387 draft classes were absent from CPU rosters. `assignPick` records the prospect on the pick but constructs and inserts a `Player` only inside `if (!cpu)` (`lib/engine/season.ts:800-818`). `rolloverSeason` later fills CPU teams to 22 with generic players (`lib/engine/season.ts:1694-1707`).

Reproduction: run the primary stress command and compare `coverage.cpuDraftPicks` with `coverage.cpuDraftPlayersAdded`.

Proposed fix: construct the drafted player for both paths and append it to `state.teams[pick.teamId].roster`; add a regression test that every completed CPU pick creates exactly one player on the selecting team.

### P0 — careers can become impossible at training camp

Impact: a valid long-running career can reach camp with no quarterback. The UI cannot create or sign one during camp, while camp validation requires one, permanently blocking progression.

Evidence: 107 of 200 strict 20-season careers stopped this way. Seed 81 reaches 2036 after nine completed seasons with 27 players, zero QBs, and one suggested cut, then throws `The camp roster has to land between 22 and 26, with a quarterback`. A separate first-year invalid-action probe also showed that unrestricted cap cuts can reduce the roster to 10; after free agency and the draft, camp had only 21 players and the same validation error. There is no camp action that can add the missing player.

Minimal reproduction:

```sh
AUDIT_SEED_START=81 AUDIT_CAREERS=1 AUDIT_SEASONS=10 \
  AUDIT_CONTINUATIONS=0 AUDIT_SERIALIZE_CAREERS=1 AUDIT_EXAMPLES=20 \
  npx vite-node --config vitest.config.ts scripts/audit-careers.ts
```

Affected logic: cap cuts have no roster floor (`lib/engine/season.ts:413-450`); `suggestedCuts` protects a QB only when one exists, and `doCamp` hard-requires 22–26 players plus a QB (`lib/engine/season.ts:909-936`). CPU rosters receive rollover fillers, but the user roster does not (`lib/engine/season.ts:1694-1707`).

Proposed fix: guarantee a replacement-level QB before camp or expose a camp emergency-signing action. Add the seed-81 sequence as a regression and assert that every camp state has at least one achievable valid submission.

### P1 — taking a new job resets the league calendar

Impact: after a firing in a future season, accepting another job starts a new 2027 league instead of preserving the career year and league state.

Evidence: a direct 2036 fired-state probe returns a new season with year 2027. `takeJob` calls `createSeason` instead of rolling the existing league forward (`lib/engine/career.ts:89-108`).

Proposed fix: retain the current league/team state, advance the year, then change the controlled team and job-specific meters. Add a test that a job accepted after year N starts in N+1 and preserves all other teams.

### P1 — the same contract can be restructured repeatedly

Impact: the cap screen allows one player to be restructured without limit in the same phase, creating an unrealistic cap escape and large future dead money.

Evidence: restructuring the same 45.5M contract ten times reduced its current charge to 1.3M and accumulated 44.2M future dead money. `doCap` applies the 30% reduction on every request and records no per-player guard (`lib/engine/season.ts:413-437`).

Proposed fix: track restructured player IDs for the season and reject subsequent attempts. Keep the existing arithmetic but add single-use and double-click regressions.

### P1 — accepted trades delete the outgoing player from the league

Impact: the user receives the offered player or pick, but the player sent away is not added to the receiving CPU team. This silently reduces the league player pool and breaks team ownership/history.

Evidence: a deterministic accepted-trade probe moved incoming player `00-0036898` to the user but found outgoing player `00-0039894` on zero teams. `applyOffer` removes the outgoing player, removes the incoming player from the CPU team, and adds the incoming player to the user, but never inserts the outgoing player on the CPU roster (`lib/engine/season.ts:624-639`).

Proposed fix: insert `sent` into `state.teams[offer.fromTeamId].roster`, preserving appropriate origin metadata. Extend the trade regression to assert exactly one owner for both players after acceptance.

### P1 — signing from free-agency wave one skips a candidate in wave two

Impact: after a signing, the remaining pool shrinks, but the next page still uses a fixed offset. One unsigned candidate per signing can be skipped and never shown.

Evidence: a deterministic probe signed wave-one player `00-0036900`. The original expected wave-two window began with `00-0037740`, but the actual wave began with the next player and never presented `00-0037740`. `buildBoard` rebuilds the now-smaller pool and slices it with `(wave - 1) * 4` (`lib/engine/season.ts:488-505`).

Proposed fix: persist a stable free-agent pool/order for the offseason, or page by unseen IDs rather than a mutable index. Add tests for zero through four signings before advancing the wave.

### P1 — rapid mobile taps can execute a different newly rendered action

Impact: a double tap can perform two decisions instead of one. Because the first tap immediately rerenders the page, the second tap may land on a different control occupying the same screen position, making irreversible roster and staffing choices without a deliberate selection.

Evidence from an isolated 400×742 Chrome mobile-emulation run:

- Double-tapping the owner decision both accepted the brief and hired the head coach that rendered under the second tap.
- Double-tapping one restructure applied the restructure twice, reducing Patrick Mahomes's charge from 45.5M to 22.3M.
- Double-tapping the first trade acceptance accepted two different offers; the second offer's headline replaced the first.
- Double-tapping the round-one prospect drafted both the round-one and round-two players.
- Double-tapping a weekly decision submitted the decision and then activated the newly positioned “Ask the wire” control. In local development this produced a gracefully handled narrative-endpoint 404 and the fallback message.

The season-creation double tap itself created only one season, and ordinary single taps worked throughout. This was browser emulation, not a physical touchscreen test.

Proposed fix: lock all actionable controls synchronously after the first activation, keep the submitted control in place until navigation settles, and add end-to-end double-tap tests across phase-changing actions. Destructive roster and draft choices should require an action-specific idempotency key or reducer guard, not only UI disabling.

### P2 — expired extra-pick records accumulate

Impact: old acquired picks stay in every subsequent save. They are ignored by current-year draft filtering, so no duplicate selections were observed, but career saves and state grow unnecessarily and stale data complicates future ownership logic.

Evidence: 3,420 stale-pick observations in a corrected 400-season continuation sample; the first example retained a 2028 second-round pick in the 2029 intro state. `makeDraftOrder` filters by year but neither consumes nor prunes `extraPicks` (`lib/engine/season.ts:725-745`, rollover at `lib/engine/season.ts:1645-1715`).

Proposed fix: remove current-year picks after building the order and prune any prior-year entries on rollover.

## Progression and regression behavior

Player development is implemented for both the human and CPU rosters at season rollover:

- Every rostered player ages one year, loses one contract year, and has injury status cleared.
- At age 25 or younger, a player below potential gains exactly +1 overall.
- At age 33 or older, a player loses exactly -2 overall, down to a 60 floor.
- At ages 30–32, a deterministic seeded roll has a 45% chance to subtract 1 overall, down to a 62 floor.
- Players are then removed when contract years are below zero, age is 39+, or overall is below 60.

This is in `lib/engine/season.ts:1645-1709`. Position, performance, playing time, coaching/staff development ratings, team results, and injuries do not affect development. There is no breakout or decline variance for players aged 26–29. Historical locked-rating teams with empty rosters adjust only their aggregate offense/defense ratings. Because CPU draft picks currently disappear, the formula technically covers CPU players but not their drafted prospects.

The local training-camp persistence fix does not alter development.

## Save, input, and browser results

- Added regression coverage for JSON round-trip/resume across all phases, including fired-state serialization.
- Repeated intro and camp submissions are rejected without mutating the accepted state.
- An accepted trade removes the outgoing player from the user roster and processes the incoming player and pick compensation exactly once; resubmitting the same offer is rejected. A separate audit probe confirms the outgoing player is not added to the CPU destination team.
- The local camp-selection fix persists checked cuts after a reload. This was verified in an isolated browser origin.
- The Turbopack development build rendered correctly at a 400×742 responsive viewport. A complete single season ran through setup, owner/staff decisions, cap, free agency, two accepted trades, all three draft rounds, camp, one played week, simulation, playoffs, and recap. A daily challenge also completed through its result card.
- Refresh persistence passed at the owner meeting, after editing the camp cut list, during week two with the week-one result intact, and on the completed daily result. Navigating from the active season to Daily and back to Desk also preserved the season phase and state.
- Camp cut controls were touch-accessible. An invalid 27-player selection disabled “Open the season”; restoring the saved cut enabled it. An unaffordable free-agent signing displayed “Not enough cap room” without mutating the phase.
- No application exception was observed. The only console error was the expected local-development 404 after the rapid-tap issue accidentally invoked the optional narrative rewrite endpoint; the UI handled it with its rule-based fallback message.
- The webpack fallback static export completed, but its CSS contains empty Tailwind theme/utility layers because this repository configures `@tailwindcss/turbopack` and no webpack/PostCSS Tailwind plugin. It is therefore a compilation fallback, not a deploy-ready visual artifact.

Before the repair pass, the 14 passing tests covered existing engine behavior plus JSON round-trips, repeated intro/camp rejection, and one-time processing of the tested trade action. The current 21-test suite adds regressions for CPU draft ownership, destination-side trade ownership, roster/QB recovery, legacy camp-save migration, one-time restructures, stable free-agent pagination, acquired-pick lifecycle, and future-year job continuity.

Mobile coverage used Chrome's 400×742 responsive emulation in an isolated local origin, not a physical phone. It now includes a full season, a daily challenge, refresh interruptions, navigation away/back, invalid input, and repeated taps across phase-changing controls. Hardware-specific touch behavior, mobile Safari, Android Chrome, orientation changes, screen-reader gestures, and poor-network recovery remain unverified.

## Verification commands

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run build -- --webpack
```

Original audit results (superseded by the repair-verification section above where applicable):

- Tests: 14/14 passed across two files.
- Lint: passed.
- TypeScript: passed.
- Default Turbopack production build: blocked in this execution environment because its CSS worker could not bind an internal port (`Operation not permitted`), including on the single approved retry. This is an environment limitation; it does not establish a source build failure.
- Webpack fallback: passed and generated all 13 static pages, with the styling limitation described above.

## Remaining uncertainty

- Only 93 strict careers naturally reached 20 seasons because the zero-QB defect stopped the other 107. The 4,000 continuation seasons required audit-only fillers, so they demonstrate downstream invariants but not an unmodified end-to-end success rate.
- The audit did not purchase or bypass Career Pro. Career engine coverage was direct and local.
- The audit did not change production, push the branch, or fix unrelated findings.
