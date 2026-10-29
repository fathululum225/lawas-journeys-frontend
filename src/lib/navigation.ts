/**
 * navigation.ts
 * Navigation model shared by the header and the footer. Edit these lists to change the menus.
 */

import type { TranslationKey } from '@/i18n';
import { routes } from './routes';

export const INTEREST_CATEGORIES = ['Heritage', 'Archaeology', 'Culture', 'Culinary', 'Nature'] as const;
export const JOURNAL_CATEGORIES = ['History', 'Archaeology', 'Culture', 'Travel Guide'] as const;
export const DESTINATION_LINKS = [
  { slug: 'yogyakarta', name: 'Yogyakarta' },
  { slug: 'central-java', name: 'Central Java' },
  { slug: 'east-java', name: 'East Java' },
  { slug: 'eastern-indonesia', name: 'Eastern Indonesia' },
] as const;

/** A menu entry whose label is either a translation key or a taxonomy term. */
export interface NavLink {
  href: string;
  /** Dictionary key of the label. */
  labelKey?: TranslationKey;
  /** Database-driven term translated with the "taxonomy" prefix, or shown as is (place names). */
  term?: string;
  /** Literal label that is never translated (destination names). */
  text?: string;
}

export interface NavItem extends NavLink {
  key: 'home' | 'explore' | 'destinations' | 'journal' | 'custom-trip' | 'about' | 'my-booking' | 'contact';
  children?: NavLink[];
}

export const exploreLinks = (): NavLink[] => [
  { labelKey: 'nav.allPackages', href: routes.packages() },
  ...INTEREST_CATEGORIES.map((name) => ({ term: name, href: routes.packages({ category: name }) })),
];

export const destinationLinks = (): NavLink[] => DESTINATION_LINKS.map(({ slug, name }) => ({
  text: name,
  href: routes.destination(slug),
}));

export const journalLinks = (): NavLink[] => JOURNAL_CATEGORIES.map((name) => ({
  term: name,
  href: routes.journalCategory(name),
}));

export const aboutLinks = (): NavLink[] => [
  { labelKey: 'nav.ourStory', href: routes.ourStory() },
  { labelKey: 'nav.ourGuides', href: routes.ourGuides() },
  { labelKey: 'nav.responsibleTourism', href: routes.responsibleTourism() },
];

/** The header menu. "Home" is added by the header itself on every page except the home page. */
export const buildNavItems = (): NavItem[] => [
  { key: 'explore', labelKey: 'nav.explore', href: routes.explore(), children: exploreLinks() },
  { key: 'destinations', labelKey: 'nav.destinations', href: routes.destinations(), children: destinationLinks() },
  { key: 'journal', labelKey: 'nav.journal', href: routes.journal(), children: journalLinks() },
  { key: 'custom-trip', labelKey: 'nav.customTrip', href: routes.customTrip() },
  { key: 'about', labelKey: 'nav.about', href: routes.about(), children: aboutLinks() },
  { key: 'my-booking', labelKey: 'nav.myBooking', href: routes.myBooking() },
  { key: 'contact', labelKey: 'nav.contact', href: routes.contact() },
];

/** Which menu entry is highlighted for a pathname. */
export const activeNavKey = (pathname: string): NavItem['key'] | 'home' | null => {
  if (pathname === '/') return 'home';

  const sections: Array<[string, NavItem['key']]> = [
    ['/explore', 'explore'],
    ['/packages', 'explore'],
    ['/package', 'explore'],
    ['/destinations', 'destinations'],
    ['/journal', 'journal'],
    ['/article', 'journal'],
    ['/custom-trip', 'custom-trip'],
    ['/about', 'about'],
    ['/my-booking', 'my-booking'],
    ['/contact', 'contact'],
  ];

  return sections.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ?? null;
};

/** Pages whose hero starts behind a transparent header. */
const OVERLAY_PREFIXES = ['/explore', '/packages', '/destinations', '/journal', '/about', '/contact'];

export const hasOverlayHeader = (pathname: string): boolean => pathname === '/'
  || OVERLAY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
