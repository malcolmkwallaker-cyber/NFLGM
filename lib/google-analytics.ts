const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/;

export type GaPageLocation = {
  pathname: string;
  search: string;
  href: string;
};

export type GaPageViewParams = {
  page_path: string;
  page_location: string;
  page_title: string;
  send_to: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __rtrGaConfigured?: boolean;
  }
}

export function googleAnalyticsId(value: string | undefined | null): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return GA_MEASUREMENT_ID.test(id) ? id : null;
}

export function gaBootstrapScript(measurementId: string): string {
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag = window.gtag || gtag;",
    "if (!window.__rtrGaConfigured) {",
    "  window.gtag('js', new Date());",
    `  window.gtag('config', '${measurementId}', { send_page_view: false });`,
    "  window.__rtrGaConfigured = true;",
    "}",
  ].join("\n");
}

export function gaPageViewParams(measurementId: string, location: GaPageLocation, title: string): GaPageViewParams {
  return {
    page_path: `${location.pathname}${location.search}`,
    page_location: location.href,
    page_title: title,
    send_to: measurementId,
  };
}

export function queueGaPageView(measurementId: string, location: GaPageLocation, title: string): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js reads an Arguments object from the data layer, not a rest array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  if (!window.__rtrGaConfigured) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
    window.__rtrGaConfigured = true;
  }
  window.gtag("event", "page_view", gaPageViewParams(measurementId, location, title));
}
