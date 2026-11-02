import type { MetadataRoute } from "next";

const BASE_URL = "https://runtheroster.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/daily", changeFrequency: "daily", priority: 0.9 },
    { path: "/turnaround", changeFrequency: "daily", priority: 0.8 },
    { path: "/season", changeFrequency: "monthly", priority: 0.8 },
    { path: "/career", changeFrequency: "monthly", priority: 0.8 },
    { path: "/historical", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.4 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}/`,
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority,
  }));
}
