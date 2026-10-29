'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { BOOKING_STATUSES, capitalize } from '@/lib/admin';
import { formatRupiah } from '@/lib/utils';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { Booking, BookingStatus } from '@/types';
import { ErrorState } from '@/components/shared/ErrorState';
import { Skeletons } from '@/components/shared/Skeletons';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable, type Column } from '../DataTable';
import { PaginationButtons } from '../PaginationButtons';

const PAGE_SIZE = 12;
const SEARCH_DELAY = 350;

/** Filter, search and change a booking's status (pending / confirmed / cancelled). */
export function BookingsTab() {
  const { formatDate } = useI18n();
  const showToast = useToast();
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const { data, error, reload } = useAsyncData(() => api.bookings.list({ status, q, page, limit: PAGE_SIZE }));

  // Re-run the query whenever a filter changes (the first load is done by the hook itself).
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    void reload();
  }, [status, q, page, reload]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setQ(value.trim());
      setPage(1);
    }, SEARCH_DELAY);
  };

  const changeStatus = async (code: string, next: BookingStatus) => {
    setUpdating(code);

    try {
      await api.bookings.updateStatus(code, next);
      showToast(`Booking ${code} marked as ${next}`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    }

    setUpdating(null);
    await reload();
  };

  const columns: Column<Booking>[] = [
    { label: 'Code', render: (row) => <><strong>{row.code}</strong><span className="cell-sub">{formatDate(row.createdAt)}</span></> },
    {
      label: 'Customer',
      render: (row) => <>{row.customerName}<span className="cell-sub">{row.customerEmail}</span><span className="cell-sub">{row.customerPhone}</span></>,
    },
    { label: 'Package', render: (row) => row.packageTitle },
    { label: 'Trip', render: (row) => <>{formatDate(row.travelDate)}<span className="cell-sub">{row.guests} guests</span></> },
    { label: 'Total', className: 'table__number', render: (row) => formatRupiah(row.totalPrice) },
    { label: 'Payment', render: (row) => <StatusBadge status={row.paymentStatus} /> },
    {
      label: 'Status',
      render: (row) => (
        <select
          className="form__control form__control--sm"
          aria-label="Change status"
          value={row.status}
          disabled={updating === row.code}
          onChange={(event) => changeStatus(row.code, event.target.value as BookingStatus)}
        >
          {BOOKING_STATUSES.map((value) => <option key={value} value={value}>{capitalize(value)}</option>)}
        </select>
      ),
    },
  ];

  return (
    <>
      <div className="toolbar">
        <form className="toolbar__filters" onSubmit={(event) => event.preventDefault()} noValidate>
          <input
            className="form__control form__control--sm"
            name="q"
            type="search"
            placeholder="Search code, name or email…"
            aria-label="Search bookings"
            value={searchInput}
            onChange={(event) => handleSearch(event.target.value)}
          />
          <select
            className="form__control form__control--sm"
            name="status"
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as BookingStatus | '');
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {BOOKING_STATUSES.map((value) => <option key={value} value={value}>{capitalize(value)}</option>)}
          </select>
        </form>
        <p className="toolbar__text">{data ? `${data.meta.total} bookings` : ''}</p>
      </div>

      <div className="card">
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {!error && !data && <Skeletons count={1} variant="row" />}
        {!error && data && <DataTable columns={columns} rows={data.items} rowKey={(row) => row.id} emptyText="No bookings match these filters." />}
      </div>
      {data && <PaginationButtons page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />}
    </>
  );
}
