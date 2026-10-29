import type { Metadata } from 'next';
import { getDestination } from '@/lib/data';
import { DestinationDetailView } from '@/components/destinations/DestinationDetailView';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await getDestination((await params).slug);

  return {
    title: destination.name,
    description: destination.tagline || destination.description.slice(0, 160),
  };
}

export default async function DestinationPage({ params }: Props) {
  const destination = await getDestination((await params).slug);

  return <DestinationDetailView destination={destination} />;
}
