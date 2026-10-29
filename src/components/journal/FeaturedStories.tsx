import { api } from '@/lib/api';
import { FEATURED_COUNT } from '@/lib/journal';
import { ApiErrorState } from '@/components/shared/ApiErrorState';
import { Carousel } from '@/components/shared/Carousel';
import { ArticleCard } from './ArticleCard';

/** Featured stories carousel (hidden by the page whenever a filter is active). */
export async function FeaturedStories() {
  try {
    const { items } = await api.articles.list({ featured: true, limit: FEATURED_COUNT });
    return (
      <Carousel columns={3}>
        {items.map((article) => <ArticleCard key={article.id} article={article} variant="story" />)}
      </Carousel>
    );
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
