# NFLGM career-mode audit

## 2026-10-24 all-team and 20-year report disposition

Source: user-provided summary and Google Doc `1iYdGecoscnjIBEDW4OwnUXHt-NOEvScFraNe5KZ3Fzc` (title: *RunTheRoster Career Playtest – All 32 Teams + Jets 20-Year (2026-10-24)*, created 2026-10-24 23:21:52 UTC). The report has no tested commit, seed, or run timestamps. Findings were reproduced against production baseline `2f969d5fb68ba2cb36ab59d5edc5910d48eb9176`; report explanations were treated as hypotheses rather than proof.

| Finding | Disposition |
| --- | --- |
| “Listen to calls” immediately trades the player | Confirmed. The contract decision directly removed the player and created a pick. It now creates a visible offer; the roster cannot advance until the GM explicitly accepts or keeps the player. |
| Acquired picks disappear; trade-down estimates and the final pick are wrong | Confirmed in bounded cases. Acquired rounds 1–3 remain in the interactive order, acquired rounds 4–7 now become sourced staff auto-picks, and consumed/stale entries are pruned. Trade-down copy and execution use the same exact target overall pick. No trade-down is offered without a later pick in that round; a legacy impossible offer closes without moving a pick. |
| Rounds 4–7 are automatically selected | Current intentional design, not changed into seven interactive rounds. The existing draft and camp logs identify every user auto-pick; acquired late-round picks now appear there too. |
| A used restructure button remains actionable | Confirmed presentation defect; the engine already rejected a second restructure. The button now disables as “Already restructured” and resets next season. |
| Suggested cuts drop fresh re-signings or leave bad positional depth | Partly confirmed. Existing minimums already protected QB/WR/line/secondary depth and one kicker. Fresh same-year deals now receive a meaningful selection preference without becoming uncuttable. |
| Listening, extension, contract, injury, and hot-seat actions lack state clarity | Fixed bounded gaps. Listening requires acceptance, a same-year signing is excluded from the Week 13 extension prompt, free-agent cards show projected term, roster injuries show a modeled return week when known, and owner confidence at 35 or below shows a prominent warning. |
| Super Bowl runner-up is described as already eliminated | Confirmed. Runner-up headlines now name the Super Bowl loss; non-participants retain the “season already ended” distinction. The recap also exposes the already-recorded playoff results without inventing missing games. |
| Draft position ignores the previous record | Confirmed. Later career base order used roster power. It now sorts from the prior season’s wins and point differential, with projected roster power retained only as the year-one fallback. This is still a simplified order and does not model traded original slot ownership or the full NFL tiebreak procedure. |
| Cap room grows from tens of millions to roughly $330M | Confirmed systemic scaling defect. In the 16-career baseline, average unused room rose from 9.8% of the cap in year 1 to 38.7% ($315.1M) in year 20. New renewals, outside contracts, rookie deals, and replacement deals now scale with the current cap; existing signed contracts are not retroactively repriced. Among the 13 careers that reached year 20 post-fix, average unused room was 3.3% ($26.8M). |
| A user dynasty becomes effectively permanent | Confirmed systemic balance defect. A seasonal strategy modifier accumulated across years, and unsigned outside free agents vanished instead of joining rivals. The modifier now resets at rollover and remaining quality free agents sign with cap-compatible CPU teams. Across the same seeded audit, the longest title streak fell from 17 to 5 and distinct champions rose from 27 to 31. Three of 16 optimized careers now ended in firing; 13 completed year 20. Those surviving optimized user paths remained unusually strong and won 98 titles before termination, so broader CPU roster construction remains a future balance area rather than hidden parity logic. |
| Veteran decline is too weak | Partly supported. The cited age-37 rating alone is not proof, but the model used one uniform decline. Age-35+ decline is now position-aware: skill/coverage positions fall faster while quarterbacks, kickers, and linemen follow different curves. Good late-career players remain possible. |
| Owner confidence sits near 96 and one bad year is always forgiven | Partly confirmed. Optimized title contenders still earned high confidence, but the seeded two-year firing regression stopped producing any firings after the cap correction removed an unintended penalty. A loss now costs three owner points rather than two, while wins still recover one; weak-quarterback, unused-cap, blowout, and end-of-year penalties remain. The 40-seed two-year regression again includes firings without making job loss automatic, and the UI elevates the existing hot-seat warning. No migration fires an existing GM. |
| A 16–1 divisional exit can earn A+; a 9–8 champion can earn A | Current transparent rubric, not changed solely to match a preferred letter. Record, playoff finish, owner, locker room, and cap all contribute; a great regular season and a championship can each support a high grade for different reasons. |
| Specific teams win too often or results are random | The earlier 320-season varied-seed audit did not show fixed Dallas or Detroit outcomes. This long-career post-fix sample produced 31 different champions. No result was forced to match standings, and no team-specific nerf was added. |
| Real players eventually disappear | Expected over a 20-year fictional continuation, not data loss. Original players age out and generated draft classes replace them. The game already labels generated prospects/free agents and does not claim authentic future rosters. |
| Repeated owner goals, prompts, and recap prose | Existing current-main work already makes owner briefs year- and result-aware and deduplicates consecutive substantive result headlines. The report has no build identity, so verbatim repetition was not assumed to be a current regression without a reproducible trace. |

