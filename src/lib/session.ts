/**
 * session.ts
 * Keeps the signed-in user and login token in localStorage (same keys as the legacy site).
 * api.ts sends the token as a Bearer header; nothing else reads it.
 *
 * The store also works with React's useSyncExternalStore (see providers/AuthProvider.tsx):
 * every change notifies subscribers, including changes made in another tab.
 */

import type { Session, User } from '@/types';
import { STORAGE_KEYS } from './config';

const SESSION_EVENT = 'lj:session';

const isBrowser = (): boolean => typeof window !== 'undefined';

const readStorage = (key: string): string | null => {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string | null): void => {
  if (!isBrowser()) return;

  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode): the session lasts until the page closes */
  }
};

export const getToken = (): string | null => readStorage(STORAGE_KEYS.token);

/** Raw JSON string of the stored user. Stable between calls, which useSyncExternalStore needs. */
export const getStoredUser = (): string | null => readStorage(STORAGE_KEYS.user);

export const parseUser = (stored: string | null): User | null => {
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

export const getUser = (): User | null => parseUser(getStoredUser());

const notify = (): void => {
  if (isBrowser()) window.dispatchEvent(new Event(SESSION_EVENT));
};

export const saveSession = ({ token, user }: Session): void => {
  writeStorage(STORAGE_KEYS.token, token);
  writeStorage(STORAGE_KEYS.user, JSON.stringify(user));
  notify();
};

export const clearSession = (): void => {
  writeStorage(STORAGE_KEYS.token, null);
  writeStorage(STORAGE_KEYS.user, null);
  notify();
};

export const subscribeToSession = (callback: () => void): (() => void) => {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};
