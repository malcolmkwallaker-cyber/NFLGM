export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Privacy</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">How this playtest handles data</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Current as of October 24, 2026.</p>
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
            The Roster does not currently operate its own analytics service, account database, or tracking API. Provider
            logging and retention are controlled by those providers rather than by the game&apos;s browser save.
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
