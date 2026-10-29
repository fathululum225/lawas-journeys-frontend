'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '@/lib/config';

/**
 * "Save article" bookmarks, kept in this browser only (localStorage, same key as the legacy site).
 */

const CHANGE_EVENT = 'lj:saved-articles';
const EMPTY = '[]';

const readRaw = (): string => {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.savedArticles) ?? EMPTY;
  } catch {
    return EMPTY;
  }
};

const parse = (raw: string): string[] => {
  try {
    const slugs: unknown = JSON.parse(raw);
    return Array.isArray(slugs) ? slugs.filter((slug): slug is string => typeof slug === 'string') : [];
  } catch {
    return [];
  }
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

export function useSavedArticles() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const slugs = parse(raw);

  /** Adds or removes the article and returns its new saved state. */
  const toggle = useCallback((slug: string): boolean => {
    const current = parse(readRaw());
    const isSaved = current.includes(slug);
    const next = isSaved ? current.filter((item) => item !== slug) : [...current, slug];

    try {
      window.localStorage.setItem(STORAGE_KEYS.savedArticles, JSON.stringify(next));
    } catch {
      /* storage unavailable: bookmarks last until the page is closed */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));

    return !isSaved;
  }, []);

  return { slugs, isSaved: (slug: string) => slugs.includes(slug), toggle };
}
