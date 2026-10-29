/**
 * assets.ts
 * Image paths coming from the database look like "assets/images/packages/x.svg" (the legacy
 * frontend folder layout). They are served from /public/images by this app, so the helper maps
 * them. Full URLs (https:, data:, blob:) pass through untouched.
 */

import { FALLBACK_IMAGE } from './config';

const ABSOLUTE_URL = /^(https?:|data:|blob:|\/\/)/i;

export const isExternalImage = (path: string): boolean => ABSOLUTE_URL.test(path);

export const assetUrl = (path: string | null | undefined): string => {
  if (!path) return FALLBACK_IMAGE;
  if (isExternalImage(path)) return path;

  return `/${path.replace(/^\/+/, '').replace(/^assets\//, '')}`;
};
