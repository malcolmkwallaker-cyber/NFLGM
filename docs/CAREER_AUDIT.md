# NFLGM career-mode audit

## 2026-10-27 Daily #230 / Historical / Turnaround report disposition

Source: Google Doc `1ffEyTnY26eGKR97c1CxOAEO8Y-55qEAkgzSBoBJKVnI` and matching Slack report posted 2026-10-27. These are duplicate copies of one report; there were no Drive comments or Slack replies. The report identifies footer build `4cf6cba` and describes scripted Daily #230, a full 2013 Seattle Historical season, and 2011 Philadelphia Turnaround through Week 6 with seed `1936146732`. It does not include a save fixture or screenshots. Findings were reproduced against exact source `4cf6cba4e67ba035fe42d881a8a1784ec4c976fc` and treated as leads.

| Finding | Disposition |
| --- | --- |
| A deadline offer can be below fair value while a youth-priority owner gains four points | The separate calculations were intentional, but the compact action button did not state why the owner approved a weak return. The decision now repeats the owner's stated build-young reason beside the exact meter effect and uses the same Good/Fair/Poor trade-chart label shown elsewhere. The owner effect was not changed. |
| Nine incoming offers were Poor, including a first-round pick for Golden Tate | Confirmed systemic calibration defect in Historical and Turnaround modes. Aggregate-only opponent rosters often cannot include a player, while offer construction targeted only 20–35% of the outgoing player's modeled value. In 1,050 deterministic pre-fix offers, 1,022 were Poor, 25 Fair, and 3 Good. Offer construction, shopping, and grading now share one age-, position-, contract-, player-, and pick-sensitive value chart. A post-fix 420-offer sample produced 216 Poor, 178 Fair, and 26 Good offers across all 14 historical scenarios. A first-round pick for Golden Tate is Fair; the same pick for Bobby Wagner remains Poor, so a first-round label alone does not guarantee value. |
| The player-shopping control disappears after one use | Confirmed presentation gap, not a repeat-action defect. Shopping remains deliberately limited to one request per offseason, but after that request is resolved the screen now says the request was used, incoming calls remain available, and the control resets next season. Save/reload preserves the used state. |
| Weekly owner confidence fell without a visible calculation | The weekly engine already recorded result, margin, quarterback, and quarterly unused-cap components, but showed only the final value. Weekly analytics and the ledger now display the exact before-and-after confidence values followed by the existing itemized reasons. The reported Philadelphia seed is regression coverage; no meter values were rebalanced from the anecdote. |
| Daily result text briefly remained after navigation to Historical | Not reproduced as durable route state. Daily result state is page-local and the destination page unmounts it; no stale text remained after navigation settled. No speculative state reset was added for a transient frame described without a screenshot. |
| Seattle went 16–0 with a large point differential before losing the conference game | One plausible upset is not evidence of a deterministic defect. No difficulty, score, playoff, or grade rebalance was made from a single run. |
| Restore Pro | Excluded. Public free testing remains intentional and billing is outside this report's authorized scope. |

The report says prior career handoff, year-end, firing, postseason, and generated-name fixes were not retested. This pass does not claim new coverage for those observations and does not activate ads, tracking, payments, cloud saves, or a backend.

## 2026-10-26 Career / Daily #229 / quick Season report disposition

Source: Google Doc `1IEqCrNsR09XQc0IL9vyKvWPA-5AQ9WdPUXYyZHkMHj0` and matching Slack report posted 2026-10-26. These are duplicate copies of one report. The report identifies footer build `38cc802` and describes scripted DAL 2027–2029, SEA 2030, Daily #229, and a quick KC Season free-agency pass, but supplies no seed or save fixture. Screenshots mentioned by the report were not available in this coding environment. Findings were reproduced against exact source `38cc802bee1b8ace9528708a54de1b80d0eb6ae2` and treated as leads.

