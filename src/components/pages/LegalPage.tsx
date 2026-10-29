'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import type { TranslationKey } from '@/i18n';

const SITEMAP: Array<{ href: string; label: TranslationKey }> = [
  { href: routes.home(), label: 'nav.home' },
  { href: routes.packages(), label: 'nav.allPackages' },
  { href: routes.destinations(), label: 'nav.destinations' },
  { href: routes.journal(), label: 'nav.journal' },
  { href: routes.customTrip(), label: 'nav.customTrip' },
  { href: routes.about(), label: 'nav.about' },
  { href: routes.myBooking(), label: 'nav.myBooking' },
  { href: routes.contact(), label: 'nav.contact' },
  { href: routes.login(), label: 'nav.login' },
  { href: routes.register(), label: 'nav.register' },
];

export function LegalPage() {
  const { t } = useI18n();

  return (
    <div className="container section prose-layout">
      <h1 className="page-title">{t('legal.title')}</h1>
      <article className="prose" id="terms">
        <h2>{t('footer.terms')}</h2>
        <p>{t('legal.terms.p1')}</p>
        <p>{t('legal.terms.p2')}</p>
      </article>
      <article className="prose" id="privacy">
        <h2>{t('footer.privacy')}</h2>
        <p>{t('legal.privacy.p1')}</p>
      </article>
      <article className="prose" id="sitemap">
        <h2>{t('footer.sitemap')}</h2>
        <ul className="prose__links">
          {SITEMAP.map((item) => <li key={item.href}><Link href={item.href}>{t(item.label)}</Link></li>)}
        </ul>
      </article>
    </div>
  );
}
