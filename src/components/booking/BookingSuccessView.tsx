'use client';

import { routes } from '@/lib/routes';
import { formatRupiah } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { Booking } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WhatsAppConfirmButton } from './WhatsAppConfirmButton';

/** Confirmation details and the "Confirm via WhatsApp" button. */
export function BookingSuccessView({ booking }: { booking: Booking }) {
  const { t, formatDate } = useI18n();
  const isPaid = booking.paymentStatus === 'paid';

  return (
    <div className="success">
      <span className={isPaid ? 'success__icon' : 'success__icon success__icon--pending'}>
        <Icon name={isPaid ? 'check-circle' : 'info'} size={56} />
      </span>
      <h1 className="success__title">{t(isPaid ? 'success.title' : 'success.pendingTitle')}</h1>
      <p className="success__text">{t(isPaid ? 'success.text' : 'success.pendingText', { email: booking.customerEmail })}</p>

      <div className="success__card">
        <AppImage className="success__image" src={booking.packageImage} width={240} height={160} />
        <div>
          <p className="success__code">{t('payment.bookingCode')}: <strong>{booking.code}</strong></p>
          <h2 className="success__package">{booking.packageTitle}</h2>
          <ul className="success__facts">
            <li><Icon name="calendar" size={16} />{formatDate(booking.travelDate)}</li>
            <li><Icon name="users" size={16} />{t('success.guests', { count: booking.guests })}</li>
            <li><Icon name="credit-card" size={16} />{formatRupiah(booking.totalPrice)}</li>
          </ul>
          <p className="success__status"><StatusBadge status={booking.status} /> <StatusBadge status={booking.paymentStatus} /></p>
        </div>
      </div>

      <div className="success__actions">
        <WhatsAppConfirmButton bookingCode={booking.code} />
        <ButtonLink variant="outline" size="lg" href={routes.myBooking()}>{t('nav.myBooking')}</ButtonLink>
        <ButtonLink variant="ghost" size="lg" href={routes.home()}>{t('success.home')}</ButtonLink>
      </div>
    </div>
  );
}
