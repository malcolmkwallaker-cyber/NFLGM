# Analytics PR #2 review

Last updated: November 2, 2026 / Author: ChatGPT / Status: Code repaired; deployment and activation approval pending.

## Merge blocker and repairs

GitHub returned `mergeable=false`, `mergeable_state=dirty` for original head `5cb1a9d3334bc0ea401036390b760c25e4bc3f13`. A local merge of current main `7ef0cc0ba4b7550aca1c5a230e529f38946169e9` reproduced one modify/delete conflict: main deleted `public/_redirects`, while the analytics branch modified it. Resolution retains only the four analytics endpoint rewrites and removes the obsolete `/* /index.html 200` fallback. Main's public pages, metadata, sitemap, robots and 404 behavior are preserved.

Additional confirmed fixes:

- Server collection defaults off, independently of the browser bundle flag. `ANALYTICS_COLLECTION=on` is required before reading the request body or opening a database connection. Old clients cannot keep writing once the deployed server switch is off.
- Database connection creation happens inside the guarded callbacks. An unauthenticated dashboard request cannot initialize the database; missing connection configuration produces a controlled 503 after authentication instead of an uncaught error.
- Daily event cap uses an atomic counter reservation and insert in one SQL statement. The prior separate count and insert raced under concurrency and scanned all events for every incoming event. A new additive migration initializes counters from existing events without editing the original migration.
- Payload size is checked in UTF-8 bytes.
- Privacy disclosure identifies hashes as pseudonymous and linkable across days, includes event retention and distinguishes hosting backup retention. Approval of this text and applicable privacy choices remains required; this review is not a legal determination.
- README now documents both switches, actual billing exposure, preview data copying, and the absence of verified account configuration. `.env.example` contains disabled switches and no secret.

## Independently verified locally

- `npm test`: 138 tests passed across 10 files, including existing Daily, Season, Career, save-slot, legacy-save/20-year-career and gameplay-phase round-trip regressions.
- `npm run build`: passed with TypeScript validation and 21 generated static pages. Analytics browser flag was unset.
- `npm run lint`: passed.
- `git diff --check`: passed.
- PGlite Postgres integration: both migrations applied; browser tracker emitted fixture pageview, Daily/Season/Career starts, first action and completion; HTTP collector stored them; authenticated dashboard rendered their source and mode data. This is an isolated real Postgres engine, not hosted Netlify.
- SQL cap test: 20 queued insert attempts with one remaining slot inserted exactly one additional event and stopped at 20,000. PGlite serializes execution; the PostgreSQL upsert supplies production row locking, but distributed hosted load was not tested.
- SQL retention removed expired event rows and counters.
- Function tests verified default-off collection never initializes the database, unauthorized dashboard access never initializes it, and authenticated connection failures return 503.
- Existing tests cover DNT/GPC, field filtering, daily hashes/retention calculations, dashboard escaping, auth, and network failures.

## Unverified and approval gates

The author's original 131 tests/build and browser walkthrough remain author-reported historical evidence. GitHub independently reported a successful Netlify preview for original commit `5cb1a9d`; that does not validate this repaired revision.

Browser testing of the repaired static export could not run: Playwright browser downloads failed, and an alternate locally installed Chromium crashed during startup with GPU/Vulkan initialization errors. No successful updated Daily, Season or Career browser walkthrough is claimed. Saved-game verification above is automated engine/storage testing, not a live browser result.

No Netlify account access, deployed environment inspection, migration log, hosted database query, production traffic query or billing configuration was available. No secrets, billing settings, production flags, live saves or production deployment were changed.

Before merge:
1. Confirm the updated commit's Netlify preview succeeds and review both migration logs.
2. Confirm the account is on a compatible credit-based plan and approve any provisioning/budget effects. Dependency detection can provision a database even while collection is off. A legacy-to-credit plan change is irreversible.
3. Complete a browser smoke test on the updated preview: Daily answer/reload; Season start/action/reload; Career start/action/reload; preserve all three save slots, inspect console errors, verify no collector requests with browser flag off and no database writes with server flag off.
4. Review and approve privacy wording and any required consent/opt-out controls. Hash rotation is not a guarantee of anonymity. Keep campaign slugs free of personal information.

Before activation:
1. Use preview-only settings and synthetic data. Set a private dashboard password and both flags on only in that isolated context; never inherit them into production.
2. Verify a real request persists in the preview database and appears on its authenticated dashboard, including campaign attribution; check bad auth, DNT/GPC, collection-off, function direct URLs, retention, and migration behavior.
3. Approve production activation separately. Keep production `NEXT_PUBLIC_ANALYTICS` and `ANALYTICS_COLLECTION` unset or off until then.

Measurement limitations: the funnel displays distinct-session stage totals, not an ordered conversion attribution model. Daily starts are recorded when an answer is submitted. Session duration is sampled on the first background/page-hide event and may undercount a tab that is resumed; asynchronous hashing can lose unload events. Dashboard loads cap at 200,000 rows and visibly mark truncation, so larger windows can be incomplete. These statistics are estimates, not billing or guaranteed unique-human counts. The daily row cap is not request-rate protection or a spending cap; hostile traffic can still consume invocation/compute credits. Retention and dashboard reads can consume credits with collection disabled.

## Costs and sources

Official Netlify documentation checked November 2, 2026 says Database requires credit-based plans. Free includes 300 credits/month; database compute is 10 credits per compute unit-hour in the database billing example, and database bandwidth is 20 credits/GB. At the minimum one unit, 30 awake hours consume 300 credits before other site usage. At that rate a continuously awake 30-day month would be about 7,200 compute credits; the Free plan would hit limits sooner. Database sleep is after five idle minutes on Free, which has a separate 48-unit monthly database ceiling. Requests, functions, bandwidth and production deploys also consume credits. No traffic forecast or site-specific dollar estimate was established. Storage documentation still references July 2026, so current storage charges must be confirmed in the account.

- PR: https://github.com/malcolmkwallaker-cyber/NFLGM/pull/2
- Database: https://docs.netlify.com/build/data-and-storage/netlify-database/
- Billing: https://docs.netlify.com/build/data-and-storage/netlify-database/billing-and-usage/
- Plans: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- Migrations: https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/

Source-of-truth instructions consulted: Malcolm OS START HERE universal instructions, ChatGPT master instructions, and RunTheRoster overview. Existing historical records remain intact.