| Finding | Disposition |
| --- | --- |
| A fired Dallas GM taking the Seattle job sees the Dallas owner, Dallas Ledger, old cap charge, and stale owner-confidence values | Confirmed job-context defect. The job change correctly activated Seattle's cap-liability ledger but retained Dallas's owner, headlines, staff market, fan/locker meters, and rollover copy. A new job now deterministically creates a different owner and staff market, resets the new building's meters, regenerates the brief and all three headlines for the new team, and explains both the active cap ledger and that old-team liabilities stayed behind. League rosters and team-owned cap liabilities remain intact across the job change. |
| A below-fair deadline offer can still raise owner confidence by four | Arithmetic is intentional but the two judgments were conflated. Trade-chart value considers player age, position, contract, and pick value; owner reaction follows the stated team-building priority. A youth-priority owner can therefore like adding a pick even when the return is below chart value. The deadline now explicitly separates those judgments and still displays the exact owner/fan/locker effects. No automatic penalty or reward was changed. |
| Trade cards and the post-trade ledger use incompatible grade words; a shopped player has no grade before acceptance | Confirmed presentation defect. One shared vocabulary—Good, Fair, or Poor value for you—is now used by cards, shopped-player offers, and the post-trade analytics headline. Shopped offers display both grade and exact owner-confidence effect before acceptance. The misleading statement that future dead money and picks both “travel” was replaced with accurate copy: compensation goes on the current draft board while restructure dead money remains with the club that created it. |
| End-of-season owner changes are unexplained | Confirmed presentation gap. The recap now records and displays the exact confidence value before and after the year-end review, plus each applicable poor-record, unused-cap, or quarterback penalty. Playoff-round meter changes remain visible when those games are played and are not double-counted as year-end review. |
| Cap room grows sharply in years two and three | No new arithmetic defect was found. In 32 deterministic Dallas careers (96 seasons), average opening room was $28.0M, $93.6M, and $163.1M in years one through three, while room after automated retention/acquisition was $31.0M, $43.6M, and $32.0M. This supports the existing distinction between an opening sheet with expired deals excluded and the roster after spending. No broad economy rebalance was added from this unseeded report. |
| CPU superstars are released after retention | Releases occur but are not categorical. Across the same 96-season trace, 732 CPU players rated 90+ reached an expiring decision and 88 entered an outside market, about 12%; the rest were retained under the existing quality-, age-, position-, and cap-sensitive model. A zero-release rule was not added. |
| A Week 6 firing says cap remained “at season end”; all job offers use identical copy | Confirmed copy defects. Fired-state drivers now say the cap remained “when the job ended.” Job offers now identify three distinct roster situations and show a modeled roster-power baseline instead of repeating one generic sentence. |
| Caller/target repetition and generated-player name collisions | Confirmed bounded variety gaps. Caller and target history now spans four three-offer windows instead of two, while still allowing a fallback when no alternative exists. Draft classes now assign 110 unique deterministic names from the existing fictional name pool; positions and ratings remain generated simulation data. |
| “Sim to playoffs” appears during the playoffs; Super Bowl runner-up shares as `SUPERBOWL`; opening the outside market gives no advance warning about unsigned players | Confirmed UI/copy gaps. The no-op playoff button is replaced by one `Finish the postseason` action. Runner-up share cards say `RUNNER-UP`. The retention screen warns before advancing that unsigned players become available to other teams and may not return on a later board. |
| Restructure +1, cutting an elite player without an extra owner penalty, and the reported Split-the-difference meter jump | Not changed without a seed/save trace. Existing actions can combine their explicit decision effect with separate phase or weekly effects; this pass exposes exact recap/trade effects but does not impose new balance penalties from estimates. |

An updated deterministic audit completed 32 strict seasons across eight four-year careers plus four continuation seasons, all gameplay phases, 1,486 actions, and 2,976/2,976 CPU draft-player placements with no findings. This pass does not activate ads, tracking, payments, cloud saves, or a backend.

## 2026-10-25 Daily #228 / Historical / Turnaround report disposition

Source: Google Doc `1Jl6O5CMgerxLPNmqbhvPrROlnbgcW6RXUozpx-GRkvw` and matching Slack report posted 2026-10-25 at 14:12:57 UTC. The Drive document was created at 14:13:05, modified at 14:13:07, and claimed a 14:25 finish, so the coverage chronology is internally inconsistent. The report identifies footer build `dfb35ff` but supplies no screenshot or save. Findings were reproduced against exact production source `dfb35ffcb93a9fd56a93bf7071f9e7844a01c1c2` and treated as leads.

