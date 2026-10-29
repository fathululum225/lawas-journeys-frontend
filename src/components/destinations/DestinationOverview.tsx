'use client';

import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { Destination } from '@/types';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DestinationCard } from './DestinationCard';

export function DestinationOverview({ destinations }: { destinations: Destination[] }) {
  const { t } = useI18n();

  return (
    <>
      <Breadcrumb trail={[{ label: t('nav.destinations'), href: routes.destinations() }]} />
      <div className="destination-overview">
        <h2 className="destination-overview__title">{t('destinations.overview.title')}</h2>
        <p className="destination-overview__text">{t('destinations.overview.text')}</p>
        <div className="grid grid--overview">
          {destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}
        </div>
      </div>
    </>
  );
}
