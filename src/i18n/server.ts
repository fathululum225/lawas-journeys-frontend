import 'server-only';

import { cookies } from 'next/headers';
import { LANGUAGE_COOKIE } from '@/lib/config';
import { DEFAULT_LANGUAGE, isLanguage, type LanguageCode } from './index';

/** Language chosen by the visitor (cookie), for server components and the root layout. */
export const getLanguage = async (): Promise<LanguageCode> => {
  const stored = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
};
