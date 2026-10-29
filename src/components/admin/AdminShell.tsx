'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { ADMIN_TABS, adminTitle } from '@/lib/admin-nav';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { Icon } from '@/components/shared/Icon';

/** Sidebar, top bar and content area of the admin panel. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // The mobile menu closes after choosing a section.
  useEffect(() => setMenuOpen(false), [pathname]);

  const activeId = ADMIN_TABS.find((tab) => tab.href === pathname)?.id ?? ADMIN_TABS[0].id;

  return (
    <div className={cn('admin-shell', menuOpen && 'is-menu-open')}>
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-sidebar__brand">
          <p className="logo"><span className="logo__lawas">Lawas</span> <span className="logo__journeys">Journeys</span></p>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {ADMIN_TABS.map((tab) => (
            <Link
              key={tab.id}
              className={cn('admin-nav__link', tab.id === activeId && 'is-active')}
              href={tab.href}
              aria-current={tab.id === activeId ? 'page' : undefined}
            >
              <Icon name={tab.icon} size={18} /><span>{tab.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <a className="admin-nav__link" href={routes.home()} target="_blank" rel="noopener">
            <Icon name="external" size={18} /><span>View website</span>
          </a>
          {user && (
            <div className="admin-user">
              <span className="admin-user__avatar">{user.name[0]?.toUpperCase()}</span>
              <div className="admin-user__meta"><strong>{user.name}</strong><span>{user.email}</span></div>
              <button className="admin-user__logout" type="button" aria-label="Sign out" onClick={signOut}>
                <Icon name="log-out" size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>
            <Icon name="menu" size={22} />
          </button>
          <h1 className="admin-topbar__title">{adminTitle(pathname)}</h1>
        </header>
        <main className="admin-content" id="admin-content">{children}</main>
      </div>
    </div>
  );
}
