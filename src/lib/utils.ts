/**
 * utils.ts
 * Small framework-free helpers: class names, money, dates and query strings.
 */

import type { LanguageCode } from '@/i18n';

/** Joins class names, skipping falsy values: cn('btn', isActive && 'is-active'). */
export const cn = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(' ');

const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = { en: 'en-US', id: 'id-ID' };

/** 2590000 -> "Rp 2.590.000" */
export const formatRupiah = (amount: number | null | undefined): string => `Rp ${Number(amount ?? 0).toLocaleString('id-ID')}`;

export const formatRating = (rating: number | null | undefined): string => Number(rating ?? 0).toFixed(1);

/** "2024-05-12" -> "May 12, 2024" (or "12 Mei 2024" in Indonesian). */
export const formatDate = (
  isoDate: string | null | undefined,
  language: LanguageCode,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string => {
  if (!isoDate) return '';

  const date = new Date(`${String(isoDate).slice(0, 10)}T00:00:00Z`);
  return date.toLocaleDateString(LOCALE_BY_LANGUAGE[language], { ...options, timeZone: 'UTC' });
};

export const formatDateTime = (isoTimestamp: string | null | undefined, language: LanguageCode): string => {
  if (!isoTimestamp) return '';

  return new Date(isoTimestamp).toLocaleString(LOCALE_BY_LANGUAGE[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export type QueryValue = string | number | boolean | null | undefined;

/** Builds "?a=1&b=2", skipping empty values. Returns "" when nothing is left. */
export const buildQueryString = (query: Record<string, QueryValue> = {}): string => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};
