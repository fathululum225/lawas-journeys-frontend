'use client';

import { useI18n } from '@/providers/LanguageProvider';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Yes/no dialog. Render it while a decision is pending. */
export function ConfirmDialog({ title, message, confirmLabel, danger = false, busy = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <Modal title={title} size="sm" onClose={onCancel}>
      <p className="modal__message">{message}</p>
      <div className="modal__actions">
        <Button variant="ghost" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy} autoFocus>
          {confirmLabel ?? t('common.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
