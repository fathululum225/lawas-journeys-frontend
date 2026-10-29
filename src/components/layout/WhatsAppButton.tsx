'use client';

import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from '@/components/shared/Icon';

/** Floating chat button; the chat URL (number + greeting) comes from the backend. */
export function WhatsAppButton({ chatUrl }: { chatUrl: string }) {
  const { t } = useI18n();

  return (
    <a className="wa-float" href={chatUrl} target="_blank" rel="noopener noreferrer" aria-label={t('whatsapp.label')}>
      <Icon name="whatsapp" size={28} />
      <span className="wa-float__text">{t('whatsapp.text')}</span>
    </a>
  );
}
