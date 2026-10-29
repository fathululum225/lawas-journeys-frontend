'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { activeNavKey, buildNavItems, hasOverlayHeader, type NavItem, type NavLink } from '@/lib/navigation';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/LanguageProvider';
import { buttonClasses } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { Logo } from '@/components/shared/Logo';

const MOBILE_BREAKPOINT = '(max-width: 1080px)';

function useLinkLabel() {
  const { t, term } = useI18n();

  return (link: NavLink): string => {
    if (link.labelKey) return t(link.labelKey);
    if (link.term) return term('taxonomy', link.term);
    return link.text ?? '';
  };
}

function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const close = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isOpen]);

  return (
    <div className={cn('lang-switch', isOpen && 'is-open')} ref={container}>
      <button
        className="lang-switch__button"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('nav.language')}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={`flag flag--${language}`} aria-hidden="true" />
        <span className="lang-switch__code">
          {SUPPORTED_LANGUAGES.map((item, index) => (
            <span key={item.code}>
              {index > 0 && ' | '}
              <span className={item.code === language ? 'is-current' : undefined}>{item.short}</span>
            </span>
          ))}
        </span>
        <Icon name="chevron-down" size={14} />
      </button>
      <ul className="lang-switch__menu">
        {SUPPORTED_LANGUAGES.map((item) => (
          <li key={item.code}>
            <button
              className={cn('lang-switch__option', item.code === language && 'is-current')}
              type="button"
              onClick={() => {
                setIsOpen(false);
                setLanguage(item.code);
              }}
            >
              <span className={`flag flag--${item.code}`} aria-hidden="true" />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccountActions() {
  const { t } = useI18n();
  const { ready, user, isAdmin, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push(routes.home());
  };

  // Nothing is shown until localStorage has been read, so a signed-in visitor never sees
  // the Login / Register buttons flash by.
  if (!ready) return null;

  if (!user) {
    return (
      <>
        <Link className={buttonClasses({ variant: 'outline', size: 'sm', className: 'site-header__login' })} href={routes.login()}>{t('nav.login')}</Link>
        <Link className={buttonClasses({ size: 'sm' })} href={routes.register()}>{t('nav.register')}</Link>
      </>
    );
  }

  return (
    <>
      <Link className="account-chip" href={routes.myBooking()}>
        <Icon name="user" size={16} />
        <span>{user.name.split(' ')[0]}</span>
      </Link>
      {isAdmin && <Link className={buttonClasses({ variant: 'outline', size: 'sm' })} href={routes.admin()}>{t('nav.admin')}</Link>}
      <button className={buttonClasses({ size: 'sm' })} type="button" onClick={handleSignOut}>{t('nav.logout')}</button>
    </>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const labelOf = useLinkLabel();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeKey = activeNavKey(pathname);
  const items: NavItem[] = [
    ...(activeKey === 'home' ? [] : [{ key: 'home', labelKey: 'nav.home', href: routes.home() } satisfies NavItem]),
    ...buildNavItems(),
  ];

  // A new page closes the mobile menu.
  useEffect(() => {
    setIsMenuOpen(false);
    setExpandedKey(null);
  }, [pathname]);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Touch devices have no hover: the first tap on a link with a submenu opens it.
  const handleItemClick = (event: React.MouseEvent, item: NavItem) => {
    if (!item.children || !window.matchMedia(MOBILE_BREAKPOINT).matches || expandedKey === item.key) return;

    event.preventDefault();
    setExpandedKey(item.key);
  };

  return (
    <header className={cn('site-header', hasOverlayHeader(pathname) && 'site-header--overlay', isScrolled && 'is-scrolled')} id="site-header">
      <div className="site-header__inner container">
        <Logo />
        <button
          className="site-header__toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          aria-label={t('nav.menu')}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <Icon name="menu" size={24} />
        </button>
        <nav className={cn('site-nav', isMenuOpen && 'is-open')} id="primary-nav" aria-label={t('nav.primary')}>
          <ul className="site-nav__list">
            {items.map((item) => (
              <li key={item.key} className={cn('site-nav__item', item.children && 'site-nav__item--has-menu', expandedKey === item.key && 'is-expanded')}>
                <Link
                  className={cn('site-nav__link', item.key === activeKey && 'is-active')}
                  href={item.href}
                  aria-current={item.key === activeKey ? 'page' : undefined}
                  onClick={(event) => handleItemClick(event, item)}
                >
                  {labelOf(item)}
                  {item.children && <Icon name="chevron-down" size={14} className="site-nav__chevron" />}
                </Link>
                {item.children && (
                  <ul className="site-nav__menu">
                    {item.children.map((child) => (
                      <li key={child.href}><Link className="site-nav__menu-link" href={child.href}>{labelOf(child)}</Link></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="site-header__actions">
            <LanguageSwitch />
            <AccountActions />
          </div>
        </nav>
      </div>
    </header>
  );
}
