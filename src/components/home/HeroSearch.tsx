import { api } from '@/lib/api';
import { HeroSearchForm } from './HeroSearchForm';

/** Loads the destination options, then renders the search form. A failed request leaves the select with its default option. */
export async function HeroSearch() {
  const destinations = await api.destinations.list().catch(() => []);

  return <HeroSearchForm destinations={destinations} />;
}
