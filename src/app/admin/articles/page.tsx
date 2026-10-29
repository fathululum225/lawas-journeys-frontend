import type { Metadata } from 'next';
import { ArticlesTab } from '@/components/admin/tabs/ArticlesTab';

export const metadata: Metadata = { title: 'Articles' };

export default function Page() {
  return <ArticlesTab />;
}
