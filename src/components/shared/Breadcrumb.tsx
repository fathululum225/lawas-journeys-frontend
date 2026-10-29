'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Home icon followed by the trail; the last item is the current page and is not a link. */
export function Breadcrumb({ trail }: { trail: BreadcrumbItem[] }) {
  const { t } = useI18n();

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link className="breadcrumb__home" href={routes.home()} aria-label={t('nav.home')}>
        <Icon name="home" size={16} />
      </Link>
      {trail.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          <Icon name="chevron-right" size={14} className="breadcrumb__separator" />
          {item.href && index < trail.length - 1
            ? <Link className="breadcrumb__link" href={item.href}>{item.label}</Link>
            : <span className="breadcrumb__current" aria-current="page">{item.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
