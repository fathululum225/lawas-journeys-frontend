'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { clearSession, getStoredUser, getToken, parseUser, saveSession, subscribeToSession } from '@/lib/session';
import type { Session, User } from '@/types';

interface AuthContextValue {
  /** False during server rendering and the first client render, before localStorage is read. */
  ready: boolean;
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  /** Stores the session returned by POST /auth/login or /auth/register. */
  signIn: (session: Session) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const subscribeToHydration = (): (() => void) => () => undefined;
const getServerUser = (): null => null;

/**
 * Session state for the whole app. The token and user stay in localStorage exactly as in the
 * legacy site, so the Express backend needs no change; the store below just makes React
 * re-render whenever they change (login, logout, a 401 from the API, another tab).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const storedUser = useSyncExternalStore(subscribeToSession, getStoredUser, getServerUser);
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const user = useMemo(() => (ready && getToken() ? parseUser(storedUser) : null), [ready, storedUser]);

  const signIn = useCallback((session: Session) => saveSession(session), []);
  const signOut = useCallback(() => clearSession(), []);

  const value = useMemo<AuthContextValue>(() => ({
    ready,
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === 'admin',
    signIn,
    signOut,
  }), [ready, user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};
