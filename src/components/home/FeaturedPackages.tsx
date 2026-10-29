import { api } from '@/lib/api';
import { PackageCard } from '@/components/packages/PackageCard';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const FEATURED_PACKAGE_COUNT = 5;

export async function FeaturedPackages() {
  try {
    const { items } = await api.packages.list({ featured: true, limit: FEATURED_PACKAGE_COUNT });
    return items.map((item) => <PackageCard key={item.id} tourPackage={item} />);
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
