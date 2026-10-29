'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useI18n } from '@/providers/LanguageProvider';
import { Button } from './Button';
import { Icon } from './Icon';

interface ErrorStateProps {
  message?: string;
  isNetworkError?: boolean;
  /** Shows a "Try again" button that re-runs the server render. Pass onRetry for client-side loads. */
  retry?: boolean;
  onRetry?: () => void;
}

/** Friendly error block shown when the API cannot be reached or answers with an error. */
export function ErrorState({ message, isNetworkError = false, retry = true, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    if (onRetry) onRetry();
    else startTransition(() => router.refresh());
  };

  return (
    <div className="empty-state empty-state--error" role="alert">
      <Icon name="alert" size={40} className="empty-state__icon" />
      <h3 className="empty-state__title">{isNetworkError ? t('error.offlineTitle') : t('error.title')}</h3>
      <p className="empty-state__text">{message ?? t('error.generic')}</p>
      {retry && (
        <Button variant="outline" size="sm" onClick={handleRetry} disabled={isPending}>
          <Icon name="refresh" size={16} />
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
