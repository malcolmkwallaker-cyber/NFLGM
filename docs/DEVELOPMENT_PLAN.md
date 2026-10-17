# NFL GM Career Redesign: Audit and Implementation Plan

Status: Phase 1 audit complete. No gameplay redesign has been implemented yet.

## Executive summary

The project is a functioning first version, not a throwaway prototype. It already has a useful deterministic simulation core, complete modern roster data, a single-season flow, daily content, career rollover, historical packs, local saves, responsive UI primitives, and a small passing test suite. The redesign should preserve those assets and evolve them incrementally.

The main product problem is focus. The current Single Season mode exposes nearly every front-office phase in sequence and usually requires more decisions and clicks than a 10–20 minute casual run should. The current Daily Challenge is polished but is one static multiple-choice decision rather than a 3–5 decision scenario driven by the shared simulation engine. Career mode has meaningful scaffolding, but it is not yet a durable dynasty simulation.

The main technical problem is concentration. Most game rules are in `lib/engine/season.ts` (about 1,740 lines), while most season UI is in `components/game/desk.tsx` (about 842 lines). This makes mode-specific pacing, deeper dynasty rules, and reliable testing harder than necessary.

The recommended strategy is a gradual extraction around the existing `SeasonState` and deterministic engine. Build the redesigned Single Season mode first, use its shared scenario and outcome APIs for Daily Challenge, and only then deepen those systems for Franchise Dynasty.

## Current product map

### Single Season

The existing loop is complete:

1. Select one of 32 teams.
2. Answer the owner brief.
3. Hire four staff members.
4. Manage the cap.
5. Move through three free-agency waves.
6. Review trades and optionally shop a player.
7. Complete a three-round draft plus automated later picks.
8. Cut the camp roster to 22–26 players.
9. Play or simulate 17 regular-season weeks with scripted interruptions.
10. Play the postseason and receive a GM grade and share card.

This is a strong end-to-end vertical slice. It already includes immediate meter changes, headlines, delayed consequences, deterministic outcomes, replayable seeds, and a clear recap. Its weakness is that it behaves more like a compressed franchise offseason than a fast casual season.

### Daily GM Challenge

The current implementation includes 33 rotating historical scenarios, one choice per day, hindsight grades, streaks, share cards, and a clearly disclosed modeled comparison field. It does not yet satisfy the redesign goal of 3–5 connected decisions or use the shared season simulation engine.

The prominent exact rank and field-size display is generated locally. Although explanatory copy calls the field modeled, the redesign should not show an exact competitive rank until a real results service exists. Before multiplayer, use a clearly named offline benchmark such as “decision quality” or “simulated outcome percentile.”

### Career / future Franchise Dynasty

Career mode reuses the single-season engine and adds roster aging, expiring contracts, cap growth, job offers, legacy, retirement, and career history. Historical one-season packs and advanced stats are also present. These are useful foundations, but depth charts, negotiations, player development systems, CPU team building, schemes, morale, recovery, scouting depth, and credible long-horizon league balance are not implemented yet.

## What should be retained

- Seeded RNG and deterministic game resolution in `lib/engine/rng.ts`.
- The action-driven `SeasonState` transition model and serializable state.
- Shared `Player`, `TeamInfo`, `SeasonState`, `CareerState`, and related domain types.
- Modern roster snapshot and team directory.
- Cap, ratings, schedule, standings, playoff, grading, and career scaffolding.
- Rule-based headlines and free-text keyword fallback.
- Local-first profile storage for the no-account version.
- Existing daily challenge content, but adapted into multi-step scenarios over time.
- Historical packs, kept stable while the first two modes are improved.
- Present visual language, mobile navigation, reusable UI components, and share-card format.
- Clear disclosure of fictional, estimated, mocked, or modeled systems.

## What should be refactored

### 1. Split the season engine by responsibility

Keep `applyAction` as the compatibility entry point while extracting:

