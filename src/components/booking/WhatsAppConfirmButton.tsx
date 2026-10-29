'use client';

import { useI18n } from '@/providers/LanguageProvider';
import { useWhatsAppConfirm } from '@/hooks/useWhatsAppConfirm';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

interface Props {
  bookingCode: string;
  /** success: large green button; compact: small outline button used in the booking list. */
  variant?: 'success' | 'compact';
}

export function WhatsAppConfirmButton({ bookingCode, variant = 'success' }: Props) {
  const { t } = useI18n();
  const { confirm, pending } = useWhatsAppConfirm();
  const isCompact = variant === 'compact';

  return (
    <Button
      variant={isCompact ? 'outline' : 'whatsapp'}
      size={isCompact ? 'sm' : 'lg'}
      disabled={pending}
      onClick={() => confirm(bookingCode)}
    >
      <Icon name="whatsapp" size={isCompact ? 14 : 20} />
      {isCompact ? t('myBooking.whatsapp') : t('success.whatsapp')}
    </Button>
  );
}