| Finding | Disposition |
| --- | --- |
| Historical 2007 New England and 2019 Cleveland Turnaround outside free-agent boards are empty | Confirmed architecture gap. Historical opponents intentionally use aggregate ratings and no player rosters, leaving no expiring opponent players from which to build a market. Wave one can still be empty when the user's roster has no expiring deals; historical modes now receive two deterministic six-player outside waves of clearly labeled fictional, modeled candidates. The exact reported Cleveland seed was replayed through both waves and save/reload. Original rosters remain unchanged and no modern real players are imported. |
| Cleveland unused cap received no visible quarterly review | Arithmetic was present but presentation was weak. In the exact reported seed with no free-agent spending, room moved from $116.9M to $110.4M and the ledger applied unused-cap penalties on losses in Weeks 4, 8, 12, and 16. The review applies only when at least 18% is unused and a loss lands in Week 4, 8, 12, 16, or the final week; wins do not receive the penalty. The regular-season screen now shows when that review is active and states the exact trigger. No broader penalty was added. |
| An unanswered Week 10 deadline decision hides Play the week while simulation remains available | Confirmed interaction gap. A desk decision intentionally replaces the week action, but the screen did not explain that gate and the simulation controls remained enabled. The decision now says it must be resolved, and play/simulation controls consistently block with that explanation until a choice is made. |
| Cleveland 2019 owner meeting says 2027 | Confirmed initialization-order bug. Turnaround creation changed the simulation year after the owner brief was generated. It now regenerates the brief for the sourced scenario year. |
| Historical starting dead money is unexplained | Confirmed provenance gap. Historical cap screens now call the starting dead-money amount a modeled gameplay value rather than verified historical accounting. The values were not silently zeroed. |
| Deadline trade value and meter effects are unclear | Confirmed presentation gap. Deadline copy now states whether the modeled return is near or below fair value and displays the exact owner, fan, and locker effects. All desk decisions now show meter before/after values in the analytics headline. |
| Eliminated-team and fired recaps are thin or awkward | Confirmed bounded copy gap. League Super Bowl copy now names the user's actual exit instead of saying only that the season was already over. Fired screens retain the final line and add the same factual record, cap, quarterback, and meter drivers used by the normal recap. |
| 15–2 Cleveland exit labeled Wild Card; high year-three cap | The round-label bug was not reproduced. In 100 varied Cleveland seeds, the sampled 15–2 first-game exits were correctly labeled Divisional; another 15–2 run reached the conference round and a 16–1 run reached the Super Bowl. The cap concern was addressed by the published `dfb35ff` balance release and is not being rebalanced again from this unseeded carryover alone. |

Already-reported working items—camp-cut preview, offseason phone closure, build footer, recap explanation, recorded playoff list, and Daily—remain regression coverage. This pass does not activate ads, tracking, payments, cloud saves, or a backend.

## 2026-10-25 scripted 20-run follow-up disposition

Source: user-provided summary of 20 Season runs and 20 three-season Career runs. The tester explicitly described scripted clicks, did not provide a build identifier, and asked that the observations be treated as leads rather than hand-verified findings. Findings were checked against production baseline `e8b287bf916a4d7b6dcdf2008e8b47a22786a8e2`.

