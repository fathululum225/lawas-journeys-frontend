'use client';

import { useI18n } from '@/providers/LanguageProvider';
import { Icon, type IconName } from '@/components/shared/Icon';
import type { TranslationKey } from '@/i18n';

const REASONS: Array<{ icon: IconName; titleKey: TranslationKey; textKey: TranslationKey }> = [
  { icon: 'user-guide', titleKey: 'home.why.archaeologist.title', textKey: 'home.why.archaeologist.text' },
  { icon: 'people', titleKey: 'home.why.community.title', textKey: 'home.why.community.text' },
  { icon: 'users', titleKey: 'home.why.smallGroup.title', textKey: 'home.why.smallGroup.text' },
  { icon: 'globe', titleKey: 'home.why.responsible.title', textKey: 'home.why.responsible.text' },
];

export function WhySection() {
  const { t } = useI18n();

  return (
    <section className="section container" aria-labelledby="why-title">
      <h2 className="section__title section__title--center" id="why-title">{t('home.why.title')}</h2>
      <ul className="why-list">
        {REASONS.map((reason) => (
          <li className="why-item" key={reason.icon}>
            <Icon name={reason.icon} size={46} className="why-item__icon" />
            <div>
              <h3 className="why-item__title">{t(reason.titleKey)}</h3>
              <p className="why-item__text">{t(reason.textKey)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
