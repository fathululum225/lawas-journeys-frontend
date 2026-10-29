import Link from 'next/link';
import { routes } from '@/lib/routes';
import type { Destination } from '@/types';
import { AppImage } from '@/components/shared/AppImage';

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link className="destination-card" href={routes.destination(destination.slug)}>
      <AppImage className="destination-card__image" src={destination.image} width={480} height={320} />
      <span className="destination-card__body">
        <span className="destination-card__name">{destination.name}</span>
        <span className="destination-card__tagline">{destination.tagline}</span>
      </span>
    </Link>
  );
}
