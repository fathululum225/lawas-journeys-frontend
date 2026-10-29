'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { useI18n } from '@/providers/LanguageProvider';

/** Form logic shared by the footer strip and the journal sidebar newsletter forms. */
export function useNewsletter() {
  const { t } = useI18n();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    const value = email.trim();

    if (value === '' || !input.checkValidity()) {
      showToast(t('newsletter.invalid'), 'error');
      input.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      showToast(await api.newsletter.subscribe(value), 'success');
      setEmail('');
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t('error.generic'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, isSubmitting, handleSubmit };
}
