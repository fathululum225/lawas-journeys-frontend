import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPackage } from '@/lib/data';
import { routes } from '@/lib/routes';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { BookingPageView } from '@/components/booking/BookingPageView';

export const metadata: Metadata = {
  title: 'Book your journey',
  description: 'Choose your travel date and group size, then pay securely.',
  robots: { index: false },
};

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const slug = pickParam(query, 'package');

  if (!slug) redirect(routes.packages());

  const tourPackage = await getPackage(slug);
  const guests = Number.parseInt(pickParam(query, 'guests'), 10);

  return (
    <div className="container section section--narrow">
      <BookingPageView
        tourPackage={tourPackage}
        initialDate={pickParam(query, 'date')}
        initialGuests={Number.isFinite(guests) ? guests : undefined}
      />
    </div>
  );
}
