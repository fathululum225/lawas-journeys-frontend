'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { formatRupiah, type QueryValue } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { TourPackage } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { buttonClasses } from '@/components/shared/Button';
import { Icon, type IconName } from '@/components/shared/Icon';
import { Rating } from '@/components/shared/Rating';

interface PackageCardProps {
  tourPackage: TourPackage;
  /**
   * featured: location badge, group type, strike-through price (home, packages)
   * compact:  duration badge, pax range and difficulty (destination page)
   */
  variant?: 'featured' | 'compact';
  /** Appended to the detail link, e.g. the date and guests chosen in the search bar. */
  query?: Record<string, QueryValue>;
}

export function PackageCard({ tourPackage, variant = 'featured', query = {} }: PackageCardProps) {
  const { t, term } = useI18n();
  const detailUrl = routes.package(tourPackage.slug, query);
  const isCompact = variant === 'compact';

  const meta: Array<{ icon: IconName; label: string }> = isCompact
    ? [
      { icon: 'users', label: t('card.pax', { min: tourPackage.minPax, max: tourPackage.maxPax }) },
      { icon: 'mountain', label: term('difficulty', tourPackage.difficulty) },
    ]
    : [
      { icon: 'calendar', label: tourPackage.durationLabel },
      { icon: 'users', label: tourPackage.groupType },
    ];

  return (
    <article className={`package-card package-card--${variant}`}>
      <Link className="package-card__media" href={detailUrl} tabIndex={-1} aria-hidden="true">
        <AppImage src={tourPackage.image} width={480} height={320} />
        <span className="package-card__badge">{isCompact ? tourPackage.durationLabel : tourPackage.destination.name}</span>
      </Link>
      <div className="package-card__body">
        <h3 className="package-card__title"><Link href={detailUrl}>{tourPackage.title}</Link></h3>
        <p className="package-card__categories">{tourPackage.categories.join(' • ')}</p>
        <ul className="package-card__meta">
          {meta.map((item) => (
            <li key={item.icon}><Icon name={item.icon} size={14} /><span>{item.label}</span></li>
          ))}
        </ul>
        <Rating rating={tourPackage.rating} reviewCount={tourPackage.reviewCount} />
        <p className="package-card__price">
          {!isCompact && tourPackage.originalPrice && <s className="package-card__original">{formatRupiah(tourPackage.originalPrice)}</s>}
          <strong className="package-card__amount">{formatRupiah(tourPackage.price)}</strong>
          {isCompact && <span className="package-card__unit">{t('card.perPax')}</span>}
        </p>
        <Link className={buttonClasses({ variant: 'outline', size: 'sm', block: true })} href={detailUrl}>{t('card.viewPackage')}</Link>
      </div>
    </article>
  );
}
