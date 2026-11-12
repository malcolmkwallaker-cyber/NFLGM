"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { queueGaPageView } from "@/lib/google-analytics";

export function GoogleAnalyticsPageViews({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    try {
      queueGaPageView(measurementId, window.location, document.title);
    } catch {
      /* measurement must not affect the game */
    }
  }, [measurementId, pathname]);

  return null;
}
