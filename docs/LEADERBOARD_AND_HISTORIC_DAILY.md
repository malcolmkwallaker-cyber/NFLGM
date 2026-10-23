# Leaderboard and historic turnaround design

## Shipped client-side foundation

- `/leaderboard` is deliberately labeled **This device only**. It derives personal bests from the existing profile and never uploads them.
- `lib/leaderboard.ts` defines a versioned submission/response contract for a future shared historic-turnaround board. It does not make network requests.
- `lib/engine/historic-turnaround.ts` selects only verified, sourced scenarios by UTC date, derives one deterministic seed for every player, and exposes a transparent score breakdown.
- `lib/data/historic-turnarounds.ts` contains sourced season-level facts. `/turnaround` uses those facts as context for a deterministic modern simulation; it explicitly does not claim to reproduce an authentic historical roster or schedule.

## Score formula (`historic-turnaround-v1`)

The simulated run score is clamped to 0–1000:

```text
400
+ 35 × (simulated wins − real wins normalized to the simulated schedule)
+ playoff bonus (0 / 50 / 100 / 160 / 250 / 350)
+ 2 × (GM grade − 60)
+ (owner confidence − 50)
```

The UI must call this a **simulated result**. Verified `actualWins` and `actualOutcome` are historical context, not part of the player score.

## What a genuine shared board requires

The current Netlify deployment is a static export. A real public board needs an approved server-side service with:

1. A project/account and production credentials owned by the game operator.
2. Persistent storage and a documented retention/deletion policy for anonymous identifiers, display names, IP-derived abuse signals, and submitted runs.
3. An explicit privacy disclosure and a decision on whether players can choose public display names.
4. Server verification of scenario ID, date, rules version, seed, decision sequence, and recomputed score. Client-submitted scores must not be trusted directly.
5. Rate limits, duplicate-run policy, profanity/moderation handling, and an operator removal path.
6. Separate staging and production endpoints plus deployment secrets that are never placed in the static client bundle.

Until those choices are approved and provisioned, the shared contract remains dormant and the product must not label any board global or live.

## Publishing a historic scenario

A scenario must remain absent from the UI until its facts and initial snapshot are reviewed. A publishable entry requires `status: "verified"`, a verification date, at least one HTTPS source, a stable initial-state hash, the actual record and season length, the actual season outcome, and a roster/rules snapshot. Appending verified entries preserves the rotation. Changing facts or game rules requires a new initial-state hash or rules version so old submissions cannot be mixed with new runs.
