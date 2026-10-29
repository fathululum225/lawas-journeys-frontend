'use client';

import { useI18n } from '@/providers/LanguageProvider';

const VARIANTS: Record<string, string> = {
  pending: 'warning',
  unpaid: 'warning',
  confirmed: 'success',
  paid: 'success',
  settlement: 'success',
  cancelled: 'danger',
  failed: 'danger',
  expired: 'danger',
  new: 'info',
  contacted: 'warning',
  quoted: 'info',
  closed: 'neutral',
};

/** Coloured pill for booking, payment and custom-trip statuses. */
export function StatusBadge({ status }: { status: string }) {
  const { term } = useI18n();

  return <span className={`status status--${VARIANTS[status] ?? 'neutral'}`}>{term('status', status)}</span>;
}
