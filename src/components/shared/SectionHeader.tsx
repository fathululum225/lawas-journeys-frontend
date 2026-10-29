'use client';

import Link from 'next/link';
import { useI18n } from '@/providers/LanguageProvider';
import type { TranslationKey } from '@/i18n';
import { Icon } from './Icon';

interface SectionHeaderProps {
  id: string;
  titleKey: TranslationKey;
  /** Optional "View all" link on the right. */
  link?: { href: string; labelKey: TranslationKey };
}

export function SectionHeader({ id, titleKey, link }: SectionHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="section__header">
      <h2 className="section__title" id={id}>{t(titleKey)}</h2>
      {link && (
        <Link className="section__link" href={link.href}>
          <span>{t(link.labelKey)}</span>
          <Icon name="arrow-right" size={16} />
        </Link>
      )}
    </div>
  );
}
