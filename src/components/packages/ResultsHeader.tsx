'use client';

import { useI18n } from '@/providers/LanguageProvider';

/** "Journeys" title with the number of results next to it. */
export function ResultsHeader({ total }: { total?: number }) {
  const { t } = useI18n();

  return (
    <div className="section__header results-header">
      <h2 className="section__title">{t('home.featured.title')}</h2>
      <p className="results-header__count" id="result-count" aria-live="polite">
        {total !== undefined && t('packages.count', { count: total })}
      </p>
    </div>
  );
}
