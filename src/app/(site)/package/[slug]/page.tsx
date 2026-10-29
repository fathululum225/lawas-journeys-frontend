import type { Metadata } from 'next';
import { getPackage } from '@/lib/data';
import { assetUrl } from '@/lib/assets';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { PackageDetailView } from '@/components/packages/PackageDetailView';

type Props = { params: Promise<{ slug: string }>; searchParams: SearchParams };

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const tourPackage = await getPackage((await params).slug);

  return {
    title: tourPackage.title,
    description: tourPackage.summary,
    openGraph: {
      title: tourPackage.title,
      description: tourPackage.summary,
      images: [assetUrl(tourPackage.image)],
    },
  };
}

export default async function PackageDetailPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const tourPackage = await getPackage(slug);
  const guests = Number.parseInt(pickParam(query, 'guests'), 10);

  return (
    <div className="container section">
      <PackageDetailView
        tourPackage={tourPackage}
        initialDate={pickParam(query, 'date')}
        initialGuests={Number.isFinite(guests) ? guests : undefined}
      />
    </div>
  );
}