- `simulation/game.ts`: matchup inputs, score generation, result explanation.
- `simulation/ratings.ts`: lineup, scheme, health, morale, and staff effects.
- `league/schedule.ts`: schedule generation and calendar advancement.
- `league/standings.ts`: standings, tiebreakers, seeding, and playoff brackets.
- `roster/transactions.ts`: contracts, cap operations, free agency, trades, and cuts.
- `roster/draft.ts`: class generation, scouting, draft order, and CPU selections.
- `events/scenarios.ts`: decision definitions, prerequisites, effects, and delayed consequences.
- `modes/single-season.ts`, `modes/daily.ts`, and `modes/dynasty.ts`: pacing and mode-specific rules only.

Extraction should be incremental. Each extracted function must retain deterministic behavior and receive focused tests before callers move.

### 2. Split the desk UI into phase screens

Replace the single large `Desk` module with a thin mode shell and focused screens. A phase registry should map state to the appropriate screen and primary action. Shared components should include decision cards, consequence summaries, roster comparisons, progress indicators, standings, and recap panels.

### 3. Add versioned persistence and migrations

The current save has a version number but no migration path. Add:

- Runtime schema validation at the persistence boundary.
- Explicit migrations between save versions.
- Recovery from corrupt or partial saves without silently erasing all progress.
- Guarded writes for storage quota or browser restrictions.
- Import/export of a save file before account infrastructure exists.
- Tests for round trips, migrations, corruption, and mode switching.

### 4. Make explanations a first-class engine output

Every important action and game should produce structured reasons, not only prose headlines. Suggested output:

```ts
interface OutcomeExplanation {
  summary: string;
  factors: Array<{
    label: string;
    impact: "major-positive" | "positive" | "neutral" | "negative" | "major-negative";
    detail: string;
  }>;
  consequences: Array<{
    timing: "now" | "later";
    text: string;
  }>;
}
```

The UI can reveal a concise summary first and let advanced players expand the factors.

## Defects and technical risks found in the audit

### Critical before expanding Career

1. CPU draft selections do not add drafted players to CPU rosters. CPU teams eventually decay and are backfilled with generic 66-overall camp players.
2. A 12-season automated career became repeatedly 17–0, then failed in 2036 because the user roster could not meet the 22-player camp minimum. Career progression needs roster-floor guarantees for every team and long-horizon balance tests.
3. Career tests cover only the first rollover. There are no invariants for five, ten, or twenty seasons.
4. Tactical `teamMod` is persistent state and is not reset during rollover, so some short-term decisions can unintentionally affect later seasons.

### High priority for Single Season

1. The happy path is too long for the target casual session. Four separate staff hires, three free-agency waves, multiple trade calls, a detailed draft, camp cuts, 17 week clicks, and playoffs can exceed the desired pace.
2. Outcomes are understandable at a surface level, but the engine does not expose a consistent “why this happened” model.
3. Staff schemes are displayed but do not materially drive tactical outcomes. Kicker quality is also absent from team ratings and scoring.
4. The schedule is a balanced circle slate, not an NFL-style divisional/conference schedule. This is disclosed, but it weakens football credibility.
5. Injuries are mostly one scripted user-team event. There is no league-wide availability or recovery model.
6. Draft order is based on current roster power rather than prior record and tiebreakers.
7. Local UI state for camp selections is not keyed to a season. A later camp can retain stale cut IDs if the desk component remains mounted across seasons.

### High priority for Daily

1. Daily results are content lookups, not outcomes from the shared engine.
2. Each challenge has one decision instead of the target 3–5.
3. Exact rank and field size are locally fabricated. They are disclosed as modeled, but should be removed from the competitive presentation until backed by real submissions.

### Platform and quality risks

1. The production build depends on downloading Google Fonts and fails in restricted/offline environments. Self-host fonts or use a system stack.
2. The “Ask the wire for a rewrite” control always attempts the static `/api/narrative` endpoint and does not honor the experimental narrative setting. In the static build it is effectively nonfunctional.
3. Tests cover ten engine cases in one file. There are no component, browser, save/load, accessibility, responsive-layout, or statistical-balance tests.
4. Mobile layouts use reasonable responsive classes, but no automated viewport checks or device interaction tests exist.
5. The mock checkout and Pro preview are clearly labeled, but they should stay out of the core redesign path until real accounts and billing are in scope.