The baseline and post-fix comparison used four teams (NYJ, KC, ATL, NE), four deterministic seeds each, and up to 20 seasons per career. The strategy used the engine’s sensible best-available staff, affordable high-value free agents, roster-need drafting, and explicit decision defaults. All 16 baseline careers completed 20 years; post-fix, 13 completed and three ended in performance-based firing. No run crashed. This is a deterministic simulation audit, not a claim that every possible human strategy is balanced.

## 2026-10-24 AFC East two-season report disposition

Source: user-provided results from two Career seasons with Buffalo, Miami, New England, and the New York Jets. Audited against production baseline `04df41e8b8796e50b9ad387e3fbdc4e290396086` with deterministic cap traces and a 40-seed sample for each AFC East team (160 career starts, 320 total seasons).

| Finding | Disposition |
| --- | --- |
| Own stars can be unaffordable in the first retention wave, followed by large unused room | Confirmed accounting/sequencing defect. Expired prior-contract charges were still included in cap space until unsigned players were removed after free agency closed. The baseline Jets trace counted $76.6M of expired charges, displayed −$13.1M initially, auto-restructured $16.8M into the future, and then rejected Garrett Wilson's $21.7M ask against only $3.7M of displayed room. The corrected trace excludes expired deals until renewed: $63.5M of opening room, no forced restructure, and Wilson's unchanged $21.7M market ask fits. Unsigned expirations walking no longer create a late phantom cap jump. |
| Dallas repeatedly reaches the 2027 Super Bowl and Detroit repeatedly wins in 2028 | Not reproduced as a fixed or dominant outcome. Baseline sample: Dallas appeared in 9/160 2027 Super Bowls, Detroit won 7/160 2028 titles, and 30 different champions appeared across 320 seasons. The post-fix sample remained broad at 29 champions, with Dallas 11/160 and Detroit 8/160. Deterministic seeds intentionally replay the same result; varied seeds do not lock those teams in. |
| Regular-season record barely shapes playoff outcomes | No bracket defect found. Record determines division winners, seed, bye, and home field; current roster strength, staff effects, injuries, and seeded matchup variance determine each game. Upsets remain intentional. The playoff screen now states that model directly. |
| A 9–8 champion receives an A grade | Not treated as an arithmetic defect. The modern rubric starts at 60, adds 1.55 points per net regular-season win, adds 20 for a championship, then applies owner, locker-room, and cap adjustments. A sampled 9–8 champion remained an A rather than an A+. The recap now discloses the weighting and shows the exact regular-season and postseason contributions; the title bonus remains intentionally substantial. |
| Super Bowl losing scores cluster near 9 | Confirmed distribution concern, not a fixed-score bug. Baseline average losing score was 14.96, but 98/320 (30.6%) were 10 or fewer. Modern postseason variance was narrowed while leaving regular-season and historical-mode variance unchanged; post-fix average was 16.59 and 61/320 (19.1%) were 10 or fewer. The same post-fix sample still produced 29 champions, preserving plausible upsets. |

Regression coverage verifies that expired charges do not consume room, an expired contract cannot be cut or restructured as active, Garrett Wilson can be retained at the unchanged ask, cap room does not jump when other expirations walk, and a varied-seed playoff sample retains champion diversity without making scores at or below 10 the dominant result.

## 2026-10-24 QA report disposition

