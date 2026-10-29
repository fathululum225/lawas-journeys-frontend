'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { journalHref } from '@/lib/journal';
import { useI18n } from '@/providers/LanguageProvider';
import { AppImage } from '@/components/shared/AppImage';
import { Icon } from '@/components/shared/Icon';

interface JournalHeroProps {
  /** Category of the list being searched ('' for all articles). */
  category: string;
  query: string;
  tag: string;
}

const SEARCH_DELAY = 400;

/** Journal banner with the article search box. Searching rewrites the URL; the server renders the results. */
export function JournalHero({ category, query, tag }: JournalHeroProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState(query);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSent = useRef(query);

  // Follow the URL when it changes from outside (e.g. "Show all articles").
  useEffect(() => {
    if (query !== lastSent.current) {
      lastSent.current = query;
      setValue(query);
    }
  }, [query]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const search = (text: string) => {
    lastSent.current = text.trim();
    router.replace(journalHref({ category, q: text.trim(), tag }), { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearTimeout(timer.current);
    search(value);
  };

  return (
    <section className="hero">
      <AppImage className="hero__image" src="assets/images/brand/hero-page.svg" width={1600} height={420} priority />
      <div className="hero__content container">
        <h1 className="hero__title">{t('journal.hero.title')}</h1>
        <p className="hero__subtitle">{t('journal.hero.subtitle')}</p>
        <p className="hero__text">{t('journal.hero.text')}</p>
        <form className="hero-search" role="search" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="journal-search-input">{t('journal.search.label')}</label>
          <input
            className="hero-search__input"
            id="journal-search-input"
            name="q"
            type="search"
            autoComplete="off"
            placeholder={t('journal.search.placeholder')}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              clearTimeout(timer.current);
              const next = event.target.value;
              timer.current = setTimeout(() => search(next), SEARCH_DELAY);
            }}
          />
          <button className="hero-search__button" type="submit" aria-label="Search"><Icon name="search" size={18} /></button>
        </form>
      </div>
    </section>
  );
}