## What should be removed or deferred

- Remove exact daily ranks until a real result-submission service exists.
- Hide the narrative rewrite control unless a provider is configured; keep rule-based headlines as the default.
- Defer real payments, authentication, and synchronized leagues until the three local gameplay modes are sound.
- Defer expansion of historical packs while Single Season and Daily are being rebuilt.
- Keep the mock Pro switch only as an internal preview mechanism; do not build new gameplay dependencies around it.
- Avoid adding more isolated scripted content until the scenario format can run across modes.

## Target shared architecture

The shared engine should be mode-agnostic and deterministic:

```text
Roster/team data
      |
      v
League + simulation core
  - ratings and lineups
  - matchup simulation
  - schedule and standings
  - cap and transactions
  - development and health
      |
      v
Scenario/action system
  - available decisions
  - validated effects
  - delayed consequences
  - structured explanations
      |
      +------------------+-------------------+
      |                  |                   |
Single Season       Daily Challenge    Franchise Dynasty
fast pacing         fixed scenario     multi-year depth
guided choices      3–5 decisions      full controls
      |                  |                   |
      +------------------+-------------------+
                         |
                  Shared UI primitives
```

Modes should configure setup, visible detail, decision cadence, and completion rules. They should not implement separate player ratings, game simulation, cap math, or roster mutations.

## Phase 2: redesigned Single Season

### Target loop

Aim for 12–18 meaningful interactions and a 10–20 minute completion time:

1. Team selection with a one-line difficulty and roster identity.
2. A 60-second onboarding that explains owner goal, team strength, and the three main meters.
3. Three guided offseason decisions chosen from staff identity, cap/roster priority, free agency, trade, and draft. Do not require every subsystem in every run.
4. Simulate the season in 3–4 week chapters rather than requiring 17 individual week clicks.
5. Interrupt chapters with 4–6 context-sensitive decisions based on roster, record, injuries, owner goal, and prior choices.
6. Present each chapter with the record change, a key player/story, and a concise explanation of why results moved.
7. Play playoffs round by round.
8. Show GM grade, achievements, best/worst decision, season story, and a prominent “Run it back” action.

### Required systems

- Single-season mode configuration separate from Dynasty rules.
- Scenario eligibility and weighted selection.
- Structured outcome explanations.
- Chapter simulation that still resolves every underlying game.
- Achievement definitions driven by events and final state.
- Difficulty labels based on initial roster/cap/owner expectations.
- A restart flow that preserves the player profile but replaces the active season safely.
- Analytics events behind an interface, with a no-op local implementation.

### Acceptance criteria

- A new player can begin playing within 60 seconds.
- A normal run completes in 10–20 minutes without using “Finish the year.”
- The player makes at least 8 meaningful decisions, with no more than 18 required interactions.
- Every decision shows immediate feedback and at least one understandable consequence.
- Every game/chapter result exposes two or three believable contributing factors.
- All 32 teams can finish a season without invalid state.
- Restarting is one clear action from recap.
- Mobile widths of 320, 375, 768, and 1024 pixels have no horizontal overflow or blocked primary actions.
- Save/load works at every phase and after browser reload.

## Phase 3: Daily GM Challenge

### Design

- Represent each daily as a deterministic scenario seed plus starting snapshot.
- Give the player 3–5 decisions, with later options responding to earlier choices.
- Use shared transaction, roster, ratings, and matchup APIs.
- Simulate a short outcome window and score objective performance plus decision quality.
- Keep the same scenario seed and rules version for every player that day.
- Store `scenarioId`, `seed`, `rulesVersion`, decisions, score, and outcome for future server verification.
- Preserve streaks, achievements, and share cards.
- Before multiplayer, show local score and a clearly labeled simulated benchmark only.
- When multiplayer exists, calculate rank solely from accepted server submissions.

### Acceptance criteria

- A challenge completes in 2–5 minutes.
- It contains 3–5 connected decisions.
- Replaying the same seed and choices produces the same result.
- Daily logic invokes the same roster and simulation functions used by Single Season.
- No UI language implies real-player ranking without server evidence.

