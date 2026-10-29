'use client';

import Link from 'next/link';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/LanguageProvider';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Icon } from '@/components/shared/Icon';
import { Skeletons } from '@/components/shared/Skeletons';
import { ApiError } from '@/lib/api';
import { BookingItem } from './BookingItem';
import { BookingLookup } from './BookingLookup';

function MyBookings() {
  const { t } = useI18n();
  const { data, error, loading, reload } = useAsyncData(api.bookings.mine);

  if (loading) return <Skeletons count={2} variant="row" />;
  if (error) return <ErrorState message={error.message} isNetworkError={error instanceof ApiError && error.isNetworkError} onRetry={reload} />;

  if (!data || data.length === 0) {
    return (
      <EmptyState icon="ticket" title={t('myBooking.empty.title')} text={t('myBooking.empty.text')} action={{ href: routes.packages(), label: t('nav.allPackages') }} />
    );
  }

  return <>{data.map((booking) => <BookingItem key={booking.id} booking={booking} />)}</>;
}

/**
 * My Booking.
 *   - Signed-in visitors see every booking made with their account or email.
 *   - Anyone can look up a single booking with its code and the email used to book.
 */
export function MyBookingPage() {
  const { t } = useI18n();
  const { ready, isLoggedIn } = useAuth();

  return (
    <>
      <h1 className="page-title">{t('myBooking.title')}</h1>
      <p className="page-lead">{t('myBooking.lead')}</p>

      {ready && !isLoggedIn && (
        <div className="alert alert--info">
          <Icon name="info" size={18} />
          <span>
            {t('myBooking.loginHint')}{' '}
            <Link className="link" href={routes.login(routes.myBooking())}>{t('nav.login')}</Link>
          </span>
        </div>
      )}

      {ready && isLoggedIn && (
        <section className="section section--tight">
          <h2 className="section__title">{t('myBooking.yours')}</h2>
          <div className="booking-list"><MyBookings /></div>
        </section>
      )}

      <section className="section section--tight">
        <BookingLookup />
      </section>
    </>
  );
}
