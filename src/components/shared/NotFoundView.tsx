'use client';

import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import { ButtonLink } from './Button';
import { EmptyState } from './EmptyState';

export function NotFoundView() {
  const { t } = useI18n();

  return (
    <div className="container section section--narrow">
      <EmptyState title={t('notFound.title')} text={t('notFound.text')}>
        <ButtonLink variant="outline" size="sm" href={routes.home()}>{t('notFound.home')}</ButtonLink>
      </EmptyState>
    </div>
  );
}
