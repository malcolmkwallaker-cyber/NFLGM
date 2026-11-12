import { describe, expect, it, vi } from "vitest";
import { gaBootstrapScript, gaPageViewParams, googleAnalyticsId, queueGaPageView } from "@/lib/google-analytics";

function commands(dataLayer: unknown[]): unknown[][] {
  return dataLayer.map((entry) => Array.from(entry as ArrayLike<unknown>));
}

describe("google analytics measurement id", () => {
  it("renders nothing when the id is unset, blank, or not a GA4 id", () => {
    expect(googleAnalyticsId(undefined)).toBeNull();
    expect(googleAnalyticsId(null)).toBeNull();
    expect(googleAnalyticsId("")).toBeNull();
    expect(googleAnalyticsId("   ")).toBeNull();
    expect(googleAnalyticsId("UA-123456-1")).toBeNull();
    expect(googleAnalyticsId("G-abc")).toBeNull();
    expect(googleAnalyticsId("G-TEST';alert(1)//")).toBeNull();
  });

  it("accepts a GA4 measurement id", () => {
    expect(googleAnalyticsId(" G-TEST1234 ")).toBe("G-TEST1234");
  });
});

describe("google analytics snippet", () => {
  it("disables the automatic page view so route changes can send their own", () => {
    const script = gaBootstrapScript("G-TEST1234");
    expect(script).toContain("gtag('config', 'G-TEST1234', { send_page_view: false });");
    expect(script).not.toContain("send_page_view: true");
  });

  it("queues one config and a page_view for each location", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { dataLayer });
    try {
      queueGaPageView("G-TEST1234", { pathname: "/", search: "?utm_source=test", href: "https://runtheroster.com/?utm_source=test" }, "Home");
      queueGaPageView("G-TEST1234", { pathname: "/daily/", search: "", href: "https://runtheroster.com/daily/" }, "Daily");
      const queued = commands(dataLayer);
      expect(queued.filter((command) => command[0] === "config")).toHaveLength(1);
      expect(queued[1]).toEqual(["config", "G-TEST1234", { send_page_view: false }]);
      expect(queued.filter((command) => command[0] === "event" && command[1] === "page_view")).toEqual([
        ["event", "page_view", {
          page_path: "/?utm_source=test",
          page_location: "https://runtheroster.com/?utm_source=test",
          page_title: "Home",
          send_to: "G-TEST1234",
        }],
        ["event", "page_view", {
          page_path: "/daily/",
          page_location: "https://runtheroster.com/daily/",
          page_title: "Daily",
          send_to: "G-TEST1234",
        }],
      ]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("does nothing on the server", () => {
    vi.stubGlobal("window", undefined);
    try {
      expect(() => queueGaPageView("G-TEST1234", { pathname: "/", search: "", href: "https://runtheroster.com/" }, "Home")).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("page view parameters", () => {
  it("keeps the query string on the page path", () => {
    expect(gaPageViewParams("G-TEST1234", { pathname: "/privacy/", search: "?ref=footer", href: "https://runtheroster.com/privacy/?ref=footer" }, "Privacy")).toEqual({
      page_path: "/privacy/?ref=footer",
      page_location: "https://runtheroster.com/privacy/?ref=footer",
      page_title: "Privacy",
      send_to: "G-TEST1234",
    });
  });
});
