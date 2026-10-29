'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { ButtonLink } from '@/components/shared/Button';
import { Icon, type IconName } from '@/components/shared/Icon';

const DESTINATION_ICONS: IconName[] = ['temple', 'archaeology', 'mountain', 'map'];

/** Lists every destination and highlights the one being viewed (read from the URL). */
export function DestinationSidebar({ destinations }: { destinations: Array<{ slug: string; name: string }> }) {
  const { t } = useI18n();
  const activeSlug = useParams<{ slug?: string }>().slug;

  return (
    <>
      <h2 className="sidebar-title">{t('destinations.sidebar.title')}</h2>
      <nav className="side-nav" aria-label={t('destinations.sidebar.title')}>
        <Link className={cn('side-nav__link', !activeSlug && 'is-active')} href={routes.destinations()}>
          <Icon name="home" size={18} />
          <span>{t('destinations.sidebar.all')}</span>
        </Link>
        {destinations.map((destination, index) => (
          <Link
            key={destination.slug}
            className={cn('side-nav__link', destination.slug === activeSlug && 'is-active')}
            href={routes.destination(destination.slug)}
          >
            <Icon name={DESTINATION_ICONS[index % DESTINATION_ICONS.length]} size={18} />
            <span>{destination.name}</span>
            <Icon name="chevron-right" size={14} className="side-nav__chevron" />
          </Link>
        ))}
      </nav>
      <div className="promo-card">
        <Icon name="map" size={56} className="promo-card__icon" />
        <h3 className="promo-card__title">{t('destinations.help.title')}</h3>
        <p className="promo-card__text">{t('destinations.help.text')}</p>
        <ButtonLink href={routes.customTrip()}>
          {t('destinations.help.button')}
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </>
  );
}
