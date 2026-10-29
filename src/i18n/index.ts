/**
 * i18n/index.ts
 * Minimal ID/EN translation, shared by server and client code.
 *   - English is the source language; keys missing from the Indonesian dictionary fall back to it.
 *   - Content that comes from the database (package titles, articles...) is not translated.
 * Dictionaries live in locales.ts. Client components read the active language with useI18n()
 * (providers/LanguageProvider.tsx); the root layout reads it from the cookie (i18n/server.ts).
 */

import { en, id } from './locales';

export type LanguageCode = 'id' | 'en';
export type TranslationKey = keyof typeof en;
export type TranslationParams = Record<string, string | number>;

export const SUPPORTED_LANGUAGES: ReadonlyArray<{ code: LanguageCode; label: string; short: string }> = [
  { code: 'id', label: 'Bahasa Indonesia', short: 'ID' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

const DICTIONARIES: Record<LanguageCode, Partial<Record<string, string>>> = { en, id };

export const isLanguage = (value: unknown): value is LanguageCode => SUPPORTED_LANGUAGES.some((language) => language.code === value);

/** Translates `key`; replaces {placeholders} with the values given in `params`. */
export const translate = (language: LanguageCode, key: string, params: TranslationParams = {}): string => {
  const template = DICTIONARIES[language][key] ?? DICTIONARIES[DEFAULT_LANGUAGE][key] ?? key;

  return template.replace(/\{(\w+)\}/g, (match, name: string) => (params[name] !== undefined ? String(params[name]) : match));
};

/**
 * Translates a database-driven value such as a category or status ("Heritage", "pending").
 * Falls back to the value itself when no translation exists, so new admin-created values still show.
 */
export const translateTerm = (language: LanguageCode, prefix: string, value: string): string => {
  const key = `${prefix}.${value}`;
  const translated = translate(language, key);

  return translated === key ? value : translated;
};
