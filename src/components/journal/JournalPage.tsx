import { Suspense } from 'react';
import { api } from '@/lib/api';
import { journalHref, sortCategories } from '@/lib/journal';
import { pickPage, pickParam, type ResolvedSearchParams } from '@/lib/search-params';
import { ApiErrorState } from '@/components/shared/ApiErrorState';
import { PageBreadcrumb } from '@/components/shared/PageBreadcrumb';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Skeletons } from '@/components/shared/Skeletons';
import { ArticleList } from './ArticleList';
import { FeaturedStories } from './FeaturedStories';
import { JournalHeading } from './JournalHeading';
import { JournalHero } from './JournalHero';
import { JournalSidebar } from './JournalSidebar';
import { JOURNAL_PAGE_SIZE } from '@/lib/journal';

async function Sidebar({ activeCategory, activeTag, query }: { activeCategory: string; activeTag: string; query: string }) {
  try {
    const [{ categories }, tags] = await Promise.all([api.articles.categories(), api.articles.tags()]);
    return <JournalSidebar categories={sortCategories(categories)} tags={tags} activeCategory={activeCategory} activeTag={activeTag} query={query} />;
  } catch (error) {
    return <ApiErrorState error={error} />;
  }
}

interface JournalPageProps {
  /** Category name from the path, or '' on /journal. */
  category: string;
  searchParams: ResolvedSearchParams;
}

/** Shared by /journal and /journal/[category]: hero, filters sidebar, featured stories and the article list. */
export function JournalPage({ category, searchParams }: JournalPageProps) {
  const tag = pickParam(searchParams, 'tag');
  const q = pickParam(searchParams, 'q').trim();
  const page = pickPage(searchParams);
  const hasFilter = Boolean(category || tag || q);

  return (
    <>
      <JournalHero category={category} query={q} tag={tag} />

      <div className="container page-layout">
        <aside className="page-layout__sidebar" aria-label="Journal filters">
          <Suspense fallback={<Skeletons count={3} variant="row" />}>
            <Sidebar activeCategory={category} activeTag={tag} query={q} />
          </Suspense>
        </aside>

        <div className="page-layout__content">
          <PageBreadcrumb trail={category ? [{ labelKey: 'nav.journal', href: journalHref() }, { label: category }] : [{ labelKey: 'nav.journal' }]} />

          {!hasFilter && (
            <section className="section section--tight" aria-labelledby="featured-title">
              <SectionHeader id="featured-title" titleKey="journal.featured" />
              <Suspense fallback={<div className="grid grid--journal"><Skeletons count={3} /></div>}>
                <FeaturedStories />
              </Suspense>
            </section>
          )}

          <section className="section section--tight" aria-labelledby="latest-title">
            <div className="section__header"><JournalHeading query={q} /></div>
            <Suspense
              key={JSON.stringify([category, tag, q, page])}
              fallback={<div className="article-list"><Skeletons count={JOURNAL_PAGE_SIZE} variant="row" /></div>}
            >
              <ArticleList category={category} tag={tag} q={q} page={page} />
            </Suspense>
          </section>
        </div>
      </div>
    </>
  );
}
