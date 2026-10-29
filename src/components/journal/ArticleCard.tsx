'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { ArticleSummary } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { Icon } from '@/components/shared/Icon';

interface ArticleCardProps {
  article: ArticleSummary;
  /**
   * story:   vertical card with a badge on the image (journal featured carousel)
   * compact: small horizontal card (home "From the Journal")
   * row:     wide horizontal row with a bookmark button (journal latest list)
   */
  variant?: 'story' | 'compact' | 'row';
  /** Row variant only: whether the article is bookmarked, and what the bookmark button does. */
  saved?: boolean;
  onToggleSave?: (slug: string) => void;
}

function ArticleMeta({ article }: { article: ArticleSummary }) {
  const { t, formatDate } = useI18n();

  return (
    <p className="article-meta">
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span aria-hidden="true">•</span>
      <span>{t('article.minRead', { minutes: article.readMinutes })}</span>
    </p>
  );
}

export function ArticleCard({ article, variant = 'story', saved = false, onToggleSave }: ArticleCardProps) {
  const { t } = useI18n();
  const detailUrl = routes.article(article.slug);

  if (variant === 'row') {
    return (
      <article className="article-row">
        <Link className="article-row__media" href={detailUrl} tabIndex={-1} aria-hidden="true">
          <AppImage src={article.image} width={320} height={220} />
        </Link>
        <div className="article-row__body">
          <span className="tag tag--primary">{article.category}</span>
          <h3 className="article-row__title"><Link href={detailUrl}>{article.title}</Link></h3>
          <p className="article-row__excerpt">{article.excerpt}</p>
          <div className="article-row__footer">
            <ArticleMeta article={article} />
            <button
              className={cn('bookmark-button', saved && 'is-saved')}
              type="button"
              aria-pressed={saved}
              aria-label={t('journal.save')}
              onClick={() => onToggleSave?.(article.slug)}
            >
              <Icon name="bookmark" size={18} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  const block = variant === 'compact' ? 'journal-card' : 'story-card';

  return (
    <article className={block}>
      <Link className={`${block}__media`} href={detailUrl} tabIndex={-1} aria-hidden="true">
        <AppImage src={article.image} width={480} height={320} />
        <span className="badge badge--primary">{article.category}</span>
      </Link>
      <div className={`${block}__body`}>
        <h3 className={`${block}__title`}><Link href={detailUrl}>{article.title}</Link></h3>
        <p className={`${block}__excerpt`}>{article.excerpt}</p>
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}
