export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Privacy</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">How this playtest handles data</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Current as of November 2, 2026.</p>
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
            The Roster does not run an account database. The cookieless statistics below are the only measurement the game
            operates, and only on a build where the operator has turned them on. Provider logging and retention are
            controlled by those providers rather than by the game&apos;s browser save.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide">Cookieless visit statistics</h2>
          <p className="mt-2 text-muted-foreground">
            When a published build has first-party statistics turned on, the browser sends anonymous events to this
            site&apos;s own collection address. The public build leaves this off until the operator turns it on. While it is
            off, the game does not send these events. The browser does not set a cookie and does not load a third-party
            tracker.
          </p>
          <p className="mt-2 text-muted-foreground">
            A random id stays in session storage for the open tab and is discarded when that tab session ends. A second,
            optional id rotates each UTC day: a random seed remains in local storage on the device and is never sent. Each
            day the browser sends only that day&apos;s hash, plus the hashes for yesterday and seven days earlier, so return
            counts can be calculated without a stable visitor id on the server. If storage is blocked, those hashes are
            left out.
          </p>
          <p className="mt-2 text-muted-foreground">
            The events are page views (the path, the referring site&apos;s hostname, and utm_source, utm_medium, utm_campaign,
            and utm_content when a link includes them), a game start and its mode, the first action in a tab session, a
            completed season, a completed draft, a trade, a share-card click, and the end of a tab session with its
            duration. The server stores those fields and the UTC day. It does not store a name, save file, IP address, or
            user agent. Browsers that send Do Not Track, and browsers that send Global Privacy Control, are not measured.
            The operator statistics page is password-protected and is not part of the game.
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
        <h2 className="font-display text-3xl tracking-wide">Google advertising is not live</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The site currently publishes an AdSense account ownership tag and an <code>ads.txt</code> seller record so
            Google can review the domain. It does not currently load the AdSense advertising script or display Google ad
            units, and no advertising consent system has been activated.
          </p>
          <p>
            Before advertising is enabled, this notice and the site&apos;s consent controls will be updated to describe the
            actual configuration and applicable choices. Google explains its data practices in the{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="https://policies.google.com/privacy">Google Privacy Policy</a>
            {" "}and{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="https://policies.google.com/technologies/ads">How Google uses information for advertising</a>.
            The operator will also re-check{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="https://support.google.com/adsense/answer/1348695">Google&apos;s consent-management requirements</a>
            {" "}before any ads go live.
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
