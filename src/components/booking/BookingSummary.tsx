import type { ReactNode } from 'react';
import { AppImage } from '@/components/shared/AppImage';

interface BookingSummaryProps {
  image: string | null | undefined;
  title: string;
  rows: Array<{ label: string; value: ReactNode }>;
  total: { label: string; value: ReactNode };
  /** Small note under the list (payment deadline, ...). */
  note?: ReactNode;
}

/** Booking recap shown next to the booking form and the payment methods. */
export function BookingSummary({ image, title, rows, total, note }: BookingSummaryProps) {
  return (
    <aside className="summary">
      <AppImage className="summary__image" src={image} width={480} height={240} priority />
      <div className="summary__body">
        <h2 className="summary__title">{title}</h2>
        <dl className="summary__list">
          {rows.map((row) => (
            <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
          ))}
          <div className="summary__total"><dt>{total.label}</dt><dd>{total.value}</dd></div>
        </dl>
        {note && <p className="form__hint">{note}</p>}
      </div>
    </aside>
  );
}
