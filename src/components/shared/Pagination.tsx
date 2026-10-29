'use client';

import Link from 'next/link';
import { buildQueryString, cn, type QueryValue } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from './Icon';

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Path of the list, e.g. "/packages". */
  path: string;
  /** Other query parameters to keep on every link (filters). */
  query?: Record<string, QueryValue>;
  /** Element id to scroll to after changing page. */
  anchor?: string;
}

/** Page numbers with ellipses: 1 2 3 … 10 */
const buildPageWindow = (page: number, totalPages: number): Array<number | 'gap'> => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3].forEach((value) => pages.add(value));

  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? ['gap' as const, value] : [value]));
};

/** Server-friendly pagination: every page is a real link, so it works with the URL and the back button. */
export function Pagination({ page, totalPages, path, query = {}, anchor }: PaginationProps) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const hrefFor = (target: number): string => `${path}${buildQueryString({ ...query, page: target > 1 ? target : undefined })}${anchor ? `#${anchor}` : ''}`;

  return (
    <nav className="pagination" aria-label="Pagination">
      {buildPageWindow(page, totalPages).map((entry, index) => (entry === 'gap'
        ? <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">…</span>
        : (
          <Link
            key={entry}
            className={cn('pagination__item', entry === page && 'is-active')}
            href={hrefFor(entry)}
            aria-current={entry === page ? 'page' : undefined}
          >
            {entry}
          </Link>
        )))}
      {page < totalPages && (
        <Link className="pagination__item pagination__item--next" href={hrefFor(page + 1)} aria-label={t('common.next')}>
          <Icon name="chevron-right" size={16} />
        </Link>
      )}
    </nav>
  );
}
