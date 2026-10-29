'use client';

import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { ArticleSummary } from '@/types';
import { ArticleCard } from './ArticleCard';

/** The latest-articles list. Bookmarks live in this browser (localStorage), so they are handled here. */
export function ArticleRows({ articles }: { articles: ArticleSummary[] }) {
  const { t } = useI18n();
  const showToast = useToast();
  const { isSaved, toggle } = useSavedArticles();

  const handleToggle = (slug: string) => {
    showToast(t(toggle(slug) ? 'journal.saved' : 'journal.unsaved'), 'info', 2200);
  };

  return (
    <>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="row" saved={isSaved(article.slug)} onToggleSave={handleToggle} />
      ))}
    </>
  );
}
