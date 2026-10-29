'use client';

import { useI18n } from '@/providers/LanguageProvider';

export function JournalHeading({ query }: { query: string }) {
  const { t } = useI18n();

  return <h2 className="section__title" id="latest-title">{query ? t('journal.results', { query }) : t('journal.latest')}</h2>;
}
