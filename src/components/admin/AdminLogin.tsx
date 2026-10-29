'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { NO_ERRORS, toFormErrors, type FormErrors } from '@/lib/form';
import { routes } from '@/lib/routes';
import { useAuth } from '@/providers/AuthProvider';
import { controlClass, FormAlert, FormGroup } from '@/components/shared/FormGroup';
import { SubmitButton } from '@/components/shared/SubmitButton';

/** Sign-in screen of the admin panel. Only accounts with the "admin" role get in. */
export function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setLoading(true);

    try {
      const session = await api.auth.login({ email: email.trim(), password });

      if (session.user.role !== 'admin') {
        setErrors({ fields: {}, general: 'This account does not have administrator access.' });
        setLoading(false);
        return;
      }

      signIn(session);
      onSignedIn();
    } catch (error) {
      setLoading(false);
      setErrors(error instanceof ApiError && error.status === 422
        ? toFormErrors(error, ['email', 'password'])
        : { fields: {}, general: error instanceof Error ? error.message : String(error) });
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login__card form" onSubmit={handleSubmit} noValidate>
        <p className="logo"><span className="logo__lawas">Lawas</span> <span className="logo__journeys">Journeys</span></p>
        <h1 className="admin-login__title">Admin sign in</h1>
        <p className="admin-login__text">Use the administrator account from your <code>.env</code> file (ADMIN_EMAIL / ADMIN_PASSWORD).</p>
        <FormAlert message={errors.general} />
        <FormGroup htmlFor="admin-email" label="Email" error={errors.fields.email}>
          <input className={controlClass(errors.fields.email)} id="admin-email" name="email" type="email" autoComplete="username" autoFocus required value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormGroup>
        <FormGroup htmlFor="admin-password" label="Password" error={errors.fields.password}>
          <input className={controlClass(errors.fields.password)} id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </FormGroup>
        <SubmitButton size="lg" block loading={loading}>Sign in</SubmitButton>
        <Link className="admin-login__back" href={routes.home()}>← Back to website</Link>
      </form>
    </main>
  );
}
