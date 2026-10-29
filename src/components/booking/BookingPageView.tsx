'use client';

import { useState } from 'react';
import { routes } from '@/lib/routes';
import { formatRupiah } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { TourPackage } from '@/types';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BookingForm, clampGuests, type BookingDraft } from './BookingForm';
import { BookingSummary } from './BookingSummary';

interface BookingPageViewProps {
  tourPackage: TourPackage;
  initialDate?: string;
  initialGuests?: number;
}

/** Stand-alone booking page (/booking?package=slug): the same form as the detail page, with a live summary. */
export function BookingPageView({ tourPackage, initialDate = '', initialGuests }: BookingPageViewProps) {
  const { t, formatDate } = useI18n();
  const [draft, setDraft] = useState<BookingDraft>({ travelDate: initialDate, guests: clampGuests(initialGuests ?? 0, tourPackage) });

  return (
    <>
      <Breadcrumb
        trail={[
          { label: t('nav.explore'), href: routes.packages() },
          { label: tourPackage.title, href: routes.package(tourPackage.slug) },
          { label: t('booking.submit') },
        ]}
      />
      <h1 className="checkout__title">{tourPackage.title}</h1>

      <div className="checkout">
        <div className="checkout__methods">
          <BookingForm tourPackage={tourPackage} initialDate={initialDate} initialGuests={initialGuests} onDraftChange={setDraft} />
        </div>

        <BookingSummary
          image={tourPackage.image}
          title={tourPackage.title}
          rows={[
            { label: t('booking.date'), value: draft.travelDate ? formatDate(draft.travelDate) : '—' },
            { label: t('booking.guests'), value: draft.guests || '—' },
            { label: t('card.perPax'), value: formatRupiah(tourPackage.price) },
          ]}
          total={{ label: t('booking.total'), value: formatRupiah(tourPackage.price * draft.guests) }}
        />
      </div>
    </>
  );
}
