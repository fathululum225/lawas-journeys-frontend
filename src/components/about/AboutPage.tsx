'use client';

import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { TranslationKey } from '@/i18n';
import { ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { PageHero } from '@/components/shared/PageHero';

export type AboutSection = 'story' | 'guides' | 'responsible';

const SECTIONS: Array<{ id: AboutSection; title: TranslationKey; paragraphs: TranslationKey[] }> = [
  { id: 'story', title: 'about.story.title', paragraphs: ['about.story.p1', 'about.story.p2'] },
  { id: 'guides', title: 'about.guides.title', paragraphs: ['about.guides.p1', 'about.guides.p2'] },
  { id: 'responsible', title: 'about.responsible.title', paragraphs: ['about.responsible.p1', 'about.responsible.p2'] },
];

/**
 * About Us. /about shows all three sections; /about/our-story, /about/our-guides and
 * /about/responsible-tourism show one each (the `only` prop).
 */
export function AboutPage({ only }: { only?: AboutSection }) {
  const { t } = useI18n();
  const sections = only ? SECTIONS.filter((section) => section.id === only) : SECTIONS;
  const last = sections[sections.length - 1].id;

  return (
    <>
      <PageHero compact titleKey="about.hero.title" textKey="about.hero.text" />

      <div className="container section prose-layout">
        {sections.map((section) => (
          <article className="prose" id={section.id} key={section.id}>
            <h2>{t(section.title)}</h2>
            {section.paragraphs.map((key) => <p key={key}>{t(key)}</p>)}
            {section.id === last && (
              <p>
                <ButtonLink href={routes.packages()}>
                  <span>{t('home.hero.explore')}</span>
                  <Icon name="arrow-right" size={16} />
                </ButtonLink>
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
