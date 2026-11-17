import { describe, expect, it } from "vitest";
import {
  browserPrivacySignalsAllowGoogleAnalytics,
  readGoogleAnalyticsConsent,
  validGoogleAnalyticsId,
  writeGoogleAnalyticsConsent,
} from "@/lib/google-analytics";

describe("Google Analytics configuration", () => {
  it("accepts only GA4 measurement IDs", () => {
    expect(validGoogleAnalyticsId("G-ABC12345")).toBe("G-ABC12345");
    expect(validGoogleAnalyticsId(" g-abcd1234 ")).toBe("G-ABCD1234");
    expect(validGoogleAnalyticsId(undefined)).toBeNull();
    expect(validGoogleAnalyticsId("UA-123-1")).toBeNull();
    expect(validGoogleAnalyticsId("G-<SCRIPT>")).toBeNull();
  });

  it("honors Do Not Track and Global Privacy Control", () => {
    expect(browserPrivacySignalsAllowGoogleAnalytics({ doNotTrack: "1" })).toBe(false);
    expect(browserPrivacySignalsAllowGoogleAnalytics({ doNotTrack: "yes" })).toBe(false);
    expect(browserPrivacySignalsAllowGoogleAnalytics({ globalPrivacyControl: true })).toBe(false);
    expect(browserPrivacySignalsAllowGoogleAnalytics({ doNotTrack: "0" })).toBe(true);
  });

  it("reads and writes only explicit consent values", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    expect(readGoogleAnalyticsConsent(storage)).toBeNull();
    expect(writeGoogleAnalyticsConsent(storage, "granted")).toBe(true);
    expect(readGoogleAnalyticsConsent(storage)).toBe("granted");
    values.set("rtr_google_analytics_consent", "unexpected");
    expect(readGoogleAnalyticsConsent(storage)).toBeNull();
  });
});
