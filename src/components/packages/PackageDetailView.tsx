'use client';

import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { TourPackage } from '@/types';
import { BookingCard } from '@/components/booking/BookingCard';
import { AppImage } from '@/components/shared/AppImage';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Icon, type IconName } from '@/components/shared/Icon';
import { Rating } from '@/components/shared/Rating';
import { cn } from '@/lib/utils';

function CheckList({ items, icon, modifier }: { items: string[]; icon: IconName; modifier?: string }) {
  return (
    <ul className={cn('check-list', modifier)}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}><Icon name={icon} size={18} /><span>{item}</span></li>
      ))}
    </ul>
  );
}

interface PackageDetailViewProps {
  tourPackage: TourPackage;
  /** Chosen in the home search bar or the package filters; pre-fills the booking form. */
  initialDate?: string;
  initialGuests?: number;
}

export function PackageDetailView({ tourPackage, initialDate, initialGuests }: PackageDetailViewProps) {
  const { t, term } = useI18n();

  return (
    <>
      <Breadcrumb
        trail={[
          { label: t('nav.explore'), href: routes.packages() },
          { label: tourPackage.destination.name, href: routes.packages({ destination: tourPackage.destination.slug }) },
          { label: tourPackage.title },
        ]}
      />

      <div className="detail">
        <div className="detail__main">
          <AppImage className="detail__image" src={tourPackage.image} alt={tourPackage.title} width={960} height={540} priority />
          <p className="detail__tags">
            <span className="badge badge--primary">{tourPackage.destination.name}</span>
            {tourPackage.categories.map((category) => <span key={category} className="tag">{term('taxonomy', category)}</span>)}
          </p>
          <h1 className="detail__title">{tourPackage.title}</h1>
          <div className="detail__facts">
            <Rating rating={tourPackage.rating} reviewCount={tourPackage.reviewCount} />
            <span><Icon name="calendar" size={16} />{tourPackage.durationLabel}</span>
            <span><Icon name="users" size={16} />{t('card.pax', { min: tourPackage.minPax, max: tourPackage.maxPax })}</span>
            <span><Icon name="mountain" size={16} />{term('difficulty', tourPackage.difficulty)}</span>
            <span><Icon name="user-guide" size={16} />{tourPackage.groupType}</span>
          </div>

          <section className="detail__section">
            <h2>{t('detail.overview')}</h2>
            <p className="detail__text">{tourPackage.description}</p>
          </section>

          {tourPackage.highlights.length > 0 && (
            <section className="detail__section">
              <h2>{t('detail.highlights')}</h2>
              <CheckList items={tourPackage.highlights} icon="star" />
            </section>
          )}

          {tourPackage.itinerary.length > 0 && (
            <section className="detail__section">
              <h2>{t('detail.itinerary')}</h2>
              <div className="itinerary">
                {tourPackage.itinerary.map((day, index) => (
                  <details className="itinerary__day" key={`${day.title}-${index}`} open={index === 0}>
                    <summary className="itinerary__summary">
                      <span className="itinerary__badge">{t('detail.day', { number: day.day ?? index + 1 })}</span>
                      <span className="itinerary__title">{day.title}</span>
                      <Icon name="chevron-down" size={18} className="itinerary__chevron" />
                    </summary>
                    <p className="itinerary__text">{day.description}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="detail__section detail__split">
            <div>
              <h2>{t('detail.includes')}</h2>
              <CheckList items={tourPackage.includes} icon="check-circle" modifier="check-list--yes" />
            </div>
            <div>
              <h2>{t('detail.excludes')}</h2>
              <CheckList items={tourPackage.excludes} icon="x" modifier="check-list--no" />
            </div>
          </section>
        </div>

        <div className="detail__side">
          <BookingCard tourPackage={tourPackage} initialDate={initialDate} initialGuests={initialGuests} />
        </div>
      </div>
    </>
  );
}
