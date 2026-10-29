import type { Metadata } from 'next';
import { BookingsTab } from '@/components/admin/tabs/BookingsTab';

export const metadata: Metadata = { title: 'Bookings' };

export default function Page() {
  return <BookingsTab />;
}
