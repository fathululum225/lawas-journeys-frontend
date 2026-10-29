'use client';

import { useI18n } from '@/providers/LanguageProvider';
import { formatRating } from '@/lib/utils';
import { Icon } from './Icon';

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export function Rating({ rating, reviewCount }: RatingProps) {
  const { t } = useI18n();

  return (
    <div className="rating" aria-label={`${formatRating(rating)} / 5`}>
      <Icon name="star" size={14} className="rating__star" />
      <span className="rating__value">{formatRating(rating)}</span>
      {reviewCount !== undefined && <span className="rating__count">{t('card.reviews', { count: reviewCount })}</span>}
    </div>
  );
}
