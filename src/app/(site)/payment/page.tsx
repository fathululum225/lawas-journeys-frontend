import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { routes } from '@/lib/routes';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { PaymentView } from '@/components/booking/PaymentView';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const metadata: Metadata = {
  title: 'Payment',
  description: 'Choose a payment method to confirm your booking.',
  robots: { index: false },
};

export default async function PaymentPage({ searchParams }: { searchParams: SearchParams }) {
  const order = pickParam(await searchParams, 'order');

  if (!order) redirect(routes.myBooking());

  let payment;
  try {
    payment = await api.payments.get(order);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <div className="container section section--narrow"><ApiErrorState error={error} /></div>;
  }

  // Nothing left to pay: go straight to the confirmation.
  if (payment.booking.paymentStatus === 'paid') redirect(routes.bookingSuccess({ code: payment.booking.code }));

  return (
    <div className="container section section--narrow">
      <PaymentView payment={payment} />
    </div>
  );
}
