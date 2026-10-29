import { api } from '@/lib/api';
import { JOURNAL_PAGE_SIZE, journalHref } from '@/lib/journal';
import { translate } from '@/i18n';
import { getLanguage } from '@/i18n/server';
import { ApiErrorState } from '@/components/shared/ApiErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { ArticleRows } from './ArticleRows';

interface ArticleListProps {
  category: string;
  tag: string;
  q: string;
  page: number;
}

export async function ArticleList({ category, tag, q, page }: ArticleListProps) {
  try {
    const { items, meta } = await api.articles.list({ category, tag, q, page, limit: JOURNAL_PAGE_SIZE });

    if (items.length === 0) {
      const language = await getLanguage();
      return (
        <div className="article-list">
          <EmptyState icon="article" title={translate(language, 'journal.empty.title')} text={translate(language, 'journal.empty.text')} />
        </div>
      );
    }

    // Pagination links keep the active filters; the category is part of the path.
    const base = journalHref({ category }).split('?')[0];

    return (
      <>
        <div className="article-list"><ArticleRows articles={items} /></div>
        <Pagination page={meta.page} totalPages={meta.totalPages} path={base} query={{ q, tag }} anchor="latest-title" />
      </>
    );
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}
