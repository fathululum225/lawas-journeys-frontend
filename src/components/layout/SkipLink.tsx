'use client';

import { useI18n } from '@/providers/LanguageProvider';

/** First focusable element: lets keyboard users jump past the navigation. */
export function SkipLink() {
  const { t } = useI18n();

  return <a className="skip-link" href="#main">{t('common.skip')}</a>;
}
