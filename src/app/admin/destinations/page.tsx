import type { Metadata } from 'next';
import { DestinationsTab } from '@/components/admin/tabs/DestinationsTab';

export const metadata: Metadata = { title: 'Destinations' };

export default function Page() {
  return <DestinationsTab />;
}
