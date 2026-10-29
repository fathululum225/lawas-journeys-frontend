/**
 * routes.ts
 * Every URL of the customer site in one place. Components never hand-write paths, so a route
 * can be renamed here without hunting through the code.
 */

import { buildQueryString, type QueryValue } from './utils';

type Query = Record<string, QueryValue>;

/** "Travel Guide" -> "travel-guide" (journal category URLs). */
export const toSlug = (value: string): string => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const routes = {
  home: () => '/',
  explore: () => '/explore',
  packages: (query?: Query) => `/packages${buildQueryString(query)}`,
  package: (slug: string, query?: Query) => `/package/${encodeURIComponent(slug)}${buildQueryString(query)}`,
  destinations: () => '/destinations',
  destination: (slug: string) => `/destinations/${encodeURIComponent(slug)}`,
  journal: (query?: Query) => `/journal${buildQueryString(query)}`,
  journalCategory: (category: string, query?: Query) => `/journal/${toSlug(category)}${buildQueryString(query)}`,
  article: (slug: string) => `/article/${encodeURIComponent(slug)}`,
  customTrip: () => '/custom-trip',
  about: () => '/about',
  ourStory: () => '/about/our-story',
  ourGuides: () => '/about/our-guides',
  responsibleTourism: () => '/about/responsible-tourism',
  contact: () => '/contact',
  login: (next?: string) => `/login${buildQueryString({ next })}`,
  register: (next?: string) => `/register${buildQueryString({ next })}`,
  booking: (query?: Query) => `/booking${buildQueryString(query)}`,
  bookingSuccess: (query?: Query) => `/booking/success${buildQueryString(query)}`,
  payment: (orderId: string) => `/payment${buildQueryString({ order: orderId })}`,
  myBooking: () => '/my-booking',
  legal: (section?: 'terms' | 'privacy' | 'sitemap') => `/legal${section ? `#${section}` : ''}`,
  admin: () => '/admin',
} as const;
