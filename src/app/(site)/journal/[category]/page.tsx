import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { api } from '@/lib/api';
import { findCategoryBySlug } from '@/lib/journal';
import type { SearchParams } from '@/lib/search-params';
import { JournalPage } from '@/components/journal/JournalPage';

type Props = { params: Promise<{ category: string }>; searchParams: SearchParams };

/** /journal/travel-guide -> "Travel Guide"; unknown slugs are a 404. */
const resolveCategory = cache(async (slug: string): Promise<string> => {
  const { categories } = await api.articles.categories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) notFound();
  return category.name;
});

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const name = await resolveCategory((await params).category);

  return { title: `${name} | Journal`, description: `Journal stories about ${name.toLowerCase()} in Indonesia.` };
}

export default async function JournalCategoryPage({ params, searchParams }: Props) {
  const category = await resolveCategory((await params).category);

  return <JournalPage category={category} searchParams={await searchParams} />;
}
