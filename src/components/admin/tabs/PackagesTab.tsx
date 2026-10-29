'use client';

import { api } from '@/lib/api';
import { formChecked, formNumber, formRawValue, formValue, formValues, linesToList, truncate } from '@/lib/admin';
import { formatRupiah } from '@/lib/utils';
import type { Category, Destination, ItineraryDay, PackagePayload, TourPackage } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { CheckboxField, CheckGroup, SelectField, TextAreaField, TextField } from '../fields';
import { CrudTab, type CrudConfig } from '../CrudTab';

const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging'];
const ITINERARY_SEPARATOR = '|';

interface Context {
  destinations: Destination[];
  categories: string[];
}

/** Itinerary is edited as one line per day: "Day title | What happens". */
const itineraryToText = (itinerary: ItineraryDay[] = []): string => itinerary
  .map((day) => `${day.title} ${ITINERARY_SEPARATOR} ${day.description}`)
  .join('\n');

const textToItinerary = (text: string): ItineraryDay[] => linesToList(text).map((line) => {
  const [title, ...rest] = line.split(ITINERARY_SEPARATOR);
  return { title: title.trim(), description: rest.join(ITINERARY_SEPARATOR).trim() };
});

const FIELDS = [
  'title', 'destinationId', 'groupType', 'categories', 'summary', 'description', 'durationDays', 'durationNights', 'difficulty',
  'minPax', 'maxPax', 'rating', 'reviewCount', 'price', 'originalPrice', 'image', 'highlights', 'itinerary', 'includes', 'excludes',
] as const;

const config: CrudConfig<TourPackage, Context, PackagePayload> = {
  singular: 'package',
  fieldNames: FIELDS,
  load: async () => (await api.packages.list({ limit: 100, sort: 'newest' })).items,
  loadContext: async () => {
    const [destinations, categories] = await Promise.all([api.destinations.list(), api.categories.list()]);
    return { destinations, categories: categories.filter((item: Category) => item.slug !== 'custom-trip').map((item) => item.name) };
  },
  columns: () => [
    {
      label: 'Package',
      render: (row) => (
        <div className="cell-media">
          <AppImage src={row.image} width={64} height={44} />
          <div><strong>{row.title}</strong><span className="cell-sub">{truncate(row.categories.join(' • '), 40)}</span></div>
        </div>
      ),
    },
    { label: 'Destination', render: (row) => row.destination.name },
    { label: 'Duration', render: (row) => row.durationLabel },
    { label: 'Price', className: 'table__number', render: (row) => formatRupiah(row.price) },
    { label: 'Rating', render: (row) => `${row.rating.toFixed(1)} (${row.reviewCount})` },
    { label: 'Featured', render: (row) => (row.isFeatured ? <span className="status status--success">Featured</span> : '—') },
  ],
  renderFields: (item, { destinations, categories }, errors) => (
    <>
      <TextField name="title" label="Title" defaultValue={item?.title} required error={errors.title} />
      <div className="form__row">
        <SelectField
          name="destinationId"
          label="Destination"
          defaultValue={item?.destination.id}
          required
          placeholder="Choose a destination"
          options={destinations.map((destination) => ({ value: destination.id, label: destination.name }))}
          error={errors.destinationId}
        />
        <TextField name="groupType" label="Group type" defaultValue={item?.groupType ?? 'Small Group'} error={errors.groupType} />
      </div>
      <CheckGroup name="categories" label="Interests" options={categories} selected={item?.categories} required error={errors.categories} />
      <TextField name="summary" label="Short summary" defaultValue={item?.summary} error={errors.summary} />
      <TextAreaField name="description" label="Description" defaultValue={item?.description} rows={4} error={errors.description} />
      <div className="form__row form__row--3">
        <TextField name="durationDays" label="Days" type="number" min={1} defaultValue={item?.durationDays ?? 3} required error={errors.durationDays} />
        <TextField name="durationNights" label="Nights" type="number" min={0} defaultValue={item?.durationNights ?? 2} required error={errors.durationNights} />
        <SelectField name="difficulty" label="Difficulty" defaultValue={item?.difficulty ?? 'Easy'} options={DIFFICULTIES.map((value) => ({ value, label: value }))} error={errors.difficulty} />
      </div>
      <div className="form__row form__row--3">
        <TextField name="minPax" label="Min guests" type="number" min={1} defaultValue={item?.minPax ?? 2} error={errors.minPax} />
        <TextField name="maxPax" label="Max guests" type="number" min={1} defaultValue={item?.maxPax ?? 10} error={errors.maxPax} />
        <TextField name="rating" label="Rating (0–5)" type="number" min={0} max={5} step={0.1} defaultValue={item?.rating ?? 0} error={errors.rating} />
      </div>
      <div className="form__row form__row--3">
        <TextField name="price" label="Price per person (Rp)" type="number" min={0} defaultValue={item?.price} required error={errors.price} />
        <TextField name="originalPrice" label="Original price (Rp)" type="number" min={0} defaultValue={item?.originalPrice ?? ''} hint="Shown struck through" error={errors.originalPrice} />
        <TextField name="reviewCount" label="Review count" type="number" min={0} defaultValue={item?.reviewCount ?? 0} error={errors.reviewCount} />
      </div>
      <TextField
        name="image"
        label="Image path"
        defaultValue={item?.image}
        placeholder="assets/images/packages/my-package.jpg"
        hint="Path inside the frontend folder (public/images), or a full https:// URL."
        error={errors.image}
      />
      <TextAreaField name="highlights" label="Highlights" defaultValue={item?.highlights?.join('\n')} hint="One per line." error={errors.highlights} />
      <TextAreaField name="itinerary" label="Itinerary" defaultValue={itineraryToText(item?.itinerary)} rows={5} hint="One day per line: Day title | What happens" error={errors.itinerary} />
      <div className="form__row">
        <TextAreaField name="includes" label="Included" defaultValue={item?.includes?.join('\n')} rows={4} hint="One per line." error={errors.includes} />
        <TextAreaField name="excludes" label="Not included" defaultValue={item?.excludes?.join('\n')} rows={4} hint="One per line." error={errors.excludes} />
      </div>
      <CheckboxField name="isFeatured" label="Show in “Featured Journeys” on the home page" defaultChecked={item?.isFeatured} />
    </>
  ),
  toPayload: (data) => ({
    title: formValue(data, 'title'),
    destinationId: formNumber(data, 'destinationId'),
    groupType: formValue(data, 'groupType'),
    categories: formValues(data, 'categories'),
    summary: formValue(data, 'summary'),
    description: formValue(data, 'description'),
    durationDays: formNumber(data, 'durationDays'),
    durationNights: formNumber(data, 'durationNights'),
    difficulty: formValue(data, 'difficulty') as TourPackage['difficulty'],
    minPax: formNumber(data, 'minPax'),
    maxPax: formNumber(data, 'maxPax'),
    rating: formNumber(data, 'rating'),
    reviewCount: formNumber(data, 'reviewCount'),
    price: formNumber(data, 'price'),
    originalPrice: formNumber(data, 'originalPrice'),
    image: formValue(data, 'image'),
    highlights: linesToList(formRawValue(data, 'highlights')),
    itinerary: textToItinerary(formRawValue(data, 'itinerary')),
    includes: linesToList(formRawValue(data, 'includes')),
    excludes: linesToList(formRawValue(data, 'excludes')),
    isFeatured: formChecked(data, 'isFeatured'),
  }),
  api: api.packages,
  itemLabel: (item) => item.title,
};

export function PackagesTab() {
  return <CrudTab config={config} />;
}
