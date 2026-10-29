import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'Our Story | About Us',
  description: 'How a group of archaeology graduates in Yogyakarta started guiding small-group heritage journeys.',
};

export default function Page() {
  return <AboutPage only="story" />;
}
