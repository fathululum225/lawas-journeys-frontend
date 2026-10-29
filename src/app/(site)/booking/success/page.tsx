import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { routes } from '@/lib/routes';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { BookingSuccessView } from '@/components/booking/BookingSuccessView';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const metadata: Metadata = {
  title: 'Booking confirmation',
  description: 'Your Lawas Journeys booking details.',
  robots: { index: false },
};

export default async function BookingSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const code = pickParam(query, 'code');
  const order = pickParam(query, 'order');

  if (!code) redirect(routes.myBooking());

  // Returning from a hosted gateway page: let the backend refresh the payment state first.
  if (order) await api.payments.verify(order).catch(() => null);

  let booking;
  try {
    booking = await api.bookings.get(code);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <div className="container section section--narrow"><ApiErrorState error={error} /></div>;
  }

  return (
    <div className="container section section--narrow">
      <BookingSuccessView booking={booking} />
    </div>
  );
}
