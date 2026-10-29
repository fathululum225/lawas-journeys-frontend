import { api } from '@/lib/api';
import { toApiQuery, type PackageFilterValues } from '@/lib/package-filters';
import { getLanguage } from '@/i18n/server';
import { translate } from '@/i18n';
import { ApiErrorState } from '@/components/shared/ApiErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { ResultsHeader } from './ResultsHeader';
import { PackageCard } from './PackageCard';

interface PackageResultsProps {
  filters: PackageFilterValues;
  page: number;
  date: string;
}

/** Heading, grid and pagination of the packages page. Loaded on the server for the current URL. */
export async function PackageResults({ filters, page, date }: PackageResultsProps) {
  try {
    const { items, meta } = await api.packages.list(toApiQuery(filters, page));
    const language = await getLanguage();

    // The chosen date and guest count travel on to the detail page, where they pre-fill the booking form.
    const detailQuery = { date, guests: filters.guests };
    const filterQuery = { ...filters, date };

    return (
      <>
        <ResultsHeader total={meta.total} />
        {items.length === 0 ? (
          <div className="grid grid--packages">
            <EmptyState title={translate(language, 'packages.empty.title')} text={translate(language, 'packages.empty.text')} />
          </div>
        ) : (
          <div className="grid grid--packages">
            {items.map((item) => <PackageCard key={item.id} tourPackage={item} query={detailQuery} />)}
          </div>
        )}
        <Pagination page={meta.page} totalPages={meta.totalPages} path="/packages" query={filterQuery} anchor="result-count" />
      </>
    );
  } catch (error) {
    return (
      <>
        <ResultsHeader />
        <ApiErrorState error={error} />
      </>
    );
  }
}
