import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";
import { publishedArticles } from "@/lib/data/articles";

const description = "Articles about building a football roster and making front-office decisions in Run The Roster.";

export const metadata: Metadata = {
  title: "Football GM Articles",
  description,
  alternates: { canonical: "/articles/" },
};

export default function ArticlesPage() {
  return (
    <ContentPage title="Articles" description={description}>
      {publishedArticles.some(({ legacySection }) => legacySection === "news") ? (
        <p className="text-sm"><Link className="text-primary underline underline-offset-4" href="/news/">Front Office Reports</Link></p>
      ) : null}
      {publishedArticles.length ? publishedArticles.map((article) => (
        <ContentSection key={article.slug} title={<Link href={`/articles/${article.slug}/`}>{article.title}</Link>}>
          <p>{article.description}</p>
        </ContentSection>
      )) : (
        <ContentSection title="Read the game guides">
          <p>For help getting started or comparing modes, see the <Link href="/guides/">game guides</Link> and <Link href="/faq/">FAQ</Link>.</p>
        </ContentSection>
      )}
    </ContentPage>
  );
}
