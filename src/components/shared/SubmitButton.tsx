'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { Button } from './Button';

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'type'> & {
  /** Shows a spinner and "Please wait…", and disables the button. */
  loading?: boolean;
};

/** Submit button with the legacy loading state (spinner + label), for forms that call the API. */
export function SubmitButton({ loading = false, children, className, disabled, ...props }: SubmitButtonProps) {
  const { t } = useI18n();

  return (
    <Button type="submit" className={cn(loading && 'is-loading', className)} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>{t('common.pleaseWait')}</span>
        </>
      ) : children}
    </Button>
  );
}
