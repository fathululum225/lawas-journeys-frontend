/**
 * admin-nav.ts
 * Sections of the admin panel. Each one is a route under /admin.
 */

import type { IconName } from '@/components/shared/Icon';

export const ADMIN_TABS: Array<{ id: string; label: string; icon: IconName; href: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { id: 'packages', label: 'Packages', icon: 'suitcase', href: '/admin/packages' },
  { id: 'destinations', label: 'Destinations', icon: 'map-pin', href: '/admin/destinations' },
  { id: 'articles', label: 'Articles', icon: 'article', href: '/admin/articles' },
  { id: 'bookings', label: 'Bookings', icon: 'ticket', href: '/admin/bookings' },
  { id: 'custom-trips', label: 'Custom Trips', icon: 'inbox', href: '/admin/custom-trips' },
];

export const adminTitle = (pathname: string): string => (ADMIN_TABS.find((tab) => tab.href === pathname) ?? ADMIN_TABS[0]).label;
