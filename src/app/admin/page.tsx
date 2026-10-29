import type { Metadata } from 'next';
import { DashboardTab } from '@/components/admin/tabs/DashboardTab';

export const metadata: Metadata = { title: { absolute: 'Dashboard | Lawas Journeys Admin' } };

export default function AdminDashboardPage() {
  return <DashboardTab />;
}
