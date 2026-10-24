import type { Metadata } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import { ProfileProvider } from "@/components/profile";
import { Shell } from "@/components/game/shell";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
});

export const metadata: Metadata = {
  title: "Run The Roster",
  description: "A daily front-office challenge and a season-long NFL general manager sim.",
  other: {
    "google-adsense-account": "ca-pub-3524460167829862",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${display.variable} dark h-full antialiased`}>
      <body className="min-h-full">
        <ProfileProvider>
          <Shell>{children}</Shell>
        </ProfileProvider>
      </body>
    </html>
  );
}
