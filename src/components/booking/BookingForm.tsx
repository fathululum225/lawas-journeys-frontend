'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { NO_ERRORS, scrollToFormError, toFormErrors, type FormErrors } from '@/lib/form';
import { routes } from '@/lib/routes';
import { formatRupiah } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { TourPackage } from '@/types';
import { controlClass, FormAlert, FormGroup } from '@/components/shared/FormGroup';
import { Icon } from '@/components/shared/Icon';
import { SubmitButton } from '@/components/shared/SubmitButton';

const FIELDS = ['customerName', 'customerEmail', 'customerPhone', 'travelDate', 'guests', 'notes'] as const;
const MIN_LEAD_DAYS = 1;
const DAY_MS = 86_400_000;

const earliestDate = (): string => new Date(Date.now() + MIN_LEAD_DAYS * DAY_MS).toISOString().slice(0, 10);

export interface BookingDraft {
  travelDate: string;
  guests: number;
}

interface BookingFormProps {
  tourPackage: TourPackage;
  /** Pre-filled from the search bar (?date=...&guests=...). */
  initialDate?: string;
  initialGuests?: number;
  /** Lets the page show a live summary next to the form. */
  onDraftChange?: (draft: BookingDraft) => void;
}

/** Clamps the requested group size to what the package allows. */
export const clampGuests = (requested: number, tourPackage: Pick<TourPackage, 'minPax' | 'maxPax'>): number => (
  Math.min(Math.max(requested || tourPackage.minPax, tourPackage.minPax), tourPackage.maxPax)
);

/**
 * The booking form. Submitting it runs the booking flow:
 *   POST /api/bookings  ->  POST /api/payments/create  ->  /payment?order=...
 */
export function BookingForm({ tourPackage, initialDate = '', initialGuests, onDraftChange }: BookingFormProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const showToast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [values, setValues] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: initialDate,
    guests: String(clampGuests(initialGuests ?? 0, tourPackage)),
    notes: '',
  });

  // Signed-in visitors get their name and email filled in (once the session is read from storage).
  useEffect(() => {
    if (!user) return;

    setValues((current) => ({
      ...current,
      customerName: current.customerName || user.name,
      customerEmail: current.customerEmail || user.email,
    }));
  }, [user]);

  useEffect(() => {
    onDraftChange?.({ travelDate: values.travelDate, guests: Number(values.guests) || 0 });
  }, [values.travelDate, values.guests, onDraftChange]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setSubmitting(true);

    try {
      const booking = await api.bookings.create({
        ...values,
        guests: Number(values.guests),
        packageSlug: tourPackage.slug,
      });
      const payment = await api.payments.create(booking.code);

      router.push(routes.payment(payment.orderId));
    } catch (error) {
      setSubmitting(false);

      if (error instanceof ApiError && error.status === 422) {
        setErrors(toFormErrors(error, FIELDS));
        // Wait for the errors to render before scrolling to them.
        requestAnimationFrame(() => scrollToFormError(formRef.current));
      } else {
        showToast(error instanceof Error ? error.message : String(error), 'error');
      }
    }
  };

  const total = tourPackage.price * (Number(values.guests) || 0);
  const fieldError = (name: (typeof FIELDS)[number]) => errors.fields[name];

  return (
    <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <FormAlert message={errors.general} />

      <FormGroup htmlFor="customerName" label={t('booking.name')} error={fieldError('customerName')}>
        <input
          className={controlClass(fieldError('customerName'))}
          id="customerName"
          name="customerName"
          type="text"
          autoComplete="name"
          value={values.customerName}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup htmlFor="customerEmail" label={t('booking.email')} error={fieldError('customerEmail')}>
        <input
          className={controlClass(fieldError('customerEmail'))}
          id="customerEmail"
          name="customerEmail"
          type="email"
          autoComplete="email"
          value={values.customerEmail}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup htmlFor="customerPhone" label={t('booking.phone')} error={fieldError('customerPhone')}>
        <input
          className={controlClass(fieldError('customerPhone'))}
          id="customerPhone"
          name="customerPhone"
          type="tel"
          autoComplete="tel"
          placeholder="08xxxxxxxxxx"
          value={values.customerPhone}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <div className="form__row">
        <FormGroup htmlFor="travelDate" label={t('booking.date')} error={fieldError('travelDate')}>
          <input
            className={controlClass(fieldError('travelDate'))}
            id="travelDate"
            name="travelDate"
            type="date"
            min={earliestDate()}
            value={values.travelDate}
            onChange={handleChange}
            suppressHydrationWarning
            required
          />
        </FormGroup>
        <FormGroup htmlFor="guests" label={t('booking.guests')} error={fieldError('guests')}>
          <input
            className={controlClass(fieldError('guests'))}
            id="guests"
            name="guests"
            type="number"
            min={tourPackage.minPax}
            max={tourPackage.maxPax}
            value={values.guests}
            onChange={handleChange}
            required
          />
        </FormGroup>
      </div>
      <FormGroup
        htmlFor="notes"
        label={<>{t('booking.notes')} <small>({t('common.optional')})</small></>}
        error={fieldError('notes')}
      >
        <textarea
          className={controlClass(fieldError('notes'))}
          id="notes"
          name="notes"
          rows={3}
          placeholder={t('booking.notesPlaceholder')}
          value={values.notes}
          onChange={handleChange}
        />
      </FormGroup>

      <p className="booking-card__total">
        <span>{t('booking.total')}</span>
        <strong>{formatRupiah(total)}</strong>
      </p>
      <SubmitButton size="lg" block loading={submitting}>
        <Icon name="ticket" size={18} />
        {t('booking.submit')}
      </SubmitButton>
      <p className="form__hint booking-card__note"><Icon name="shield" size={14} />{t('booking.secureNote')}</p>
    </form>
  );
}

