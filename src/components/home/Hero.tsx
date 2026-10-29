'use client';

import type { ReactNode } from 'react';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import { AppImage } from '@/components/shared/AppImage';
import { ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

/** Home hero: headline, two calls to action and (as children) the search bar that straddles its bottom edge. */
export function Hero({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <section className="hero hero--home">
      <AppImage className="hero__image" src="assets/images/brand/borobudurhome.svg" width={1600} height={760} priority />
      <div className="hero__content container">
        <h1 className="hero__title">{t('home.hero.title')}</h1>
        <p className="hero__text">{t('home.hero.text')}</p>
        <div className="hero__actions">
          <ButtonLink size="lg" href={routes.packages()}>
            <span>{t('home.hero.explore')}</span>
            <Icon name="arrow-right" size={16} />
          </ButtonLink>
          <ButtonLink variant="outline" size="lg" href={routes.customTrip()}>
            <span>{t('home.hero.custom')}</span>
            <Icon name="arrow-right" size={16} />
          </ButtonLink>
        </div>
      </div>
      <div className="hero__search container">{children}</div>
    </section>
  );
}
