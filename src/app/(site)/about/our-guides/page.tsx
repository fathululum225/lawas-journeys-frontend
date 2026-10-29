import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'Our Guides | About Us',
  description: 'Meet the archaeologists, historians and cultural practitioners who lead every Lawas Journeys trip.',
};

export default function Page() {
  return <AboutPage only="guides" />;
}
