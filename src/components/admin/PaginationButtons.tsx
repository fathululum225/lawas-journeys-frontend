'use client';

import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from '@/components/shared/Icon';

interface PaginationButtonsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Page numbers with ellipses: 1 2 3 … 10 */
const buildPageWindow = (page: number, totalPages: number): Array<number | 'gap'> => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3].forEach((value) => pages.add(value));

  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? ['gap' as const, value] : [value]));
};

/** Pagination for lists that load in place (no URL change), such as the admin bookings table. */
export function PaginationButtons({ page, totalPages, onChange }: PaginationButtonsProps) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {buildPageWindow(page, totalPages).map((entry, index) => (entry === 'gap'
        ? <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">…</span>
        : (
          <button key={entry} className={cn('pagination__item', entry === page && 'is-active')} type="button" aria-current={entry === page ? 'page' : undefined} onClick={() => onChange(entry)}>
            {entry}
          </button>
        )))}
      {page < totalPages && (
        <button className="pagination__item pagination__item--next" type="button" aria-label={t('common.next')} onClick={() => onChange(page + 1)}>
          <Icon name="chevron-right" size={16} />
        </button>
      )}
    </nav>
  );
}
