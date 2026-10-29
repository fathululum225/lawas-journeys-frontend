'use client';

import { formatRupiah } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { TourPackage } from '@/types';
import { BookingForm } from './BookingForm';

interface BookingCardProps {
  tourPackage: TourPackage;
  initialDate?: string;
  initialGuests?: number;
}

/** Sticky price + booking form on the package detail page. */
export function BookingCard({ tourPackage, initialDate, initialGuests }: BookingCardProps) {
  const { t } = useI18n();

  return (
    <aside className="booking-card" id="booking">
      <p className="booking-card__price">
        {tourPackage.originalPrice && <s>{formatRupiah(tourPackage.originalPrice)}</s>}
        <strong>{formatRupiah(tourPackage.price)}</strong>
        <span>{t('card.perPax')}</span>
      </p>
      <BookingForm tourPackage={tourPackage} initialDate={initialDate} initialGuests={initialGuests} />
    </aside>
  );
}
