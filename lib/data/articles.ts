export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
  playHref?: string;
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
};

// Only add approved articles. This list drives the static routes, index, and sitemap.
export const publishedArticles: readonly Article[] = [];
