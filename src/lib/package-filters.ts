/**
 * package-filters.ts
 * The filters of the packages page live in the URL (?destination=...&category=...), which is also
 * how the home search bar and the interest tiles send visitors here.
 */

import type { PackageQuery } from '@/types';
import { pickPage, pickParam, type ResolvedSearchParams } from './search-params';

export const PACKAGE_PAGE_SIZE = 9;

/** Duration filter options -> API parameters. */
export const DURATION_RANGES = {
  short: { minDays: 1, maxDays: 3 },
  medium: { minDays: 4, maxDays: 5 },
  long: { minDays: 6 },
} as const;

export const FILTER_FIELDS = ['q', 'destination', 'category', 'duration', 'guests', 'sort'] as const;
export type FilterField = (typeof FILTER_FIELDS)[number];
export type PackageFilterValues = Record<FilterField, string>;

export const DEFAULT_FILTERS: PackageFilterValues = {
  q: '',
  destination: '',
  category: '',
  duration: '',
  guests: '',
  sort: 'recommended',
};

export const readFilters = (params: ResolvedSearchParams): PackageFilterValues => ({
  q: pickParam(params, 'q'),
  destination: pickParam(params, 'destination'),
  category: pickParam(params, 'category'),
  duration: pickParam(params, 'duration'),
  guests: pickParam(params, 'guests'),
  sort: pickParam(params, 'sort') || DEFAULT_FILTERS.sort,
});

export const readPage = (params: ResolvedSearchParams): number => pickPage(params);

export const toApiQuery = (filters: PackageFilterValues, page: number): PackageQuery => {
  const range = DURATION_RANGES[filters.duration as keyof typeof DURATION_RANGES];

  return {
    q: filters.q.trim(),
    destination: filters.destination,
    category: filters.category,
    guests: filters.guests,
    sort: filters.sort as PackageQuery['sort'],
    ...(range ?? {}),
    page,
    limit: PACKAGE_PAGE_SIZE,
  };
};
