'use client';

import Link from 'next/link';
import { useId } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { CATEGORY_ICONS, journalHref, sortCategories } from '@/lib/journal';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { ArticleCategories, ArticleTag } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Button, ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

interface JournalSidebarProps {
  categories: ArticleCategories['categories'];
  tags: ArticleTag[];
  activeCategory: string;
  activeTag: string;
  query: string;
}

/** Categories, popular tags, newsletter and "plan a journey" cards. */
export function JournalSidebar({ categories, tags, activeCategory, activeTag, query }: JournalSidebarProps) {
  const { t, term } = useI18n();
  const { email, setEmail, isSubmitting, handleSubmit } = useNewsletter();
  const emailId = useId();

  // The keyword and the tag stay when switching category, like the legacy filters.
  const categoryHref = (category: string) => journalHref({ category, q: query, tag: activeTag });
  const tagHref = (tag: string) => journalHref({ category: activeCategory, q: query, tag: activeTag === tag ? '' : tag });

  return (
    <>
      <h2 className="sidebar-title">{t('journal.categories')}</h2>
      <nav className="side-nav" aria-label="Categories">
        <Link className={cn('side-nav__link', !activeCategory && 'is-active')} href={categoryHref('')}>
          <Icon name="grid" size={18} /><span>{t('journal.allArticles')}</span>
        </Link>
        {sortCategories(categories).map((category) => (
          <Link key={category.name} className={cn('side-nav__link', activeCategory === category.name && 'is-active')} href={categoryHref(category.name)}>
            <Icon name={CATEGORY_ICONS[category.name] ?? 'article'} size={18} /><span>{term('taxonomy', category.name)}</span>
          </Link>
        ))}
      </nav>

      <section className="panel">
        <h2 className="panel__title">{t('journal.popularTags')}</h2>
        <div className="tag-cloud">
          {tags.map(({ tag }) => (
            <Link key={tag} className={cn('tag-cloud__item', activeTag === tag && 'is-active')} href={tagHref(tag)}>{tag}</Link>
          ))}
        </div>
      </section>

      <form className="promo-card" onSubmit={handleSubmit} noValidate>
        <Icon name="mail" size={44} className="promo-card__icon" />
        <h2 className="promo-card__title">{t('journal.stayInspired.title')}</h2>
        <p className="promo-card__text">{t('journal.stayInspired.text')}</p>
        <label className="visually-hidden" htmlFor={emailId}>{t('newsletter.emailLabel')}</label>
        <input
          className="form__control"
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('newsletter.placeholder')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" block disabled={isSubmitting}>{t('newsletter.subscribe')}</Button>
      </form>

      <div className="promo-card promo-card--media">
        <AppImage src="assets/images/brand/plan-journey.svg" width={320} height={240} />
        <div className="promo-card__content">
          <h2 className="promo-card__title">{t('journal.plan.title')}</h2>
          <p className="promo-card__text">{t('journal.plan.text')}</p>
          <ButtonLink variant="outline-primary" block href={routes.customTrip()}>
            <span>{t('journal.plan.button')}</span>
            <Icon name="arrow-right" size={16} />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
