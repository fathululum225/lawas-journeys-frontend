import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { DestinationOverview } from '@/components/destinations/DestinationOverview';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore the most fascinating heritage destinations across Indonesia.',
};

export default async function DestinationsPage() {
  try {
    return <DestinationOverview destinations={await api.destinations.list()} />;
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
