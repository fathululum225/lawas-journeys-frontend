import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

interface FormGroupProps {
  /** id of the control, for the <label for>. */
  htmlFor: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

/** Label + control + inline error, as the legacy .form__group markup. */
export function FormGroup({ htmlFor, label, error, hint, children }: FormGroupProps) {
  return (
    <div className="form__group">
      <label className="form__label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="form__hint">{hint}</p>}
      {error && <p className="form__error" role="alert" id={`${htmlFor}-error`}>{error}</p>}
    </div>
  );
}

/** Class names of a text control, marked invalid when it has an error. */
export const controlClass = (error?: string): string => cn('form__control', error && 'is-invalid');

/** General error shown at the top of a form (errors that belong to no single field). */
export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="alert alert--danger form__alert" role="alert">
      <Icon name="alert" size={18} />
      <span>{message}</span>
    </div>
  );
}
