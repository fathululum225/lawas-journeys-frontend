import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Lawas means old in Javanese. We take travellers to the places where Indonesia’s oldest stories still live.',
};

export default function About() {
  return <AboutPage />;
}
