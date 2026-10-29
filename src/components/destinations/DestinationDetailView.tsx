'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { DestinationDetail, Season } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Carousel } from '@/components/shared/Carousel';
import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/Icon';
import { PackageCard } from '@/components/packages/PackageCard';
import { AttractionCard } from './AttractionCard';

function SeasonBlock({ type, season }: { type: 'dry' | 'rainy'; season?: Season }) {
  const { t } = useI18n();

  if (!season?.months && !season?.note) return null;

  return (
    <div className={`season season--${type}`}>
      <Icon name={type === 'dry' ? 'sun' : 'cloud-rain'} size={30} />
      <p>
        <span className="season__name">{t(`destinations.season.${type}`)}</span>
        <span className="season__note">{season.months}</span>
        <span className="season__note">{season.note}</span>
      </p>
    </div>
  );
}

function BestTime({ destination }: { destination: DestinationDetail }) {
  const { t } = useI18n();
  const { summary, dry, rainy } = destination.bestTime ?? {};

  if (!summary && !dry && !rainy) return null;

  return (
    <section className="section section--tight">
      <div className="best-time">
        <Icon name="calendar-days" size={46} className="best-time__icon" />
        <div>
          <h2 className="best-time__title">{t('destinations.bestTime.title', { name: destination.name })}</h2>
          <p className="best-time__text">{summary}</p>
        </div>
        <SeasonBlock type="dry" season={dry} />
        <SeasonBlock type="rainy" season={rainy} />
      </div>
    </section>
  );
}

/** One destination: intro, attractions, recommended packages and best season. */
export function DestinationDetailView({ destination }: { destination: DestinationDetail }) {
  const { t } = useI18n();

  return (
    <>
      <Breadcrumb trail={[{ label: t('nav.destinations'), href: routes.destinations() }, { label: destination.name }]} />

      <div className="destination-intro">
        <div>
          <h1 className="destination-intro__title">{destination.name}</h1>
          <hr className="destination-intro__rule" />
          <p className="destination-intro__text">{destination.description}</p>
        </div>
        <AppImage className="destination-intro__image" src={destination.image} alt={destination.name} width={640} height={360} priority />
      </div>

      <section className="section section--tight">
        <div className="section__header">
          <h2 className="section__title">{t('destinations.attractions')}</h2>
        </div>
        {destination.attractions.length > 0 ? (
          <Carousel>
            {destination.attractions.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} />)}
          </Carousel>
        ) : <EmptyState title={t('destinations.noAttractions')} />}
      </section>

      <section className="section section--tight">
        <div className="section__header">
          <h2 className="section__title">{t('destinations.packages', { name: destination.name })}</h2>
          <Link className="section__link" href={routes.packages({ destination: destination.slug })}>
            {t('destinations.viewPackages')}
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        {destination.packages.length > 0 ? (
          <Carousel columns={4}>
            {destination.packages.map((item) => <PackageCard key={item.id} tourPackage={item} variant="compact" />)}
          </Carousel>
        ) : <EmptyState title={t('destinations.noPackages')} />}
      </section>

      <BestTime destination={destination} />
    </>
  );
}
