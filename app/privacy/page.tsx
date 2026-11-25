import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "See what Run The Roster saves in your browser and how to manage your data and measurement choices.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <h1 className="font-display text-5xl leading-none tracking-wide">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Updated November 25, 2026.</p>
      </header>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-card p-5 text-sm leading-relaxed sm:p-6">
        <div>
          <h2 className="font-display text-2xl tracking-wide">Game saves stay on your device</h2>
          <p className="mt-2 text-muted-foreground">
            Run The Roster stores your GM name, game settings, Daily results and streaks, Single Season file, Career file,
            and local score-room entries in your browser&apos;s local storage. The current game has no player account, cloud
            sync, or score server, and the game does not upload those save contents.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Optional Google Analytics page views</h2>
          <p className="mt-2 text-muted-foreground">
            A published build may offer optional Google Analytics 4 audience measurement. The Google tag is not loaded
            unless the build has a valid measurement ID and you expressly choose Allow. Declining, Do Not Track, or
            Global Privacy Control prevents it from loading. You can change the choice from Settings.
          </p>
          <p className="mt-2 text-muted-foreground">
            When allowed, Run The Roster sends route page views without URL query strings. It does not send your GM name,
            save contents, gameplay choices, or advertising signals. The Google tag may attach standard browser, device,
            and request context under the <a className="text-primary underline-offset-4 hover:underline" href="https://policies.google.com/privacy">Google Privacy Policy</a>.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Your controls</h2>
          <p className="mt-2 text-muted-foreground">
            The Settings page can wipe the game profile stored by this browser. Browser controls can clear all site data,
            including small interface markers such as whether a one-time prompt has already appeared. Clearing browser
            storage cannot be undone because there is no server backup.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Hosting and ordinary web requests</h2>
          <p className="mt-2 text-muted-foreground">
            Although game saves stay local, hosting and network providers may process ordinary request information such as
            IP address, requested page, date and time, and browser or device details to deliver and protect the site. Run
            The Roster does not run an account database. The game does not send the separate first-party statistics
            described below unless that feature is enabled. Provider logging and retention are
            controlled by those providers rather than by the game&apos;s browser save.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Cookieless visit statistics</h2>
          <p className="mt-2 text-muted-foreground">
            When a published build has first-party statistics turned on, the browser sends pseudonymous events to this
            site&apos;s own collection address. The public build leaves this off until the operator turns it on. While it is
            off, the game does not send these events. The browser does not set a cookie and does not load a third-party
            tracker for these first-party events. This is separate from optional Google Analytics.
          </p>
          <p className="mt-2 text-muted-foreground">
            A random id stays in session storage for the open tab and is discarded when that tab session ends. A second,
            id rotates each UTC day when local storage is available: a random seed remains in local storage on the device and is never sent. Each
            day the browser sends only that day&apos;s hash, plus the hashes for yesterday and seven days earlier, so return
            counts can be calculated. These hashes can link visits across days, even though the seed stays on your device. If storage is blocked, those hashes are
            left out.
          </p>
          <p className="mt-2 text-muted-foreground">
            The events are page views (the path, the referring site&apos;s hostname, and utm_source, utm_medium, utm_campaign,
            and utm_content when a link includes them), a game start and its mode, the first action in a tab session, a
            completed season, a completed draft, a trade, a share-card click, and the end of a tab session with its
            duration. The server stores those fields and the UTC day. It does not store a name, save file, IP address, or
            user agent. Browsers that send Do Not Track, and browsers that send Global Privacy Control, are not measured.
            Event rows older than 90 days are deleted by a daily cleanup. Hosting backups may retain copies under the
            provider&apos;s separate retention policy. The operator statistics page is password-protected and is not part of the game.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Sharing is your choice</h2>
          <p className="mt-2 text-muted-foreground">
            Copy, image-share, and device-share controls run only when you choose them. Anything you send to another app or
            person is then handled under that recipient&apos;s or service&apos;s practices.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">Advertising and your choices</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The site currently publishes an AdSense account ownership tag and an <code>ads.txt</code> seller record so
            Google can review the domain. It does not currently load the AdSense advertising script or display Google ad
            units, and no advertising consent system has been activated.
          </p>
          <p>
            If we enable Google advertising, Google and participating ad providers may use cookies and similar
            technologies to serve, measure, or personalize ads. Learn how Google uses information from
            {" "}<a className="text-primary underline-offset-4 hover:underline" href="https://policies.google.com/technologies/partner-sites">sites that use its services</a>{" "}
            and manage personalized advertising in
            {" "}<a className="text-primary underline-offset-4 hover:underline" href="https://myadcenter.google.com/">My Ad Center</a>.
            You can also manage participation from some other advertising providers through{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="https://optout.aboutads.info/">WebChoices</a>,
            and use your browser to block or clear cookies.
          </p>
          <p>
            The audience measurement choice above is separate from advertising. Before serving personalized ads in the
            European Economic Area, the United Kingdom, or Switzerland, we will use a Google-certified consent tool
            and update this notice. No advertising consent tool is active now.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">Audience and updates</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Run The Roster is intended for adults and is not directed at children. The current site does not perform age
          verification. This page will be revised when the game&apos;s data practices or advertising configuration changes;
          the current date at the top will change with it. Privacy or support questions can be sent to{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:malcolmkwallaker@gmail.com">malcolmkwallaker@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
