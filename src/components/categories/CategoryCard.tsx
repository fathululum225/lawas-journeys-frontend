'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { Category } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Icon, type IconName } from '@/components/shared/Icon';

const INTEREST_ICONS: Record<string, IconName> = {
  heritage: 'temple',
  archaeology: 'amphora',
  culture: 'mask',
  culinary: 'bowl',
  nature: 'mountain',
  'custom-trip': 'route',
};

/** "Explore by Interest" tile. The custom-trip tile links to the custom trip form. */
export function CategoryCard({ category }: { category: Category }) {
  const { term } = useI18n();
  const href = category.slug === 'custom-trip' ? routes.customTrip() : routes.packages({ category: category.name });

  return (
    <Link className="interest-card" href={href}>
      <AppImage className="interest-card__image" src={category.image} width={320} height={320} />
      <span className="interest-card__content">
        <Icon name={INTEREST_ICONS[category.slug] ?? 'compass'} size={44} className="interest-card__icon" />
        <span className="interest-card__label">{term('taxonomy', category.name)}</span>
      </span>
    </Link>
  );
}
