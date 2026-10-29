/**
 * search-params.ts
 * Helpers for the `searchParams` prop of App Router pages (a promise of string | string[] values).
 */

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;
export type ResolvedSearchParams = Record<string, string | string[] | undefined>;

/** First value of a query parameter, or "" when it is missing. */
export const pickParam = (params: ResolvedSearchParams, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? '';
};

/** Positive integer from a query parameter, falling back to `fallback`. */
export const pickPage = (params: ResolvedSearchParams, key = 'page', fallback = 1): number => {
  const value = Number.parseInt(pickParam(params, key), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};
