'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import {
  DEFAULT_FILTERS,
  type FilterField,
  type PackageFilterValues,
} from '@/lib/package-filters';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Button } from '@/components/shared/Button';

const KEYWORD_DELAY = 400;

interface PackageFiltersProps {
  destinations: Array<{ slug: string; name: string }>;
  categories: Array<{ name: string }>;
  /** Filters currently in the URL. */
  values: PackageFilterValues;
  /** Travel date chosen in the home search bar; not a filter, but it travels on to the detail page. */
  date: string;
}

/**
 * Filter sidebar. Every change rewrites the URL (router.replace), and the server renders the
 * matching results, so a filtered list can be shared, bookmarked and reached with the back button.
 */
export function PackageFilters({ destinations, categories, values: urlValues, date }: PackageFiltersProps) {
  const { t, term } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(urlValues);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Remember what this component last put in the URL, to tell its own navigations from outside ones
  // (a navbar link to /packages?category=Culture while this page is already open).
  const urlKey = JSON.stringify(urlValues);
  const lastSent = useRef(urlKey);

  useEffect(() => {
    if (urlKey === lastSent.current) return;

    lastSent.current = urlKey;
    setValues(urlValues);
  }, [urlKey, urlValues]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const apply = (next: PackageFilterValues, nextDate: string) => {
    lastSent.current = JSON.stringify(next);
    startTransition(() => router.replace(routes.packages({ ...next, date: nextDate }), { scroll: false }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = event.target.name as FilterField;
    const next = { ...values, [name]: event.target.value };

    setValues(next);
    clearTimeout(timer.current);

    if (name === 'q') timer.current = setTimeout(() => apply(next, date), KEYWORD_DELAY);
    else apply(next, date);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearTimeout(timer.current);
    apply(values, date);
  };

  const handleReset = () => {
    clearTimeout(timer.current);
    setValues(DEFAULT_FILTERS);
    apply(DEFAULT_FILTERS, '');
  };

  return (
    <form className={cn('filters form', isPending && 'is-pending')} onSubmit={handleSubmit} noValidate aria-busy={isPending}>
      <h2 className="sidebar-title">{t('packages.filter.title')}</h2>

      <div className="form__group">
        <label className="form__label" htmlFor="filter-q">{t('packages.filter.keyword')}</label>
        <input
          className="form__control"
          id="filter-q"
          name="q"
          type="search"
          autoComplete="off"
          placeholder={t('packages.filter.keywordPlaceholder')}
          value={values.q}
          onChange={handleChange}
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="filter-destination">{t('search.destination')}</label>
        <select className="form__control" id="filter-destination" name="destination" value={values.destination} onChange={handleChange}>
          <option value="">{t('packages.filter.anyDestination')}</option>
          {destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="filter-category">{t('packages.filter.interest')}</label>
        <select className="form__control" id="filter-category" name="category" value={values.category} onChange={handleChange}>
          <option value="">{t('packages.filter.anyInterest')}</option>
          {categories.map((item) => <option key={item.name} value={item.name}>{term('taxonomy', item.name)}</option>)}
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="filter-duration">{t('packages.filter.duration')}</label>
        <select className="form__control" id="filter-duration" name="duration" value={values.duration} onChange={handleChange}>
          <option value="">{t('packages.filter.anyDuration')}</option>
          <option value="short">{t('packages.filter.short')}</option>
          <option value="medium">{t('packages.filter.medium')}</option>
          <option value="long">{t('packages.filter.long')}</option>
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="filter-guests">{t('search.guests')}</label>
        <input
          className="form__control"
          id="filter-guests"
          name="guests"
          type="number"
          min={1}
          max={30}
          inputMode="numeric"
          placeholder="2"
          value={values.guests}
          onChange={handleChange}
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="filter-sort">{t('packages.sort.label')}</label>
        <select className="form__control" id="filter-sort" name="sort" value={values.sort} onChange={handleChange}>
          <option value="recommended">{t('packages.sort.recommended')}</option>
          <option value="price_asc">{t('packages.sort.priceAsc')}</option>
          <option value="price_desc">{t('packages.sort.priceDesc')}</option>
          <option value="rating">{t('packages.sort.rating')}</option>
          <option value="duration">{t('packages.sort.duration')}</option>
          <option value="newest">{t('packages.sort.newest')}</option>
        </select>
      </div>
      <Button variant="ghost" block onClick={handleReset}>{t('packages.filter.reset')}</Button>
    </form>
  );
}
