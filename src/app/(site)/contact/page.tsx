import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { ContactPage } from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Lawas Journeys team by phone, email or WhatsApp.',
};

export default async function Contact() {
  const chatUrl = await api.whatsapp.config().then((config) => config.chatUrl).catch(() => null);

  return <ContactPage chatUrl={chatUrl} />;
}
