'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LANGUAGE_COOKIE, STORAGE_KEYS } from '@/lib/config';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  isLanguage,
  translate,
  translateTerm,
  type LanguageCode,
  type TranslationKey,
  type TranslationParams,
} from '@/i18n';

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  /** Translates a dictionary key. */
  t: (key: TranslationKey, params?: TranslationParams) => string;
  /** Translates a database-driven value (category, status...); unknown values are returned as is. */
  term: (prefix: string, value: string) => string;
  formatDate: (isoDate: string | null | undefined, options?: Intl.DateTimeFormatOptions) => string;
  formatDateTime: (isoTimestamp: string | null | undefined) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const writeLanguageCookie = (code: LanguageCode): void => {
  document.cookie = `${LANGUAGE_COOKIE}=${code}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
};

/**
 * The server decides the language (cookie) and passes it down, so server and client render the
 * same text. Switching writes the cookie and refreshes the route; no full page reload is needed.
 */
export function LanguageProvider({ language, children }: { language: LanguageCode; children: ReactNode }) {
  const router = useRouter();

  const setLanguage = useCallback((code: LanguageCode) => {
    if (code === language) return;

    writeLanguageCookie(code);
    router.refresh();
  }, [language, router]);

  // Visitors of the legacy site stored their choice in localStorage: carry it over once.
  useEffect(() => {
    if (document.cookie.includes(`${LANGUAGE_COOKIE}=`)) return;

    try {
      const legacy = window.localStorage.getItem(STORAGE_KEYS.language);
      if (isLanguage(legacy) && legacy !== language) {
        writeLanguageCookie(legacy);
        router.refresh();
      }
    } catch {
      /* storage unavailable: keep the default language */
    }
  }, [language, router]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, params) => translate(language, key, params),
    term: (prefix, termValue) => translateTerm(language, prefix, termValue),
    formatDate: (isoDate, options) => formatDate(isoDate, language, options),
    formatDateTime: (isoTimestamp) => formatDateTime(isoTimestamp, language),
  }), [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <LanguageProvider>');
  return context;
};
