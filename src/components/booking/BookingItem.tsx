'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { formatRupiah } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WhatsAppConfirmButton } from './WhatsAppConfirmButton';

const needsPayment = (booking: Booking): boolean => booking.status !== 'cancelled' && booking.paymentStatus !== 'paid';

/** One booking in My Booking, with "Pay now" (unpaid bookings) and "WhatsApp" actions. */
export function BookingItem({ booking }: { booking: Booking }) {
  const { t, formatDate } = useI18n();
  const router = useRouter();
  const showToast = useToast();
  const [paying, setPaying] = useState(false);

  /** Starts (or resumes) the payment session of an unpaid booking and opens the payment page. */
  const continuePayment = async () => {
    setPaying(true);

    try {
      const payment = await api.payments.create(booking.code);
      router.push(routes.payment(payment.orderId));
    } catch (error) {
      setPaying(false);
      showToast(error instanceof Error ? error.message : String(error), 'error');
    }
  };

  return (
    <article className="booking-item">
      <AppImage className="booking-item__image" src={booking.packageImage} width={240} height={160} />
      <div className="booking-item__body">
        <p className="booking-item__code">{booking.code}</p>
        <h3 className="booking-item__title">
          {booking.packageSlug ? <Link href={routes.package(booking.packageSlug)}>{booking.packageTitle}</Link> : booking.packageTitle}
        </h3>
        <ul className="booking-item__facts">
          <li><Icon name="calendar" size={14} />{formatDate(booking.travelDate)}</li>
          <li><Icon name="users" size={14} />{t('success.guests', { count: booking.guests })}</li>
          <li><Icon name="credit-card" size={14} />{formatRupiah(booking.totalPrice)}</li>
        </ul>
        <p className="booking-item__status"><StatusBadge status={booking.status} /> <StatusBadge status={booking.paymentStatus} /></p>
      </div>
      <div className="booking-item__actions">
        {needsPayment(booking) && (
          <Button size="sm" disabled={paying} onClick={continuePayment}>
            <Icon name="credit-card" size={14} />
            {t('myBooking.pay')}
          </Button>
        )}
        <WhatsAppConfirmButton bookingCode={booking.code} variant="compact" />
      </div>
    </article>
  );
}
