/**
 * admin.ts
 * Small helpers for the admin panel's forms and tables. Admin screens are English only.
 */

import type { BookingStatus, CustomTripStatus } from '@/types';

export const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled'];
export const TRIP_STATUSES: CustomTripStatus[] = ['new', 'contacted', 'quoted', 'closed'];

export const capitalize = (value: string): string => `${value[0]?.toUpperCase() ?? ''}${value.slice(1)}`;

export const truncate = (text: string | null | undefined, length = 80): string => {
  const value = String(text ?? '');
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
};

export const linesToList = (text: string): string[] => text.split('\n').map((line) => line.trim()).filter(Boolean);

export const commaListToArray = (text: string): string[] => text.split(',').map((item) => item.trim()).filter(Boolean);

/** Empty optional numbers must be omitted (not sent as "") so the API applies its defaults. */
export const toOptionalNumber = (value: string): number | undefined => (value.trim() === '' ? undefined : Number(value));

/** Typed readers for FormData (uncontrolled admin forms). */
export const formValue = (data: FormData, name: string): string => String(data.get(name) ?? '').trim();
export const formRawValue = (data: FormData, name: string): string => String(data.get(name) ?? '');
export const formNumber = (data: FormData, name: string): number | undefined => toOptionalNumber(formValue(data, name));
export const formChecked = (data: FormData, name: string): boolean => data.get(name) !== null;
export const formValues = (data: FormData, name: string): string[] => data.getAll(name).map(String);
