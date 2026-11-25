import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";
import { publishedArticles } from "@/lib/data/articles";

const description = "Football front-office reporting and analysis from Run The Roster.";

export const metadata: Metadata = {
  title: "Front Office Reports",
  description,
  alternates: { canonical: "/news/" },
  robots: publishedArticles.some(({ legacySection }) => legacySection === "news") ? undefined : { index: false, follow: true },
};

export default function NewsPage() {
  const reports = publishedArticles.filter(({ legacySection }) => legacySection === "news");
  return (
    <ContentPage title="Front Office Reports" description={description}>
      {reports.map(({ slug, title, description, published }) => (
        <ContentSection key={slug} title={<Link href={`/articles/${slug}/`}>{title}</Link>}>
          <p><time dateTime={published}>{published}</time></p>
          <p>{description}</p>
        </ContentSection>
      ))}
      <p className="text-sm"><Link className="text-primary underline underline-offset-4" href="/articles/">All articles</Link></p>
    </ContentPage>
  );
}
