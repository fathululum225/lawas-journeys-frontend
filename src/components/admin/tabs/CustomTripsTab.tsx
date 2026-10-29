'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { capitalize, TRIP_STATUSES } from '@/lib/admin';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { CustomTrip, CustomTripStatus } from '@/types';
import { Button } from '@/components/shared/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorState } from '@/components/shared/ErrorState';
import { Icon } from '@/components/shared/Icon';
import { Modal } from '@/components/shared/Modal';
import { Skeletons } from '@/components/shared/Skeletons';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable, type Column } from '../DataTable';

function TripDetails({ request }: { request: CustomTrip }) {
  const { formatDate, formatDateTime } = useI18n();

  return (
    <dl className="details">
      <div><dt>Name</dt><dd>{request.name}</dd></div>
      <div><dt>Email</dt><dd><a className="link" href={`mailto:${request.email}`}>{request.email}</a></dd></div>
      <div><dt>Phone</dt><dd>{request.phone}</dd></div>
      <div><dt>Destinations</dt><dd>{request.destinations.join(', ') || '—'}</dd></div>
      <div><dt>Interests</dt><dd>{request.interests.join(', ') || '—'}</dd></div>
      <div><dt>Travel date</dt><dd>{request.travelDate ? formatDate(request.travelDate) : 'Flexible'}</dd></div>
      <div><dt>Duration</dt><dd>{request.durationDays ? `${request.durationDays} days` : '—'}</dd></div>
      <div><dt>Guests</dt><dd>{request.guests}</dd></div>
      <div><dt>Budget</dt><dd>{request.budgetRange || '—'}</dd></div>
      <div><dt>Received</dt><dd>{formatDateTime(request.createdAt)}</dd></div>
      <div className="details__wide"><dt>Message</dt><dd>{request.message || '—'}</dd></div>
    </dl>
  );
}

/** Custom trip requests: status workflow, details and delete. */
export function CustomTripsTab() {
  const { formatDate } = useI18n();
  const showToast = useToast();
  const { data, error, reload } = useAsyncData(api.customTrips.list);
  const [viewing, setViewing] = useState<CustomTrip | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomTrip | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data) return <Skeletons count={1} variant="row" />;

  const changeStatus = async (id: number, status: CustomTripStatus) => {
    setUpdating(id);

    try {
      await api.customTrips.updateStatus(id, status);
      showToast(`Request marked as ${status}`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    }

    setUpdating(null);
    await reload();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await api.customTrips.remove(pendingDelete.id);
      showToast('Request deleted', 'success');
      setPendingDelete(null);
      await reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<CustomTrip>[] = [
    { label: 'Received', render: (row) => formatDate(row.createdAt) },
    { label: 'Customer', render: (row) => <><strong>{row.name}</strong><span className="cell-sub">{row.email}</span></> },
    { label: 'Wants', render: (row) => <>{row.destinations.join(', ') || 'Any destination'}<span className="cell-sub">{row.interests.join(', ')}</span></> },
    { label: 'Guests', render: (row) => row.guests },
    { label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      label: 'Update',
      render: (row) => (
        <select
          className="form__control form__control--sm"
          aria-label="Change status"
          value={row.status}
          disabled={updating === row.id}
          onChange={(event) => changeStatus(row.id, event.target.value as CustomTripStatus)}
        >
          {TRIP_STATUSES.map((value) => <option key={value} value={value}>{capitalize(value)}</option>)}
        </select>
      ),
    },
    {
      label: 'Actions',
      className: 'table__actions',
      render: (row) => (
        <>
          <Button variant="ghost" size="sm" className="btn--icon" aria-label="View details" onClick={() => setViewing(row)}><Icon name="eye" size={16} /></Button>
          <Button variant="ghost" size="sm" className="btn--icon text-danger" aria-label="Delete" onClick={() => setPendingDelete(row)}><Icon name="trash" size={16} /></Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="card">
        <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyText="No custom trip requests yet." />
      </div>

      {viewing && (
        <Modal title={`Request from ${viewing.name}`} onClose={() => setViewing(null)}>
          <TripDetails request={viewing} />
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete request?"
          message={`The request from ${pendingDelete.name} will be permanently removed.`}
          confirmLabel="Delete"
          danger
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
