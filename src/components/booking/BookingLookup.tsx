'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { NO_ERRORS, toFormErrors, type FormErrors } from '@/lib/form';
import { useI18n } from '@/providers/LanguageProvider';
import type { Booking } from '@/types';
import { controlClass, FormAlert, FormGroup } from '@/components/shared/FormGroup';
import { Icon } from '@/components/shared/Icon';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { BookingItem } from './BookingItem';

/** Anyone can look up one booking with its code and the email used to book (GET /api/bookings/lookup). */
export function BookingLookup() {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setBooking(null);
    setLoading(true);

    try {
      setBooking(await api.bookings.lookup(code.trim(), email.trim()));
    } catch (error) {
      setErrors(error instanceof ApiError ? toFormErrors(error, ['code', 'email']) : { fields: {}, general: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-card__title form-card__title--sm">{t('myBooking.lookup.title')}</h2>
      <p className="form-card__lead">{t('myBooking.lookup.lead')}</p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormAlert message={errors.general} />
        <div className="form__row">
          <FormGroup htmlFor="lookup-code" label={t('payment.bookingCode')} error={errors.fields.code}>
            <input className={controlClass(errors.fields.code)} id="lookup-code" name="code" type="text" placeholder="LJ-261029-ABCD" autoComplete="off" value={code} onChange={(event) => setCode(event.target.value)} required />
          </FormGroup>
          <FormGroup htmlFor="lookup-email" label={t('booking.email')} error={errors.fields.email}>
            <input className={controlClass(errors.fields.email)} id="lookup-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </FormGroup>
        </div>
        <SubmitButton loading={loading}>
          <Icon name="search" size={16} />
          <span>{t('myBooking.lookup.submit')}</span>
        </SubmitButton>
      </form>
      <div className="booking-list booking-list--result">{booking && <BookingItem booking={booking} />}</div>
    </div>
  );
}
