'use client';

import { routes } from '@/lib/routes';
import { SITE } from '@/lib/config';
import { useI18n } from '@/providers/LanguageProvider';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { PageHero } from '@/components/shared/PageHero';

/** Contact details and the two fastest ways to reach the team. There is no contact form: the backend has no endpoint for one. */
export function ContactPage({ chatUrl }: { chatUrl: string | null }) {
  const { t } = useI18n();
  const { contact } = SITE;

  return (
    <>
      <PageHero compact titleKey="contact.hero.title" textKey="contact.hero.text" />

      <div className="container section section--narrow">
        <Breadcrumb trail={[{ label: t('nav.contact') }]} />

        <div className="form-card">
          <h2 className="form-card__title form-card__title--sm">{t('contact.details')}</h2>
          <ul className="contact-list">
            <li><Icon name="phone" size={18} /><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
            <li><Icon name="mail" size={18} /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li>
              <Icon name="map-pin" size={18} />
              <address>
                {contact.addressLines.map((line) => <span key={line}>{line}<br /></span>)}
              </address>
            </li>
          </ul>
        </div>

        {chatUrl && (
          <div className="form-card">
            <h2 className="form-card__title form-card__title--sm">{t('contact.whatsapp.title')}</h2>
            <p className="form-card__lead">{t('contact.whatsapp.text')}</p>
            <a className="btn btn--whatsapp btn--lg" href={chatUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} />
              {t('whatsapp.text')}
            </a>
          </div>
        )}

        <div className="form-card">
          <h2 className="form-card__title form-card__title--sm">{t('contact.custom.title')}</h2>
          <p className="form-card__lead">{t('contact.custom.text')}</p>
          <ButtonLink variant="outline" href={routes.customTrip()}>
            {t('nav.customTrip')}
            <Icon name="arrow-right" size={16} />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
