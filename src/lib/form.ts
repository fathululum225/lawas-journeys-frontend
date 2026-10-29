/**
 * form.ts
 * Maps an ApiError to inline form feedback: field errors under their inputs, anything else as one alert.
 */

import { ApiError } from './api';

export interface FormErrors {
  fields: Record<string, string>;
  general?: string;
}

export const NO_ERRORS: FormErrors = { fields: {} };

/**
 * @param knownFields names of the inputs the form renders; errors for other fields (or none at all)
 *                    are shown as a general alert so nothing is lost.
 */
export const toFormErrors = (error: unknown, knownFields: readonly string[]): FormErrors => {
  if (!(error instanceof ApiError)) {
    return { fields: {}, general: error instanceof Error ? error.message : undefined };
  }

  const fieldErrors = error.fieldErrors;
  const fields = Object.fromEntries(Object.entries(fieldErrors).filter(([name]) => knownFields.includes(name)));
  const hasUnmatched = Object.keys(fieldErrors).length !== Object.keys(fields).length;

  return {
    fields,
    general: Object.keys(fieldErrors).length === 0 || hasUnmatched ? error.message : undefined,
  };
};

/** Scrolls the first invalid control (or the alert) of a form into view. */
export const scrollToFormError = (form: HTMLFormElement | null): void => {
  const target = form?.querySelector('.is-invalid') ?? form?.querySelector('.form__alert');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