Source report: Google Doc `1C-g5TmeyPncLHqkTaWHYoxMRWgMB_5YfjQuD_2FLeZ8`, created 2026-10-24 at 14:07 UTC. The report did not identify a commit or build, so every finding was checked against production baseline `b604ac3c505cc185e2fd2930b6e17a774d72550c`. Scoped repair commit: `70015e3`.

| ID | Disposition on `70015e3` |
| --- | --- |
| 1. Play-through injury shown as Out | Fixed. Choosing to play now keeps the player active at reduced effectiveness through that game. Any deterministic aggravation is resolved and explained after the result. The limited state survives save/reload. |
| 2. Unexplained acquired draft pick | Fixed. Accepted player/pick trades, deadline deals, contract-year deals, and accepted draft-day trade-downs retain a source label through the draft log. Declining or closing an offer does not create a pick. Legacy source-less picks remain honestly labeled as earlier trades. |
| 3. Dead-money transition | Accounting was already moving pushed money into the next season rather than deleting it. Fixed the visibility gap: cap, meter, recap, and rollover log now distinguish current dead money from next-year pushed obligations and explain the clearing/rollover amounts. |
| 4. Blank GM name copy | Existing normalization already prevented `GM GM`; improved sentence grammar to use `The GM` when no personal name is supplied. Browser-tested through start and reload. |
| 5. Missed-playoff trophy recap | Fixed. The recap names the league champion and explicitly says the user's season had already ended. |
| 6. Unexplained Owner changes | No indiscriminate rebalance. Owner-meeting options now display their exact +8/+2/−6 effects, and the offseason reset records the previous and new values. Existing bounded firing and poor-season penalties remain covered by seeded tests. |
| 7. Cap Health inconsistency | Fixed the presentation and calculation. `Cap flexibility` is normalized to the cap limit and incorporates cap room, current dead money, and next-year pushed money; exact dollar context appears beside the meter. |
| 8. Draft filters/sort | Added modest position filtering and scout-grade/position sorting while retaining the focused eight-player board. |
| 9. Repeated headlines and Bears grammar | Fixed for consecutive results. Headline selection compares substantive prose with the previous week's serialized headlines before adding the new week prefix, including after save/reload; all three outlets have alternate result lines. The week remains visible for context, and Chicago Bears references use plural grammar. This is a one-week no-repeat window, not a promise that prose can never recur later in a season. |
| 10. Re-sign prompt, owner brief, copied state | Fixed dynamic remaining-player copy, grammatical/year-aware owner briefs, and result-specific copy status that clears after timeout, content change, or reload. |
| 11. Daily grammar and visible internal code | Fixed the fictional archetype article/capitalization and removed `RTR1`/`NFLGM1` codes from the normal text, native share, and image. Manual room import remains available through an explicit `Copy result code` control. No mass Daily rewrite was made. |
| 12. Elite free-agent affordability | Reproduced but uncommon. A focused 200-seed year-two Giants probe found Lamar Jackson and Fred Warner together and initially affordable in 3 seeds; seed 145 reproduced the reported $59.0M + $24.2M asks. The older 50-seed test only established that Lamar, Warner, and Derrick Henry were never all available together, so it did not rule out the reported pair. No global economics rebalance was made from a 3/200 result; pair frequency and year-two cap room remain an explicit tuning consideration. |
| 13. Stats and upcoming contracts | Already delivered and discoverable through the `Stats` link on Career, Desk, Daily, and footer navigation; no duplicate implementation. |
| Playable playoff weeks | Deferred as the report's major feature idea and explicitly outside this maintenance scope. |

Verification for this batch and its scoped follow-up: 68/68 Vitest tests, ESLint, `tsc --noEmit`, static production export using Next's webpack builder with offline Google-font mocks, and isolated headless-Chrome checks at desktop and 400×742 mobile-equivalent viewport. Browser checks covered a blank-name Career start and reload, limited injury save/reload and game resolution, consecutive headline deduplication after reload, Daily normal-share privacy, explicit code export, copy-state reset, and Stats discoverability. No existing browser save was used.

Date: 2026-10-22  
Branch: `fix/training-camp-persistence`  
Production baseline: `main` at `24787a4`  
Local camp-selection fix: `a9106af` (not pushed or deployed)

## Repair verification (local branch only)

The audited defects are repaired on this branch; production remains unchanged. The repair includes:

Core repair commit: `833dba8` (`Fix audited career mode defects`). A follow-up commit adds backward-compatible recovery for legacy saves already paused at a deadlocked training camp.

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
