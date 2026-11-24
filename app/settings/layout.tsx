import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your game profile, interface sounds, and privacy settings for this browser.",
  alternates: { canonical: "/settings/" },
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return children;
}
