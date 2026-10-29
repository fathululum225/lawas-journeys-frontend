'use client';

import { api } from '@/lib/api';
import { formNumber, formValue, truncate } from '@/lib/admin';
import type { Destination, DestinationPayload } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { TextAreaField, TextField } from '../fields';
import { CrudTab, type CrudConfig } from '../CrudTab';

const FIELDS = ['name', 'tagline', 'description', 'image', 'sortOrder', 'bestSummary', 'dryMonths', 'dryNote', 'rainyMonths', 'rainyNote'] as const;

const config: CrudConfig<Destination, undefined, DestinationPayload> = {
  singular: 'destination',
  fieldNames: FIELDS,
  load: api.destinations.list,
  columns: () => [
    {
      label: 'Destination',
      render: (row) => (
        <div className="cell-media">
          <AppImage src={row.image} width={64} height={44} />
          <div><strong>{row.name}</strong><span className="cell-sub">{truncate(row.tagline, 50)}</span></div>
        </div>
      ),
    },
    { label: 'Slug', render: (row) => row.slug },
    { label: 'Packages', render: (row) => row.packageCount },
  ],
  renderFields: (item, _context, errors) => {
    const bestTime = item?.bestTime ?? {};

    return (
      <>
        <TextField name="name" label="Name" defaultValue={item?.name} required error={errors.name} />
        <TextField name="tagline" label="Tagline" defaultValue={item?.tagline} placeholder="The heart of Javanese culture" error={errors.tagline} />
        <TextAreaField name="description" label="Description" defaultValue={item?.description} rows={4} error={errors.description} />
        <div className="form__row">
          <TextField name="image" label="Image path" defaultValue={item?.image} placeholder="assets/images/destinations/my-place.jpg" error={errors.image} />
          <TextField name="sortOrder" label="Display order" type="number" min={0} defaultValue={item?.sortOrder ?? 0} hint="Lower numbers appear first." error={errors.sortOrder} />
        </div>
        <h3 className="form__subheading">Best time to visit</h3>
        <TextAreaField name="bestSummary" label="Summary" defaultValue={bestTime.summary} rows={3} error={errors.bestSummary} />
        <div className="form__row">
          <TextField name="dryMonths" label="Dry season months" defaultValue={bestTime.dry?.months} placeholder="May – September" />
          <TextField name="dryNote" label="Dry season note" defaultValue={bestTime.dry?.note} placeholder="Best for outdoor activities" />
        </div>
        <div className="form__row">
          <TextField name="rainyMonths" label="Rainy season months" defaultValue={bestTime.rainy?.months} placeholder="October – April" />
          <TextField name="rainyNote" label="Rainy season note" defaultValue={bestTime.rainy?.note} placeholder="Fewer crowds & lush nature" />
        </div>
      </>
    );
  },
  toPayload: (data) => ({
    name: formValue(data, 'name'),
    tagline: formValue(data, 'tagline'),
    description: formValue(data, 'description'),
    image: formValue(data, 'image'),
    sortOrder: formNumber(data, 'sortOrder'),
    bestTime: {
      summary: formValue(data, 'bestSummary'),
      dry: { months: formValue(data, 'dryMonths'), note: formValue(data, 'dryNote') },
      rainy: { months: formValue(data, 'rainyMonths'), note: formValue(data, 'rainyNote') },
    },
  }),
  api: api.destinations,
  itemLabel: (item) => item.name,
};

export function DestinationsTab() {
  return <CrudTab config={config} />;
}
