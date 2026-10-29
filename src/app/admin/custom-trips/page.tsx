import type { Metadata } from 'next';
import { CustomTripsTab } from '@/components/admin/tabs/CustomTripsTab';

export const metadata: Metadata = { title: 'Custom Trips' };

export default function Page() {
  return <CustomTripsTab />;
}
