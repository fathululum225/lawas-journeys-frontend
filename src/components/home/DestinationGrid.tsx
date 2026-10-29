import { api } from '@/lib/api';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { ApiErrorState } from '@/components/shared/ApiErrorState';

export const DESTINATION_COUNT = 4;

export async function DestinationGrid() {
  try {
    const destinations = await api.destinations.list();
    return destinations.slice(0, DESTINATION_COUNT).map((destination) => <DestinationCard key={destination.id} destination={destination} />);
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
