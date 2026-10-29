'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { NO_ERRORS, scrollToFormError, toFormErrors, type FormErrors } from '@/lib/form';
import { routes } from '@/lib/routes';
import { todayIso } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { CustomTripInput } from '@/types';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ButtonLink } from '@/components/shared/Button';
import { controlClass, FormAlert, FormGroup } from '@/components/shared/FormGroup';
import { Icon } from '@/components/shared/Icon';
import { SubmitButton } from '@/components/shared/SubmitButton';

const BUDGET_RANGES = ['< Rp 5.000.000', 'Rp 5.000.000 – 10.000.000', 'Rp 10.000.000 – 20.000.000', '> Rp 20.000.000'];
const FIELDS = ['name', 'email', 'phone', 'destinations', 'interests', 'travelDate', 'durationDays', 'guests', 'budgetRange', 'message'] as const;

interface CustomTripFormProps {
  destinations: string[];
  interests: string[];
}

const toggleValue = (list: string[], value: string): string[] => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

/** Custom trip request: POST /api/custom-trips. After sending, the card is replaced by a thank-you message. */
export function CustomTripForm({ destinations, interests }: CustomTripFormProps) {
  const { t, term } = useI18n();
  const { user } = useAuth();
  const showToast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    durationDays: '',
    guests: '2',
    budgetRange: '',
    message: '',
  });
  const [chosenDestinations, setChosenDestinations] = useState<string[]>([]);
  const [chosenInterests, setChosenInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    setValues((current) => ({ ...current, name: current.name || user.name, email: current.email || user.email }));
  }, [user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setSubmitting(true);

    // Empty optional fields are dropped so the API applies its own defaults.
    const filled = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''));
    const payload = {
      ...filled,
      ...(values.durationDays ? { durationDays: Number(values.durationDays) } : {}),
      ...(values.guests ? { guests: Number(values.guests) } : {}),
      destinations: chosenDestinations,
      interests: chosenInterests,
    } as unknown as CustomTripInput;

    try {
      const response = await api.customTrips.create(payload);
      setSentTo(response.email);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitting(false);

      if (error instanceof ApiError && error.status === 422) {
        setErrors(toFormErrors(error, FIELDS));
        requestAnimationFrame(() => scrollToFormError(formRef.current));
      } else {
        showToast(error instanceof Error ? error.message : String(error), 'error');
      }
    }
  };

  const fieldError = (name: (typeof FIELDS)[number]) => errors.fields[name];

  return (
    <>
      <Breadcrumb trail={[{ label: t('nav.customTrip') }]} />

      <div className="form-card" id="custom-trip-card">
        {sentTo !== null ? (
          <div className="success success--inline">
            <span className="success__icon"><Icon name="check-circle" size={56} /></span>
            <h2 className="success__title">{t('custom.successTitle')}</h2>
            <p className="success__text">{t('custom.successText', { email: sentTo })}</p>
            <div className="success__actions">
              <ButtonLink href={routes.home()}>{t('success.home')}</ButtonLink>
              <ButtonLink variant="outline" href={routes.packages()}>{t('nav.allPackages')}</ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <h1 className="form-card__title">{t('custom.title')}</h1>
            <p className="form-card__lead">{t('custom.lead')}</p>

            <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <FormAlert message={errors.general} />

              <div className="form__row">
                <FormGroup htmlFor="ct-name" label={t('booking.name')} error={fieldError('name')}>
                  <input className={controlClass(fieldError('name'))} id="ct-name" name="name" type="text" autoComplete="name" value={values.name} onChange={handleChange} required />
                </FormGroup>
                <FormGroup htmlFor="ct-email" label={t('booking.email')} error={fieldError('email')}>
                  <input className={controlClass(fieldError('email'))} id="ct-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} required />
                </FormGroup>
              </div>
              <FormGroup htmlFor="ct-phone" label={t('booking.phone')} error={fieldError('phone')}>
                <input className={controlClass(fieldError('phone'))} id="ct-phone" name="phone" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" value={values.phone} onChange={handleChange} required />
              </FormGroup>

              <fieldset className="form__group form__fieldset">
                <legend className="form__label">{t('custom.destinations')}</legend>
                <div className="check-group">
                  {destinations.map((name) => (
                    <label className="check" key={name}>
                      <input type="checkbox" name="destinations" value={name} checked={chosenDestinations.includes(name)} onChange={() => setChosenDestinations((current) => toggleValue(current, name))} />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
                {fieldError('destinations') && <p className="form__error" role="alert">{fieldError('destinations')}</p>}
              </fieldset>
              <fieldset className="form__group form__fieldset">
                <legend className="form__label">{t('custom.interests')}</legend>
                <div className="check-group">
                  {interests.map((name) => (
                    <label className="check" key={name}>
                      <input type="checkbox" name="interests" value={name} checked={chosenInterests.includes(name)} onChange={() => setChosenInterests((current) => toggleValue(current, name))} />
                      <span>{term('taxonomy', name)}</span>
                    </label>
                  ))}
                </div>
                {fieldError('interests') && <p className="form__error" role="alert">{fieldError('interests')}</p>}
              </fieldset>

              <div className="form__row form__row--3">
                <FormGroup
                  htmlFor="ct-date"
                  label={<>{t('booking.date')} <small>({t('common.optional')})</small></>}
                  error={fieldError('travelDate')}
                >
                  <input className={controlClass(fieldError('travelDate'))} id="ct-date" name="travelDate" type="date" min={todayIso()} value={values.travelDate} onChange={handleChange} suppressHydrationWarning />
                </FormGroup>
                <FormGroup htmlFor="ct-days" label={t('custom.days')} error={fieldError('durationDays')}>
                  <input className={controlClass(fieldError('durationDays'))} id="ct-days" name="durationDays" type="number" min={1} max={60} placeholder="5" value={values.durationDays} onChange={handleChange} />
                </FormGroup>
                <FormGroup htmlFor="ct-guests" label={t('booking.guests')} error={fieldError('guests')}>
                  <input className={controlClass(fieldError('guests'))} id="ct-guests" name="guests" type="number" min={1} max={100} value={values.guests} onChange={handleChange} />
                </FormGroup>
              </div>
              <FormGroup htmlFor="ct-budget" label={t('custom.budget')} error={fieldError('budgetRange')}>
                <select className={controlClass(fieldError('budgetRange'))} id="ct-budget" name="budgetRange" value={values.budgetRange} onChange={handleChange}>
                  <option value="">{t('custom.budgetAny')}</option>
                  {BUDGET_RANGES.map((range) => <option key={range} value={range}>{range}</option>)}
                </select>
              </FormGroup>
              <FormGroup htmlFor="ct-message" label={t('custom.message')} error={fieldError('message')}>
                <textarea className={controlClass(fieldError('message'))} id="ct-message" name="message" rows={5} placeholder={t('custom.messagePlaceholder')} value={values.message} onChange={handleChange} />
              </FormGroup>

              <SubmitButton size="lg" loading={submitting}>
                <Icon name="send" size={18} />
                <span>{t('custom.submit')}</span>
              </SubmitButton>
            </form>
          </>
        )}
      </div>
    </>
  );
}
