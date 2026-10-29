'use client';

import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/i18n';
import { useI18n } from '@/providers/LanguageProvider';
import { AppImage } from './AppImage';

interface PageHeroProps {
  titleKey: TranslationKey;
  textKey: TranslationKey;
  /** The shorter banner used on the packages page. */
  compact?: boolean;
  /** Replaces the default title (e.g. an article category name). */
  title?: string;
}

/** Banner at the top of listing pages. The header is transparent on top of it. */
export function PageHero({ titleKey, textKey, compact = false, title }: PageHeroProps) {
  const { t } = useI18n();

  return (
    <section className={cn('hero', compact && 'hero--compact')}>
      <AppImage className="hero__image" src="assets/images/brand/hero-page.svg" width={1600} height={compact ? 460 : 420} priority />
      <div className="hero__content container">
        <h1 className="hero__title">{title ?? t(titleKey)}</h1>
        <p className="hero__text">{t(textKey)}</p>
      </div>
    </section>
  );
}
