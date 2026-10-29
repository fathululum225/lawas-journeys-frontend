'use client';

import type { TranslationKey } from '@/i18n';
import { useI18n } from '@/providers/LanguageProvider';
import { Breadcrumb } from './Breadcrumb';

export interface PageBreadcrumbItem {
  /** Translated label (dictionary key) or a literal label from the database. */
  labelKey?: TranslationKey;
  label?: string;
  href?: string;
}

/**
 * Breadcrumb for server components: labels are given as dictionary keys (translated here, on the
 * client side of the language boundary) or as literal text such as a package title.
 */
export function PageBreadcrumb({ trail }: { trail: PageBreadcrumbItem[] }) {
  const { t } = useI18n();

  return (
    <Breadcrumb
      trail={trail.map((item) => ({
        label: item.labelKey ? t(item.labelKey) : (item.label ?? ''),
        href: item.href,
      }))}
    />
  );
}
