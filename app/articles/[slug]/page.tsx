import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentPage, ContentSection } from "@/components/site/content-page";
import { StructuredData } from "@/components/site/structured-data";
import { publishedArticles } from "@/lib/data/articles";

const previewSlug = "preview";

export const dynamicParams = false;

export function generateStaticParams() {
  // Static export needs one known slug even while the index is empty.
  return publishedArticles.length ? publishedArticles.map(({ slug }) => ({ slug })) : [{ slug: previewSlug }];
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
  const related = (article.relatedSlugs?.length
    ? article.relatedSlugs.flatMap((relatedSlug) => publishedArticles.filter((item) => item.slug === relatedSlug))
    : publishedArticles.filter((item) => item.slug !== slug)).slice(0, 3);
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
        {article.figure ? (
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-card">
            <Image src={article.figure.src} alt={article.figure.alt} width={article.figure.width} height={article.figure.height} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" unoptimized />
            <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">{article.figure.caption}</figcaption>
          </figure>
        ) : null}
        {article.sections.map(({ heading, paragraphs }) => (
          <ContentSection key={heading} title={heading}>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ContentSection>
        ))}
        {article.sources?.length ? (
          <ContentSection title="Sources">
            <ul className="space-y-2">{article.sources.map(({ label, href }) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}</ul>
          </ContentSection>
        ) : null}
        {related.length ? (
          <ContentSection title="Related guides and articles">
            <ul className="space-y-2">{related.map((item) => (
              <li key={item.slug}><Link href={`/articles/${item.slug}/`}>{item.title}</Link></li>
            ))}</ul>
          </ContentSection>
        ) : null}
        <ContentSection title="Keep playing">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link className="rounded-md border border-primary/40 px-3 py-2 text-sm text-primary underline underline-offset-4" href={article.playHref ?? "/"}>{article.playHref ? "Play this mode" : "Play Run The Roster"}</Link>
            <Link className="py-2 text-sm" href="/guides/">Browse game guides</Link>
          </div>
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
