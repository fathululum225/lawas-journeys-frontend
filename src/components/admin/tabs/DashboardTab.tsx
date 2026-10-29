'use client';

import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useI18n } from '@/providers/LanguageProvider';
import type { Booking, DashboardData } from '@/types';
import { ErrorState } from '@/components/shared/ErrorState';
import { Icon, type IconName } from '@/components/shared/Icon';
import { Skeletons } from '@/components/shared/Skeletons';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable, type Column } from '../DataTable';

type Tone = 'primary' | 'warning' | 'success' | 'info' | 'neutral';

const buildStats = (totals: DashboardData['totals']): Array<{ label: string; value: string | number; icon: IconName; tone: Tone }> => [
  { label: 'Total bookings', value: totals.bookings, icon: 'ticket', tone: 'primary' },
  { label: 'Pending bookings', value: totals.pendingBookings, icon: 'clock', tone: 'warning' },
  { label: 'Confirmed bookings', value: totals.confirmedBookings, icon: 'check-circle', tone: 'success' },
  { label: 'Revenue (paid)', value: formatRupiah(totals.revenue), icon: 'credit-card', tone: 'info' },
  { label: 'Packages', value: totals.packages, icon: 'suitcase', tone: 'neutral' },
  { label: 'Destinations', value: totals.destinations, icon: 'map-pin', tone: 'neutral' },
  { label: 'Articles', value: totals.articles, icon: 'article', tone: 'neutral' },
  { label: 'New custom trips', value: totals.newCustomTrips, icon: 'inbox', tone: 'primary' },
];

/** Headline numbers and the latest bookings (GET /api/admin/dashboard). */
export function DashboardTab() {
  const { formatDate } = useI18n();
  const { data, error, loading, reload } = useAsyncData(api.admin.dashboard);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (loading || !data) return <Skeletons count={4} />;

  const columns: Column<Booking>[] = [
    { label: 'Code', render: (row) => <strong>{row.code}</strong> },
    { label: 'Customer', render: (row) => row.customerName },
    { label: 'Package', render: (row) => row.packageTitle },
    { label: 'Trip date', render: (row) => formatDate(row.travelDate) },
    { label: 'Total', className: 'table__number', render: (row) => formatRupiah(row.totalPrice) },
    { label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <div className="stat-grid">
        {buildStats(data.totals).map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-card__icon stat-card__icon--${stat.tone}`}><Icon name={stat.icon} size={22} /></span>
            <div>
              <p className="stat-card__label">{stat.label}</p>
              <p className="stat-card__value">{stat.value}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="card card--padded">
        <h2 className="card__title">Recent bookings</h2>
        <DataTable columns={columns} rows={data.recentBookings} rowKey={(row) => row.id} emptyText="No bookings yet." />
      </section>
    </>
  );
}
