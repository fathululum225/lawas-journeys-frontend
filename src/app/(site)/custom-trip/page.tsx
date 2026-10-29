import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CustomTripForm } from '@/components/custom-trip/CustomTripForm';

export const metadata: Metadata = {
  title: 'Custom Trip',
  description: 'Tell us what inspires you and we will design a private heritage journey for you.',
};

export default async function CustomTripPage() {
  // The form still works (without the checkbox lists) if the API cannot be reached for these options.
  const [destinations, categories] = await Promise.all([
    api.destinations.list().catch(() => []),
    api.categories.list().catch(() => []),
  ]);

  return (
    <div className="container section section--narrow">
      <CustomTripForm
        destinations={destinations.map((item) => item.name)}
        interests={categories.filter((item) => item.slug !== 'custom-trip').map((item) => item.name)}
      />
    </div>
  );
}
