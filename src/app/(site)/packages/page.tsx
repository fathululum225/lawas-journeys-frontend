import type { Metadata } from 'next';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { readFilters, readPage } from '@/lib/package-filters';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { PackageFilters } from '@/components/packages/PackageFilters';
import { PackageResults } from '@/components/packages/PackageResults';
import { ResultsHeader } from '@/components/packages/ResultsHeader';
import { PageBreadcrumb } from '@/components/shared/PageBreadcrumb';
import { PageHero } from '@/components/shared/PageHero';
import { Skeletons } from '@/components/shared/Skeletons';

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Browse archaeologist-led heritage journeys across Indonesia.',
};

/** Options of the destination and interest filters; the page still works (without them) if the API is down. */
async function loadFilterOptions() {
  const [destinations, categories] = await Promise.all([
    api.destinations.list().catch(() => []),
    api.categories.list().catch(() => []),
  ]);

  return {
    destinations: destinations.map(({ slug, name }) => ({ slug, name })),
    categories: categories.filter((item) => item.slug !== 'custom-trip').map(({ name }) => ({ name })),
  };
}

export default async function PackagesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = readFilters(params);
  const page = readPage(params);
  const date = pickParam(params, 'date');
  const options = await loadFilterOptions();

  return (
    <>
      <PageHero compact titleKey="packages.hero.title" textKey="packages.hero.text" />

      <div className="container page-layout">
        <aside className="page-layout__sidebar" aria-label="Filters">
          <PackageFilters destinations={options.destinations} categories={options.categories} values={filters} date={date} />
        </aside>

        <div className="page-layout__content">
          <PageBreadcrumb trail={[{ labelKey: 'nav.allPackages' }]} />
          <Suspense
            key={JSON.stringify([filters, page, date])}
            fallback={(
              <>
                <ResultsHeader />
                <div className="grid grid--packages"><Skeletons count={6} /></div>
              </>
            )}
          >
            <PackageResults filters={filters} page={page} date={date} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
