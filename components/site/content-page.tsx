import type { ReactNode } from "react";

export function ContentPage({ title, description, children }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <h1 className="font-display text-5xl leading-none tracking-wide">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </div>
  );
}

export function ContentSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
      <h2 className="font-display text-3xl tracking-wide">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </section>
  );
}
