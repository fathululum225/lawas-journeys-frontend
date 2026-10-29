/**
 * config.ts
 * Application-wide constants. Change the API address in .env.local (NEXT_PUBLIC_API_BASE_URL);
 * edit SITE below for the contact details and social links shown in the footer.
 */

/** Base URL of the Express backend (see backend/.env -> PORT). */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api').replace(/\/+$/, '');

/** localStorage keys. They match the legacy site, so existing sessions keep working. */
export const STORAGE_KEYS = {
  token: 'lj_token',
  user: 'lj_user',
  language: 'lj_language',
  savedArticles: 'lj_saved_articles',
} as const;

/** The language lives in a cookie so server components render in the chosen language too. */
export const LANGUAGE_COOKIE = 'lj_language';

export const FALLBACK_IMAGE = '/images/brand/placeholder.svg';

export interface SocialLink {
  label: string;
  icon: 'instagram' | 'facebook' | 'youtube' | 'tripadvisor';
  url: string;
}

/** Dummy brand and contact data shown in the footer. Replace with the real details. */
/** Public URL of this site, used to resolve absolute URLs in page metadata (Open Graph images). */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

export const SITE = {
  name: 'Lawas Journeys',
  url: SITE_URL,
  contact: {
    phone: '+62 812 3456 7890',
    email: 'hello@lawasjourneys.com',
    addressLines: ['Jl. Malioboro No. 10,', 'Yogyakarta 55281, Indonesia'],
  },
  social: [
    { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/' },
    { label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/' },
    { label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/' },
    { label: 'Tripadvisor', icon: 'tripadvisor', url: 'https://www.tripadvisor.com/' },
  ] satisfies SocialLink[],
} as const;
