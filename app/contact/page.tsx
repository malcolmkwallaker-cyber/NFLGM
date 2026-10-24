export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Contact</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">Get in touch</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Run The Roster is published by Malcolm Wallaker. For game feedback, accessibility issues, privacy questions, or
          business inquiries, email{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:malcolmkwallaker@gmail.com">malcolmkwallaker@gmail.com</a>.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card p-5 text-sm leading-relaxed text-muted-foreground sm:p-6">
        <h2 className="font-display text-3xl tracking-wide text-foreground">Helpful details</h2>
        <p className="mt-3">
          For a game problem, include the mode, season year, team, and the screen where it happened. Do not email passwords,
          payment details, or other sensitive information; the current game has no player accounts or checkout.
        </p>
        <p className="mt-3">This public email is monitored directly. No specific response time is promised.</p>
      </section>
    </div>
  );
}
