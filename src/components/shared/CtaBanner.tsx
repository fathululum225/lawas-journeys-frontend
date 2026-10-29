'use client';

import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import { AppImage } from './AppImage';
import { ButtonLink } from './Button';
import { Icon } from './Icon';

/** "Your Story. Your Journey." banner that leads to the custom trip form. */
export function CtaBanner() {
  const { t } = useI18n();

  return (
    <section className="section container">
      <div className="cta-banner">
        <AppImage className="cta-banner__art" src="assets/images/brand/cta-art.svg" width={420} height={140} />
        <div>
          <h2 className="cta-banner__title">{t('home.cta.title')}</h2>
          <p className="cta-banner__text">{t('home.cta.text')}</p>
        </div>
        <ButtonLink size="lg" className="cta-banner__action" href={routes.customTrip()}>
          <span>{t('home.cta.button')}</span>
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </section>
  );
}
