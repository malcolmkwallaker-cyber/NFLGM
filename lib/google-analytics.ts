export const GOOGLE_ANALYTICS_CONSENT_KEY = "rtr_google_analytics_consent";

export type GoogleAnalyticsConsent = "granted" | "denied";

export function validGoogleAnalyticsId(value: string | undefined): string | null {
  const measurementId = value?.trim().toUpperCase() ?? "";
  return /^G-[A-Z0-9]{4,20}$/.test(measurementId) ? measurementId : null;
}

export function readGoogleAnalyticsConsent(storage: Pick<Storage, "getItem">): GoogleAnalyticsConsent | null {
  try {
    const value = storage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeGoogleAnalyticsConsent(
  storage: Pick<Storage, "setItem">,
  consent: GoogleAnalyticsConsent,
): boolean {
  try {
    storage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, consent);
    return true;
  } catch {
    return false;
  }
}

export function browserPrivacySignalsAllowGoogleAnalytics(signals: {
  doNotTrack?: string | null;
  globalPrivacyControl?: boolean;
}): boolean {
  const doNotTrack = signals.doNotTrack?.toLowerCase();
  return doNotTrack !== "1" && doNotTrack !== "yes" && signals.globalPrivacyControl !== true;
}
