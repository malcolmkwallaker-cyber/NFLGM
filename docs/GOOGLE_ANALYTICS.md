# Google Analytics 4

The GA4 integration is present but disabled until a valid measurement ID is configured. It is separate from the existing first-party analytics system; do not enable `NEXT_PUBLIC_ANALYTICS` or `ANALYTICS_COLLECTION` as part of this setup.

Verified November 12, 2026:

- Account: `388717413` (Malcolm Wallaker)
- Property: `564033499`
- Web stream: `16329657746` for `https://runtheroster.com`
- Measurement ID: `G-8CTW3HQRP0`
- Enhanced measurement: off
- Advertising and product links: not enabled
- Current data status: no data received, expected before deployment

## Configure for a release

1. Confirm the verified Run The Roster stream still uses measurement ID `G-8CTW3HQRP0`.
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-8CTW3HQRP0` to the production environment. Measurement IDs are public configuration, but use the environment setting so an account change does not require a code change.
3. Build and deploy only in an approved Wednesday or Friday release window.
4. Open the deployed site in a fresh browser profile. Confirm there is no request to `googletagmanager.com` or `google-analytics.com` before a choice is made.
5. Decline measurement and confirm no Google Analytics request is sent.
6. Clear the site data, allow measurement, and confirm a page view appears in GA4 Realtime or DebugView. Navigate client-side and confirm one page view per route.
7. Confirm the configured event contains the route path without URL query parameters. It must not contain a GM name, save data, gameplay choices, or other personal information.

## Privacy behavior

- A visitor must explicitly allow audience measurement before the Google tag is loaded.
- Do Not Track and Global Privacy Control prevent loading even if an earlier choice was stored.
- Declining later updates consent to denied, removes the Google tag, and expires accessible `_ga` cookies for this site.
- The integration sends page views only and strips the query string from page locations.
- Google signals and ad-personalization signals are disabled. Advertising consent remains denied.
- The visitor can change the choice from Settings. The choice is stored locally under `rtr_google_analytics_consent`.
- An absent or malformed measurement ID leaves the integration fully inert and hides the consent prompt.
