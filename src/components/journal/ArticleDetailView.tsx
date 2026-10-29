'use client';

import Link from 'next/link';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { journalHref } from '@/lib/journal';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { Article } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ButtonLink } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { ArticleCard } from './ArticleCard';

/** Article bodies are plain text; a blank line starts a new paragraph. */
const toParagraphs = (content: string): string[] => content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

export function ArticleDetailView({ article }: { article: Article }) {
  const { t, term, formatDate } = useI18n();
  const showToast = useToast();
  const { isSaved, toggle } = useSavedArticles();
  const saved = isSaved(article.slug);
  const categoryLabel = term('taxonomy', article.category);

  const handleSave = () => {
    showToast(t(toggle(article.slug) ? 'journal.saved' : 'journal.unsaved'), 'info', 2200);
  };

  return (
    <>
      <Breadcrumb
        trail={[
          { label: t('nav.journal'), href: journalHref() },
          { label: categoryLabel, href: journalHref({ category: article.category }) },
          { label: article.title },
        ]}
      />

      <article className="article">
        <header className="article__header">
          <Link className="tag tag--primary" href={journalHref({ category: article.category })}>{categoryLabel}</Link>
          <h1 className="article__title">{article.title}</h1>
          <p className="article__lead">{article.excerpt}</p>
          <p className="article__meta">
            <span><Icon name="user" size={16} />{article.author}</span>
            <span><Icon name="calendar" size={16} />{formatDate(article.publishedAt)}</span>
            <span><Icon name="clock" size={16} />{t('article.minRead', { minutes: article.readMinutes })}</span>
            <button
              className={cn('bookmark-button', saved && 'is-saved')}
              type="button"
              aria-pressed={saved}
              aria-label={t('journal.save')}
              onClick={handleSave}
            >
              <Icon name="bookmark" size={20} />
            </button>
          </p>
        </header>

        <AppImage className="article__image" src={article.image} alt={article.title} width={960} height={540} priority />

        <div className="article__body">
          {toParagraphs(article.content).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>

        {article.tags.length > 0 && (
          <ul className="tag-cloud article__tags">
            {article.tags.map((tag) => (
              <li key={tag}><Link className="tag-cloud__item" href={journalHref({ tag })}>{tag}</Link></li>
            ))}
          </ul>
        )}
      </article>

      {article.related.length > 0 && (
        <section className="section section--tight">
          <h2 className="section__title">{t('article.related')}</h2>
          <div className="grid grid--journal">
            {article.related.map((item) => <ArticleCard key={item.id} article={item} variant="compact" />)}
          </div>
        </section>
      )}

      <div className="cta-banner article__cta">
        <div>
          <h2 className="cta-banner__title">{t('home.cta.title')}</h2>
          <p className="cta-banner__text">{t('home.cta.text')}</p>
        </div>
        <ButtonLink size="lg" href={routes.customTrip()}>
          {t('home.cta.button')}
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </>
  );
}
