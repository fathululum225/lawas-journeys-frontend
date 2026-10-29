import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { NotFoundView } from '@/components/shared/NotFoundView';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return <SiteShell><NotFoundView /></SiteShell>;
}
