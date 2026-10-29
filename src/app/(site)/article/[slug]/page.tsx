import type { Metadata } from 'next';
import { assetUrl } from '@/lib/assets';
import { getArticle } from '@/lib/data';
import { ArticleDetailView } from '@/components/journal/ArticleDetailView';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      images: [assetUrl(article.image)],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug);

  return (
    <div className="container section section--narrow">
      <ArticleDetailView article={article} />
    </div>
  );
}
