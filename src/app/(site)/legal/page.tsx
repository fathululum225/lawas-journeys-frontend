import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/LegalPage';

export const metadata: Metadata = {
  title: 'Terms, Privacy & Sitemap',
  description: 'Terms and conditions, privacy policy and sitemap of Lawas Journeys.',
};

export default function Legal() {
  return <LegalPage />;
}
