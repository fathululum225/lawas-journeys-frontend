'use client';

import Link from 'next/link';
import { aboutLinks, destinationLinks, exploreLinks, journalLinks, type NavLink } from '@/lib/navigation';
import { SITE } from '@/lib/config';
import { routes } from '@/lib/routes';
import { useI18n } from '@/providers/LanguageProvider';
import { Icon } from '@/components/shared/Icon';
import { Logo } from '@/components/shared/Logo';
import { NewsletterStrip } from './NewsletterStrip';

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  const { t, term } = useI18n();
  const labelOf = (link: NavLink) => (link.labelKey ? t(link.labelKey) : link.term ? term('taxonomy', link.term) : link.text ?? '');

  return (
    <div className="site-footer__column">
      <h3 className="site-footer__heading">{title}</h3>
      <ul className="site-footer__links">
        {links.map((link) => <li key={link.href}><Link href={link.href}>{labelOf(link)}</Link></li>)}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  const { contact, social } = SITE;

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo />
            <p className="site-footer__about">{t('footer.about')}</p>
            <ul className="social-links">
              {social.map((item) => (
                <li key={item.label}>
                  <a className="social-links__item" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                    <Icon name={item.icon} size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title={t('nav.explore')} links={exploreLinks()} />
          <FooterColumn title={t('nav.destinations')} links={destinationLinks()} />
          <FooterColumn title={t('nav.journal')} links={journalLinks()} />
          <FooterColumn title={t('nav.about')} links={aboutLinks()} />
          <div className="site-footer__column site-footer__column--single">
            <h3 className="site-footer__heading"><Link href={routes.myBooking()}>{t('nav.myBooking')}</Link></h3>
          </div>
          <div className="site-footer__column site-footer__column--contact" id="contact">
            <h3 className="site-footer__heading">{t('nav.contact')}</h3>
            <ul className="contact-list">
              <li><Icon name="phone" size={18} /><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
              <li><Icon name="mail" size={18} /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li>
                <Icon name="map-pin" size={18} />
                <address>
                  {contact.addressLines.map((line) => <span key={line}>{line}<br /></span>)}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <NewsletterStrip />

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}</p>
          <ul className="site-footer__legal">
            <li><Link href={routes.legal('terms')}>{t('footer.terms')}</Link></li>
            <li><Link href={routes.legal('privacy')}>{t('footer.privacy')}</Link></li>
            <li><Link href={routes.legal('sitemap')}>{t('footer.sitemap')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
