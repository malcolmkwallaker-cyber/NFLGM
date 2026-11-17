"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  browserPrivacySignalsAllowGoogleAnalytics,
  readGoogleAnalyticsConsent,
  validGoogleAnalyticsId,
  writeGoogleAnalyticsConsent,
  type GoogleAnalyticsConsent,
} from "@/lib/google-analytics";

const SCRIPT_ID = "run-the-roster-google-analytics";

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  rtrGaInitialized?: string;
  rtrGaLastPage?: string;
};

function privacySignalsAllowAnalytics(): boolean {
  return browserPrivacySignalsAllowGoogleAnalytics({
    doNotTrack: navigator.doNotTrack ?? (window as Window & { doNotTrack?: string }).doNotTrack ?? null,
    globalPrivacyControl: (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
  });
}

function analyticsWindow(): AnalyticsWindow {
  return window as AnalyticsWindow;
}

function getGtag(): Gtag {
  const target = analyticsWindow();
  target.dataLayer ??= [];
  target.gtag ??= (...args: unknown[]) => {
    target.dataLayer?.push(args);
  };
  return target.gtag;
}

function initializeGoogleAnalytics(measurementId: string): void {
  if (!privacySignalsAllowAnalytics()) return;

  const analyticsWindow = window as AnalyticsWindow;
  if (analyticsWindow.rtrGaInitialized === measurementId) return;
  analyticsWindow.rtrGaInitialized = measurementId;
  const gtag = getGtag();
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
  });

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }
}

function disableGoogleAnalytics(): void {
  const target = analyticsWindow();
  target.gtag?.("consent", "update", { analytics_storage: "denied" });
  document.getElementById(SCRIPT_ID)?.remove();
  delete target.rtrGaInitialized;
  delete target.rtrGaLastPage;

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    const base = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = base;
    document.cookie = `${base}; Domain=${window.location.hostname}`;
    document.cookie = `${base}; Domain=.${window.location.hostname}`;
  }
}

function subscribeToConsent(onChange: () => void): () => void {
  const listener = () => onChange();
  window.addEventListener("rtr:google-analytics-consent", listener);
  return () => window.removeEventListener("rtr:google-analytics-consent", listener);
}

function consentSnapshot(): GoogleAnalyticsConsent | null {
  return readGoogleAnalyticsConsent(window.localStorage);
}

function serverConsentSnapshot(): null {
  return null;
}

function subscribeToPrivacySignals(): () => void {
  return () => {};
}

function privacySnapshot(): boolean {
  return privacySignalsAllowAnalytics();
}

function serverPrivacySnapshot(): false {
  return false;
}

function chooseConsent(next: GoogleAnalyticsConsent): void {
  writeGoogleAnalyticsConsent(window.localStorage, next);
  if (next === "denied") disableGoogleAnalytics();
  window.dispatchEvent(new CustomEvent("rtr:google-analytics-consent", { detail: next }));
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const measurementId = validGoogleAnalyticsId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const consent = useSyncExternalStore(subscribeToConsent, consentSnapshot, serverConsentSnapshot);
  const privacyAllowed = useSyncExternalStore(subscribeToPrivacySignals, privacySnapshot, serverPrivacySnapshot);

  useEffect(() => {
    if (!measurementId || !privacyAllowed || consent !== "granted" || !pathname) return;
    initializeGoogleAnalytics(measurementId);
    const target = analyticsWindow();
    if (target.rtrGaLastPage === pathname) return;
    target.rtrGaLastPage = pathname;
    getGtag()("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
    });
  }, [consent, measurementId, pathname, privacyAllowed]);

  if (!measurementId || consent !== null || !privacyAllowed) return null;

  return (
    <aside className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-[#0b1018] p-4 shadow-2xl md:bottom-4" aria-label="Audience measurement choice">
      <p className="text-sm leading-relaxed">
        Allow privacy-conscious Google Analytics page views? Run The Roster will not send game saves, names, gameplay
        choices, or advertising signals. Read the <Link className="text-primary underline-offset-4 hover:underline" href="/privacy">privacy policy</Link>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => chooseConsent("granted")}>Allow audience measurement</Button>
        <Button variant="outline" onClick={() => chooseConsent("denied")}>No thanks</Button>
      </div>
    </aside>
  );
}

export function GoogleAnalyticsSettings() {
  const measurementId = validGoogleAnalyticsId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const consent = useSyncExternalStore(subscribeToConsent, consentSnapshot, serverConsentSnapshot);
  const privacyAllowed = useSyncExternalStore(subscribeToPrivacySignals, privacySnapshot, serverPrivacySnapshot);

  if (!measurementId) {
    return <p className="rounded-xl border border-white/10 px-4 py-3 text-sm text-muted-foreground">Google Analytics is not configured in this build.</p>;
  }

  return (
    <section className="rounded-xl border border-white/10 px-4 py-3 text-sm">
      <h2 className="font-medium">Audience measurement</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {privacyAllowed
          ? `Google Analytics page views are ${consent === "granted" ? "allowed" : "not allowed"} in this browser.`
          : "A browser Do Not Track or Global Privacy Control signal is blocking Google Analytics."} This does not
        include your GM name, save data, gameplay choices, or advertising signals.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" disabled={!privacyAllowed} onClick={() => chooseConsent("granted")}>Allow</Button>
        <Button size="sm" variant="outline" onClick={() => chooseConsent("denied")}>Decline</Button>
      </div>
    </section>
  );
}