## Phase 4: Franchise Dynasty

Build on stabilized shared systems rather than expanding the current monolith. Add in this order:

1. Credible CPU roster building, drafts, free agency, trades, and cap compliance.
2. Depth charts and lineup-aware ratings.
3. Multi-year contract structures, guarantees, dead money, extensions, and negotiations.
4. Player development, aging, injuries, recovery, morale, and chemistry.
5. Scouting uncertainty and a deeper draft.
6. Coaching schemes and fit that materially affect simulation.
7. Owner expectations, job market, GM reputation, and career history.
8. Dynasty records, achievements, and season-to-season storytelling.

Long-horizon automated simulations must run at least 20 seasons without invalid rosters, runaway ratings, cap deadlocks, impossible records, or stalled progression.

## Test strategy

### Unit and invariant tests

- Determinism for the same seed, state, and action sequence.
- Action preconditions and state transition validity.
- Roster size, required positions, unique players, and cap invariants.
- Schedule completeness and no duplicate team per week.
- Standings, tiebreakers, playoff seeding, and bracket advancement.
- Contract aging, expiration, dead money, and rollover.
- CPU draft and free-agency participation.
- Daily scenario determinism and scoring.
- Save migration and corruption recovery.

### Statistical tests

- Thousands of matchup simulations across rating gaps.
- Home-field advantage within a defined range.
- Plausible score, win, playoff, and championship distributions.
- Team quality correlated with wins without making outcomes deterministic.
- Twenty-season league simulations with bounded rating and cap distributions.

### Browser tests

- Start, reload, and finish Single Season.
- Replace an active season with confirmation.
- Save/load at every phase.
- Daily completion and duplicate-play prevention.
- Career rollover, firing, job acceptance, and retirement.
- Keyboard navigation and accessible labels for every primary control.
- Mobile viewport screenshots and interaction checks.

## Recommended implementation sequence

### Milestone 0: safety and build reliability

- Self-host or remove remote font dependencies.
- Split the existing test file by domain.
- Add save/load, playoff, roster-invariant, and multi-year career tests.
- Fix CPU drafting, roster floors, rollover leakage, and stale camp UI state.
- Gate or remove the unavailable narrative action.

### Milestone 1: engine seams

- Extract matchup simulation and structured explanations.
- Extract standings/playoffs and roster transactions.
- Introduce typed scenarios and effects while keeping current actions compatible.
- Add rules-version metadata to saves and simulations.

### Milestone 2: Single Season vertical slice

- Implement chapter pacing for one team and one representative decision path.
- Add guided onboarding, explanations, achievements, and replay.
- Validate session length with playtests before converting all teams and scenarios.

### Milestone 3: complete Single Season

- Convert all teams, event families, playoffs, recap, saves, and mobile layouts.
- Balance with automated simulation plus human playtests.
- Make Single Season the primary home-page action.

### Milestone 4: Daily on the shared engine

- Define the multi-step daily scenario format.
- Convert a small set of existing daily stories first.
- Remove exact local ranks and prepare a server-verifiable result envelope.

### Milestone 5: Franchise Dynasty foundation

- Stabilize CPU team management and league economy.
- Add depth charts, development, contracts, scouting, and schemes incrementally.
- Require long-horizon simulation checks for every major system.

## Phase 1 completion record

Completed:

- Reviewed repository structure, modes, engine, persistence, UI, and existing tests.
- Ran the existing test suite: 10 tests passed.
- Ran ESLint: passed.
- Ran TypeScript checking: passed.
- Audited roster data: 32 teams, 922 players, no duplicate player IDs.
- Ran 320 automated single seasons and a multi-year career stress test.
- Identified long-horizon roster and CPU progression failures.
- Defined the target shared architecture and phased implementation plan.

Outstanding before Phase 2 feature work:

- Agree on the streamlined Single Season interaction budget and chapter cadence.
- Implement Milestone 0 fixes and safety tests.
- Establish baseline playtest timing and completion metrics.
