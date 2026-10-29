/**
 * journal.ts
 * Journal listing rules shared by /journal and /journal/[category].
 */

import { routes, toSlug } from './routes';

export const JOURNAL_PAGE_SIZE = 5;
export const FEATURED_COUNT = 6;

export const CATEGORY_ICONS: Record<string, 'history' | 'archaeology' | 'mask' | 'map-route'> = {
  History: 'history',
  Archaeology: 'archaeology',
  Culture: 'mask',
  'Travel Guide': 'map-route',
};

const CATEGORY_ORDER = ['History', 'Archaeology', 'Culture', 'Culinary', 'Travel Guide'];

const rank = (name: string): number => (CATEGORY_ORDER.includes(name) ? CATEGORY_ORDER.indexOf(name) : CATEGORY_ORDER.length);

export const sortCategories = <T extends { name: string }>(categories: T[]): T[] => (
  [...categories].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
);

/** "travel-guide" -> "Travel Guide", using the category names the backend knows. */
export const findCategoryBySlug = <T extends { name: string }>(categories: T[], slug: string): T | undefined => (
  categories.find((category) => toSlug(category.name) === slug)
);

interface JournalFilters {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
}

/** URL of the journal list for a category (path) plus keyword, tag and page (query). */
export const journalHref = ({ category, tag, q, page }: JournalFilters = {}): string => {
  const query = { q, tag, page: page && page > 1 ? page : undefined };
  return category ? routes.journalCategory(category, query) : routes.journal(query);
};
