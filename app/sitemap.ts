import type { MetadataRoute } from "next";
import { publishedArticles } from "@/lib/data/articles";

const BASE_URL = "https://runtheroster.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "daily", priority: 1, lastModified: "2026-11-02" },
    { path: "/daily", changeFrequency: "daily", priority: 0.9, lastModified: "2026-11-25" },
    { path: "/turnaround", changeFrequency: "daily", priority: 0.8, lastModified: "2026-11-25" },
    { path: "/season", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-11-25" },
    { path: "/play", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-11-25" },
    { path: "/career", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-11-25" },
    { path: "/historical", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-11-02" },
    { path: "/about", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-11-25" },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.4, lastModified: "2026-11-25" },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-11-26" },
    { path: "/contact", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-11-25" },
    { path: "/guides", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-11-25" },
    { path: "/faq", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-11-25" },
    { path: "/changelog", changeFrequency: "monthly", priority: 0.4, lastModified: "2026-11-25" },
    { path: "/articles", changeFrequency: "weekly", priority: 0.5, lastModified: "2026-11-25" },
  ] as const;

  const newsLastModified = publishedArticles.filter(({ legacySection }) => legacySection === "news").map(({ published, updated }) => updated ?? published).sort().at(-1);

  return [...pages.map(({ path, ...metadata }) => ({
    url: `${BASE_URL}${path}/`,
    ...metadata,
  })), ...(newsLastModified ? [{ url: `${BASE_URL}/news/`, lastModified: newsLastModified }] : []), ...publishedArticles.map(({ slug, published, updated }) => ({
    url: `${BASE_URL}/articles/${slug}/`,
    lastModified: updated ?? published,
  }))];
}
