'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ApiError } from '@/lib/api';
import { capitalize } from '@/lib/admin';
import { NO_ERRORS, scrollToFormError, toFormErrors, type FormErrors } from '@/lib/form';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/shared/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorState } from '@/components/shared/ErrorState';
import { FormAlert } from '@/components/shared/FormGroup';
import { Icon } from '@/components/shared/Icon';
import { Modal } from '@/components/shared/Modal';
import { Skeletons } from '@/components/shared/Skeletons';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { DataTable, type Column } from './DataTable';

/**
 * Generic "list + modal form" tab used for packages, destinations and articles.
 * Each resource only describes its columns, its form and how a form becomes an API payload.
 */
export interface CrudConfig<T extends { id: number }, Context, Payload> {
  /** Used in buttons and messages, e.g. "package". */
  singular: string;
  load: () => Promise<T[]>;
  /** Lookup data the form needs (destinations, categories...). */
  loadContext?: () => Promise<Context>;
  columns: (context: Context) => Column<T>[];
  renderFields: (item: T | null, context: Context, errors: Record<string, string>) => ReactNode;
  toPayload: (data: FormData) => Payload;
  /** Field names the form renders, so unmatched API errors are shown as a general alert. */
  fieldNames: readonly string[];
  api: {
    create: (payload: Payload) => Promise<unknown>;
    update: (id: number, payload: Payload) => Promise<unknown>;
    remove: (id: number) => Promise<unknown>;
  };
  /** Name shown in the delete confirmation. */
  itemLabel: (item: T) => string;
  /** Fetches the full record when list rows are summaries only. */
  loadDetail?: (item: T) => Promise<T>;
}

interface FormState<T> {
  item: T | null;
}

function CrudForm<T extends { id: number }, Context, Payload>({
  config,
  context,
  item,
  onClose,
  onSaved,
}: {
  config: CrudConfig<T, Context, Payload>;
  context: Context;
  item: T | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const showToast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [saving, setSaving] = useState(false);
  const singular = config.singular;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(NO_ERRORS);
    setSaving(true);

    try {
      const payload = config.toPayload(new FormData(event.currentTarget));
      if (item) await config.api.update(item.id, payload);
      else await config.api.create(payload);

      showToast(`${capitalize(singular)} ${item ? 'updated' : 'created'}`, 'success');
      onSaved();
    } catch (error) {
      setSaving(false);

      if (error instanceof ApiError && error.status === 422) {
        setErrors(toFormErrors(error, config.fieldNames));
        requestAnimationFrame(() => scrollToFormError(formRef.current));
      } else {
        showToast(error instanceof Error ? error.message : String(error), 'error');
      }
    }
  };

  return (
    <Modal title={item ? `Edit ${singular}` : `Add ${singular}`} size="lg" onClose={onClose}>
      <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
        <FormAlert message={errors.general} />
        {config.renderFields(item, context, errors.fields)}
        <div className="form__actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <SubmitButton loading={saving}>{item ? 'Save changes' : `Create ${singular}`}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
}

export function CrudTab<T extends { id: number }, Context, Payload>({ config }: { config: CrudConfig<T, Context, Payload> }) {
  const showToast = useToast();
  const context = useAsyncData(async () => (config.loadContext ? config.loadContext() : (undefined as Context)));
  const list = useAsyncData(config.load, { enabled: !context.loading && !context.error });
  const [form, setForm] = useState<FormState<T> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const singular = config.singular;

  if (context.error) return <ErrorState message={context.error.message} onRetry={context.reload} />;
  if (context.loading || (!list.data && !list.error)) return <Skeletons count={1} variant="row" />;

  const rows = list.data ?? [];
  const ctx = context.data as Context;

  const openEdit = async (item: T) => {
    if (!config.loadDetail) {
      setForm({ item });
      return;
    }

    try {
      setForm({ item: await config.loadDetail(item) });
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await config.api.remove(pendingDelete.id);
      showToast(`${capitalize(singular)} deleted`, 'success');
      setPendingDelete(null);
      await list.reload();
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<T>[] = [
    ...config.columns(ctx),
    {
      label: 'Actions',
      className: 'table__actions',
      render: (row) => (
        <>
          <Button variant="ghost" size="sm" className="btn--icon" aria-label="Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></Button>
          <Button variant="ghost" size="sm" className="btn--icon text-danger" aria-label="Delete" onClick={() => setPendingDelete(row)}><Icon name="trash" size={16} /></Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="toolbar">
        <p className="toolbar__text">{rows.length} {rows.length === 1 ? singular : `${singular}s`}</p>
        <Button onClick={() => setForm({ item: null })}><Icon name="plus" size={16} />Add {singular}</Button>
      </div>

      <div className="card">
        {list.error
          ? <ErrorState message={list.error.message} onRetry={list.reload} />
          : <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} emptyText={`No ${singular}s yet. Add the first one.`} />}
      </div>

      {form && (
        <CrudForm
          config={config}
          context={ctx}
          item={form.item}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            void list.reload();
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete ${singular}?`}
          message={`"${config.itemLabel(pendingDelete)}" will be permanently removed.`}
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
