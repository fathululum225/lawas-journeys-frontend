import { api } from '@/lib/api';
import { ArticleCard } from '@/components/journal/ArticleCard';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const JOURNAL_ARTICLE_COUNT = 3;

export async function JournalGrid() {
  try {
    const { items } = await api.articles.list({ featured: true, limit: JOURNAL_ARTICLE_COUNT });
    return items.map((article) => <ArticleCard key={article.id} article={article} variant="compact" />);
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
