"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { bindSessionLifecycle, trackPageview } from "@/lib/analytics/track";

export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackPageview(pathname);
  }, [pathname]);

  useEffect(() => bindSessionLifecycle(), []);

  return null;
}
