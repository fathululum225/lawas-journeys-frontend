'use client';

import { useId } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { useI18n } from '@/providers/LanguageProvider';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

/** Newsletter sign-up bar shown above the footer's bottom line. */
export function NewsletterStrip() {
  const { t } = useI18n();
  const { email, setEmail, isSubmitting, handleSubmit } = useNewsletter();
  const inputId = useId();

  return (
    <form className="newsletter-strip" onSubmit={handleSubmit} noValidate>
      <p className="newsletter-strip__text">
        <Icon name="send" size={26} />
        <span>{t('footer.newsletter')}</span>
      </p>
      <div className="newsletter-strip__controls">
        <label className="visually-hidden" htmlFor={inputId}>{t('newsletter.emailLabel')}</label>
        <input
          className="form__control"
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('newsletter.placeholder')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" disabled={isSubmitting}>{t('newsletter.subscribe')}</Button>
      </div>
    </form>
  );
}
