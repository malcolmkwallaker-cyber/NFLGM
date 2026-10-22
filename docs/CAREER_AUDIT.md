# NFLGM career-mode audit

Date: 2026-10-22  
Branch: `fix/training-camp-persistence`  
Production baseline: `main` at `24787a4`  
Local camp-selection fix: `a9106af` (not pushed or deployed)

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
- An accepted trade moves the outgoing player, incoming player, and pick compensation exactly once; resubmitting the same offer is rejected.
- The local camp-selection fix persists checked cuts after a reload. This was verified in an isolated browser origin.
- The Turbopack development build rendered correctly at a 400×742 responsive viewport. Season setup, team buttons, primary actions, and the fixed bottom navigation were reachable. No application runtime errors or browser issues were shown; the console contained only React/Next development messages.
- The webpack fallback static export completed, but its CSS contains empty Tailwind theme/utility layers because this repository configures `@tailwindcss/turbopack` and no webpack/PostCSS Tailwind plugin. It is therefore a compilation fallback, not a deploy-ready visual artifact.

## Verification commands

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run build -- --webpack
```

Results:

- Tests: 14/14 passed across two files.
- Lint: passed.
- TypeScript: passed.
- Default Turbopack production build: blocked in this execution environment because its CSS worker could not bind an internal port (`Operation not permitted`), including on the single approved retry. This is an environment limitation; it does not establish a source build failure.
- Webpack fallback: passed and generated all 13 static pages, with the styling limitation described above.

## Remaining uncertainty

- Only 93 strict careers naturally reached 20 seasons because the zero-QB defect stopped the other 107. The 4,000 continuation seasons required audit-only fillers, so they demonstrate downstream invariants but not an unmodified end-to-end success rate.
- The audit did not purchase or bypass Career Pro. Career engine coverage was direct and local.
- The audit did not change production, push the branch, or fix unrelated findings.
