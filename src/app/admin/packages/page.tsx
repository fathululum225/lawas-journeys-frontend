import type { Metadata } from 'next';
import { PackagesTab } from '@/components/admin/tabs/PackagesTab';

export const metadata: Metadata = { title: 'Packages' };

export default function Page() {
  return <PackagesTab />;
}
