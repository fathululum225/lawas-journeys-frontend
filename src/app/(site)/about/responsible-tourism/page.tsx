import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'Responsible Tourism | About Us',
  description: 'How we hire locally, keep groups small and support heritage conservation.',
};

export default function Page() {
  return <AboutPage only="responsible" />;
}