| Finding | Disposition |
| --- | --- |
| Restructure dead money follows the GM to a new team | Confirmed state-ownership defect. Current and pushed dead money were stored only on the active season, and `takeJob` changed the team before rollover. Liabilities are now tracked by team; rollover converts each club's pushed amount into that same club's current charge before the new job becomes active. Legacy saves initialize the ledger from their current club only, without inventing other-team debt. Tests cover the reported Carolina-to-Las Vegas shape, an 18.7M legacy Tampa Bay-to-Cleveland shape, and save/reload. |
| Camp cuts have no dead-money cost | Confirmed. Camp releases now add a visible estimate and a contract-based charge: replacement/minimum deals have no charge, drafted deals use a smaller modeled charge, and veteran or same-year signed deals use larger modeled charges. The final decision log records the amount. These are simulation rules, not representations of verified NFL contract guarantees. |
| Play the week silently stalls with a pending trade offer | Partly confirmed. The engine already rejected advancement with a specific review message and no roster mutation, but the week and season-simulation buttons remained enabled. They now disable and explicitly say to review the visible offer first. Accepting or declining remains deliberate. |
| Trade-call labels read backward; any accepted deal raises owner confidence | Presentation issue confirmed; arithmetic claim not reproduced. The value badges now say `Good value for you`, `Fair value for you`, or `Poor value for you`. Current engine behavior already gives +4 owner confidence for a bargain, +1 for fair value, and −4 for a poor-value deal, so no new automatic acceptance bonus was added. |
| Only Daily, Season, and Career are available | Not reproduced. The verified production artifact exposes Historical and Turnaround navigation and distinct pages in addition to the three named modes. The report did not identify which build it loaded. |
| Production build cannot be identified | Confirmed visibility gap. The footer now embeds the hosting provider's real commit SHA when supplied at build time, shortened for display with the full value in the title; local or unknown builds say `Build unknown` rather than claiming a release. |
| Cap room reaches 100–220M | Confirmed at the cap screen but separated from end-of-offseason room. In a 50-seed Seattle baseline, optimized year-three opening room averaged $179.5M because expired contracts were correctly excluded; after retention and outside signings, regular-season room averaged $25.9M. Deliberately making no moves left $244.9M. The local balance follow-up makes that obligation explicit, recommends retaining affordable core players in automated paths, expands outside boards from four to six, and strengthens CPU retention. It does not force spending or reprice existing contracts. |
| Older free agents retain peak annual asks | Confirmed formula limitation. The local follow-up applies a bounded age adjustment to new-market annual asks while protecting elite quarterbacks, elite players, and quality linemen from being treated as worthless. Contract terms remain shorter for older players. |
| Owner confidence falls sharply, including after winning records | Confirmed compounding behavior. A baseline 10–7 Seattle season lost 15.2 owner points on average during the regular season because unused cap was penalized after every loss. The local follow-up checks unused cap quarterly, uses a cap percentage instead of a fixed dollar threshold, exposes every weekly component, and retains poor-record, weak-QB, blowout, and firing consequences. |
| Roster strength feels weakly related to results | Measured as a tuning question, not a missing relationship. Across 9,088 baseline team-seasons, end-state strength correlated 0.383 with wins, strength correlated 0.509 with point differential, and point differential correlated 0.790 with wins. The local economy changes raised strength-to-wins modestly to 0.411 without changing game-score variance or forcing standings. |
| Trade calls repeat | Confirmed variety issue, not a stuck-offer bug. Baseline consecutive seasons repeated at least one target in 41/99 optimized pairs and 47/85 minimal pairs. The local follow-up remembers a bounded two-season window, rotates callers and targets when alternatives exist, and expands value-specific prose. |
| Grades are generous | Existing transparent rubric remains unchanged in the local follow-up. The report supplied preferences rather than an arithmetic contradiction, so no separate grade nerf was bundled into economy work. |

The current build also contains all earlier QA disposition records below. This follow-up does not activate ads, tracking, cloud saves, payments, or a backend.

### Balance follow-up — published as `dfb35ff`

The local branch was compared with production `07f0f8a` using 50 deterministic Seattle seeds for an optimized retention/acquisition strategy and 50 for a deliberate minimal-move strategy, up to three years each. The optimized path entered the regular season with average room of $45.4M in year two and $33.1M in year three; the minimal path retained $115.7M and $244.9M respectively, preserving a meaningful consequence for refusing to build the roster. Expanded boards exposed more mid-tier choices while stronger CPU retention reduced outside 88+ signings from 205 to 181 across comparable completed seasons. No Seattle threepeat occurred in either baseline or follow-up samples.

For owner confidence, 44 follow-up Seattle seasons ending 10–7 lost 11.3 points on average during the regular season, down from 15.2 across 41 baseline cases. A separate 320-run all-team sample still fired minimal-move GMs for sustained poor performance; an eight-career, 20-year minimal-move probe fired every GM between years two and seven. The penalty was reduced, not removed.

A 16-career optimized long-run sample across Seattle, the Jets, Kansas City, and Atlanta completed 320 seasons with no engine failures. The maximum user title streak was five, all 32 teams won at least one title, and the most frequent champion was Kansas City at 54/320. The optimized user won 117/320 titles, so strong play remains highly successful and broader difficulty remains a product-tuning consideration. Year-20 user cap room ranged from −$0.8M to $97.0M. This sample is evidence against a permanent locked dynasty, not proof of perfect parity.

No score variance, playoff seeding, grade formula, existing contract charge, save key, entitlement, advertising, or network behavior changed in this balance follow-up.

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
