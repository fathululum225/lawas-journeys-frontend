'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { BodyClass } from '@/components/shared/BodyClass';
import { Skeletons } from '@/components/shared/Skeletons';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';

type Check = 'pending' | 'valid' | 'invalid';

/**
 * Sign-in gate of the admin panel. A stored session may be stale (expired token, role changed), so
 * it is confirmed with the API (GET /auth/me) before the panel is shown. The API enforces the admin
 * role again on every request, so this gate is about usability, not security.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const { ready, user, signOut } = useAuth();
  const showToast = useToast();
  const [check, setCheck] = useState<Check>('pending');

  useEffect(() => {
    if (!ready) return;

    if (!user || user.role !== 'admin') {
      setCheck('invalid');
      return;
    }

    let cancelled = false;

    api.auth.me()
      .then((current) => {
        if (current.role !== 'admin') throw new Error('Not an administrator');
        if (!cancelled) setCheck('valid');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.isNetworkError) showToast(error.message, 'error');
        signOut();
        setCheck('invalid');
      });

    return () => {
      cancelled = true;
    };
    // Only the first read of the stored session needs checking; later sign-ins are verified by the login form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const signedIn = Boolean(user && user.role === 'admin');

  return (
    <>
      <BodyClass name="admin" />
      {!ready || (check === 'pending' && signedIn)
        ? <div className="admin-login"><Skeletons count={1} /></div>
        : signedIn && check === 'valid'
          ? <AdminShell>{children}</AdminShell>
          : <AdminLogin onSignedIn={() => setCheck('valid')} />}
    </>
  );
}
