import type { Metadata } from 'next';
import { JournalPage } from '@/components/journal/JournalPage';
import type { SearchParams } from '@/lib/search-params';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories about history, archaeology, culture and travel tips from across Indonesia.',
};

export default async function JournalIndexPage({ searchParams }: { searchParams: SearchParams }) {
  return <JournalPage category="" searchParams={await searchParams} />;
}
