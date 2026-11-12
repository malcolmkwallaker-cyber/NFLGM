import type { Metadata } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import Script from "next/script";
import { GoogleAnalyticsPageViews } from "@/components/google-analytics";
import { ProfileProvider } from "@/components/profile";
import { Shell } from "@/components/game/shell";
import { gaBootstrapScript, googleAnalyticsId } from "@/lib/google-analytics";
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
  metadataBase: new URL("https://runtheroster.com"),
  title: {
    default: "Run The Roster — Football GM Game",
    template: "%s | Run The Roster",
  },
  description: "Make daily front-office decisions, run a complete football season, or build a multi-year general manager career in a free browser simulation.",
  applicationName: "Run The Roster",
  openGraph: {
    type: "website",
    url: "https://runtheroster.com/",
    siteName: "Run The Roster",
    title: "Run The Roster — Football GM Game",
    description: "Manage contracts, trades, the draft, the cap, and owner expectations in a free browser football GM game.",
    images: [{ url: "/brand/run-the-roster-football-logo.png", width: 960, height: 640, alt: "Run The Roster football logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Run The Roster — Football GM Game",
    description: "A free daily, single-season, and career football front-office simulation.",
    images: ["/brand/run-the-roster-football-logo.png"],
  },
  other: {
    "google-adsense-account": "ca-pub-3524460167829862",
  },
};

const gaMeasurementId = googleAnalyticsId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${display.variable} dark h-full antialiased`}>
      <body className="min-h-full">
        <ProfileProvider>
          <Shell>{children}</Shell>
        </ProfileProvider>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag" strategy="afterInteractive">
              {gaBootstrapScript(gaMeasurementId)}
            </Script>
            <GoogleAnalyticsPageViews measurementId={gaMeasurementId} />
          </>
        ) : null}
      </body>
    </html>
  );
}
