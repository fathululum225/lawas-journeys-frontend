import type { Metadata } from 'next';
import { MyBookingPage } from '@/components/booking/MyBookingPage';

export const metadata: Metadata = {
  title: 'My Booking',
  description: 'Track your reservations, finish a pending payment or confirm your trip on WhatsApp.',
  robots: { index: false },
};

export default function MyBooking() {
  return (
    <div className="container section section--narrow">
      <MyBookingPage />
    </div>
  );
}
