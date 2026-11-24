import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("public discovery files", () => {
  it("allows the public site and points crawlers at the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://runtheroster.com/sitemap.xml",
    });
  });

  it("lists useful public pages without indexing local save controls", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://runtheroster.com/");
    expect(urls).toContain("https://runtheroster.com/daily/");
    expect(urls).toContain("https://runtheroster.com/career/");
    for (const path of ["faq", "terms", "changelog", "guides", "articles"]) {
      expect(urls).toContain(`https://runtheroster.com/${path}/`);
    }
    expect(urls).not.toContain("https://runtheroster.com/articles/preview/");
    expect(urls).not.toContain("https://runtheroster.com/play/");
    expect(urls).not.toContain("https://runtheroster.com/settings/");
    expect(new Set(urls).size).toBe(urls.length);
  });
});
