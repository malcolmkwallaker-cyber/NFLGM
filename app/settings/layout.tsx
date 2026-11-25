import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your game profile, interface sounds, and privacy settings for this browser.",
  alternates: { canonical: "/settings/" },
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return <div className="mx-auto max-w-lg space-y-5"><header>
        <h1 className="font-display text-4xl tracking-wide">Settings</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Saves stay in this browser only. There is no login or cloud sync, and nothing uploads your career, Daily results,
          or settings.
        </p>
      </header>{children}</div>;
}
