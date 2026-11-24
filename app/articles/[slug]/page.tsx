import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage, ContentSection } from "@/components/site/content-page";
import { StructuredData } from "@/components/site/structured-data";
import { publishedArticles } from "@/lib/data/articles";

const previewSlug = "preview";

export const dynamicParams = false;

export function generateStaticParams() {
  // Static export needs one known slug even while the index is empty.
  return [{ slug: previewSlug }, ...publishedArticles.map(({ slug }) => ({ slug }))];
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (slug === previewSlug) return { title: "Article Preview", robots: { index: false, follow: true } };
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${slug}/` },
    authors: [{ name: "Malcolm Wallaker" }],
  };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  if (slug === previewSlug) {
    return (
      <ContentPage title="Article preview" description="There is no article here yet.">
        <Link className="text-sm text-primary underline underline-offset-4" href="/articles/">Browse articles</Link>
      </ContentPage>
    );
  }
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <article>
      <ContentPage title={article.title} description={article.description}>
        <nav aria-label="Breadcrumb" className="text-sm">
          <Link className="text-primary underline underline-offset-4" href="/articles/">Articles</Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          Malcolm Wallaker · Published <time dateTime={article.published}>{article.published}</time>
          {article.updated ? <> · Updated <time dateTime={article.updated}>{article.updated}</time></> : null}
        </p>
        {article.sections.map(({ heading, paragraphs }) => (
          <ContentSection key={heading} title={heading}>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ContentSection>
        ))}
        <ContentSection title="Keep playing">
          <p><Link href={article.playHref ?? "/"}>{article.playHref ? "Play this mode" : "Play Run The Roster"}</Link> or browse the <Link href="/guides/">game guides</Link>.</p>
        </ContentSection>
      </ContentPage>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        author: { "@type": "Person", name: "Malcolm Wallaker" },
        datePublished: article.published,
        dateModified: article.updated ?? article.published,
        mainEntityOfPage: `https://runtheroster.com/articles/${slug}/`,
      }} />
    </article>
  );
}
