import { api } from '@/lib/api';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const INTEREST_COUNT = 6;

export async function InterestGrid() {
  try {
    const categories = await api.categories.list();
    return categories.map((category) => <CategoryCard key={category.id} category={category} />);
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
