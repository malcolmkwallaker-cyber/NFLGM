import type { MetadataRoute } from "next";
import { publishedArticles } from "@/lib/data/articles";

const BASE_URL = "https://runtheroster.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/daily", changeFrequency: "daily", priority: 0.9 },
    { path: "/turnaround", changeFrequency: "daily", priority: 0.8 },
    { path: "/season", changeFrequency: "monthly", priority: 0.8 },
    { path: "/career", changeFrequency: "monthly", priority: 0.8 },
    { path: "/historical", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.4 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
    { path: "/guides", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-11-24" },
    { path: "/faq", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-11-24" },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-11-24" },
    { path: "/changelog", changeFrequency: "monthly", priority: 0.4, lastModified: "2026-11-24" },
    { path: "/articles", changeFrequency: "weekly", priority: 0.5, lastModified: "2026-11-24" },
  ] as const;

  return [...pages.map(({ path, ...metadata }) => ({
    url: `${BASE_URL}${path}/`,
    ...metadata,
  })), ...publishedArticles.map(({ slug, published, updated }) => ({
    url: `${BASE_URL}/articles/${slug}/`,
    lastModified: updated ?? published,
  }))];
}
