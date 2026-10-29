'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { routes } from '@/lib/routes';
import { todayIso } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const MAX_GUESTS = 10;
const DEFAULT_GUESTS = 2;

interface HeroSearchFormProps {
  destinations: Array<{ slug: string; name: string }>;
}

/** Destination / date / guests search. Submitting opens the package list with those filters. */
export function HeroSearchForm({ destinations }: HeroSearchFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(String(DEFAULT_GUESTS));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(routes.packages({ destination, date, guests }));
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <div className="search-bar__field">
        <Icon name="map-pin" size={22} />
        <div>
          <label className="search-bar__label" htmlFor="search-destination">{t('search.destination')}</label>
          <select
            className="search-bar__input"
            id="search-destination"
            name="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          >
            <option value="">{t('search.destinationPlaceholder')}</option>
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </div>
      </div>
      <div className="search-bar__field">
        <Icon name="calendar" size={22} />
        <div>
          <label className="search-bar__label" htmlFor="search-date">{t('search.date')}</label>
          <input
            className="search-bar__input"
            id="search-date"
            name="date"
            type="date"
            min={todayIso()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      <div className="search-bar__field">
        <Icon name="users" size={22} />
        <div>
          <label className="search-bar__label" htmlFor="search-guests">{t('search.guests')}</label>
          <select className="search-bar__input" id="search-guests" name="guests" value={guests} onChange={(event) => setGuests(event.target.value)}>
            {Array.from({ length: MAX_GUESTS }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{t(count === 1 ? 'search.adult' : 'search.adults', { count })}</option>
            ))}
          </select>
        </div>
      </div>
      <Button size="lg" className="search-bar__submit" type="submit">
        <Icon name="search" size={18} />
        <span>{t('search.submit')}</span>
      </Button>
    </form>
  );
}
