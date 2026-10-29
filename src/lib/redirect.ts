/**
 * redirect.ts
 * Where to go after signing in. `?next=` holds an internal path ("/my-booking"); the legacy site used
 * page keys ("myBooking"), which are still understood so old links keep working.
 */

import type { User } from '@/types';
import { routes } from './routes';

const LEGACY_PAGE_KEYS: Record<string, string> = {
  home: routes.home(),
  packages: routes.packages(),
  destinations: routes.destinations(),
  journal: routes.journal(),
  customTrip: routes.customTrip(),
  myBooking: routes.myBooking(),
  about: routes.about(),
  admin: routes.admin(),
};

/** Only same-site paths are accepted, so ?next= cannot be used to send visitors to another site. */
export const resolveNext = (next: string | undefined): string | null => {
  if (!next) return null;
  if (next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) return next;

  return LEGACY_PAGE_KEYS[next] ?? null;
};

export const destinationAfterLogin = (next: string | undefined, user: Pick<User, 'role'> | null): string => (
  resolveNext(next) ?? (user?.role === 'admin' ? routes.admin() : routes.myBooking())
);
