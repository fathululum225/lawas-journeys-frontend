import type { Attraction } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Icon } from '@/components/shared/Icon';

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <article className="attraction-card">
      <AppImage className="attraction-card__image" src={attraction.image} width={320} height={220} />
      <div className="attraction-card__body">
        <h3 className="attraction-card__name">{attraction.name}</h3>
        <p className="attraction-card__text">{attraction.description}</p>
        <p className="attraction-card__location"><Icon name="map-pin" size={14} /><span>{attraction.location}</span></p>
      </div>
    </article>
  );
}
