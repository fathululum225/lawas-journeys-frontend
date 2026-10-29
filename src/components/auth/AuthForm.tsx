'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { NO_ERRORS, scrollToFormError, toFormErrors, type FormErrors } from '@/lib/form';
import { destinationAfterLogin } from '@/lib/redirect';
import { routes } from '@/lib/routes';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import { AppImage } from '@/components/shared/AppImage';
import { BodyClass } from '@/components/shared/BodyClass';
import { controlClass, FormAlert, FormGroup } from '@/components/shared/FormGroup';
import { SubmitButton } from '@/components/shared/SubmitButton';

interface AuthFormProps {
  mode: 'login' | 'register';
  /** Where to go once signed in (?next=). */
  next?: string;
}

const FIELDS = ['name', 'email', 'password'] as const;

/** Login and register: the same split-screen layout and behaviour, different fields. */
export function AuthForm({ mode, next }: AuthFormProps) {
  const { t } = useI18n();
  const { ready, user, signIn } = useAuth();
  const router = useRouter();
  const showToast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  // Visitors who are already signed in have nothing to do here.
  useEffect(() => {
    if (ready && user && !submitting) router.replace(destinationAfterLogin(next, user));
  }, [ready, user, submitting, next, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setSubmitting(true);

    try {
      const session = isRegister
        ? await api.auth.register({ name: values.name, email: values.email, password: values.password })
        : await api.auth.login({ email: values.email, password: values.password });

      signIn(session);
      router.push(destinationAfterLogin(next, session.user));
    } catch (error) {
      setSubmitting(false);

      if (error instanceof ApiError && [401, 409, 422].includes(error.status)) {
        setErrors(toFormErrors(error, FIELDS));
        requestAnimationFrame(() => scrollToFormError(formRef.current));
      } else {
        showToast(error instanceof Error ? error.message : String(error), 'error');
      }
    }
  };

  const fieldError = (name: (typeof FIELDS)[number]) => errors.fields[name];
  const switchHref = isRegister ? routes.login(next) : routes.register(next);

  return (
    <div className="auth">
      <BodyClass name="page--auth" />
      <div className="auth__art">
        <AppImage src="assets/images/brand/login-art.svg" width={900} height={1100} priority />
        <p className="auth__quote">{t('auth.quote')}</p>
      </div>
      <div className="auth__panel">
        <div className="form-card form-card--plain">
          <h1 className="form-card__title">{t(isRegister ? 'auth.register.title' : 'auth.login.title')}</h1>
          <p className="form-card__lead">{t(isRegister ? 'auth.register.lead' : 'auth.login.lead')}</p>

          <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <FormAlert message={errors.general} />

            {isRegister && (
              <FormGroup htmlFor="auth-name" label={t('auth.name')} error={fieldError('name')}>
                <input className={controlClass(fieldError('name'))} id="auth-name" name="name" type="text" autoComplete="name" value={values.name} onChange={handleChange} required />
              </FormGroup>
            )}
            <FormGroup htmlFor="auth-email" label={t('booking.email')} error={fieldError('email')}>
              <input className={controlClass(fieldError('email'))} id="auth-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup
              htmlFor="auth-password"
              label={t('auth.password')}
              error={fieldError('password')}
              hint={isRegister ? t('auth.passwordHint') : undefined}
            >
              <input
                className={controlClass(fieldError('password'))}
                id="auth-password"
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 8 : undefined}
                value={values.password}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SubmitButton size="lg" block loading={submitting}>{t(isRegister ? 'nav.register' : 'nav.login')}</SubmitButton>
            <p className="form__footer">
              <span>{t(isRegister ? 'auth.register.switch' : 'auth.login.switch')}</span>{' '}
              <Link href={switchHref}>{t(isRegister ? 'nav.login' : 'nav.register')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
