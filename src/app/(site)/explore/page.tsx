import type { Metadata } from 'next';
import { Suspense } from 'react';
import { routes } from '@/lib/routes';
import { DestinationGrid, DESTINATION_COUNT } from '@/components/home/DestinationGrid';
import { FEATURED_PACKAGE_COUNT, FeaturedPackages } from '@/components/home/FeaturedPackages';
import { INTEREST_COUNT, InterestGrid } from '@/components/home/InterestGrid';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { PageHero } from '@/components/shared/PageHero';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Skeletons } from '@/components/shared/Skeletons';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover Indonesia’s heritage by interest, by destination or through our most loved journeys.',
};

/** Starting point of the "Explore" menu: interests, our favourite journeys and destinations in one place. */
export default function ExplorePage() {
  return (
    <>
      <PageHero compact titleKey="explore.hero.title" textKey="explore.hero.text" />

      <section className="section container" aria-labelledby="interest-title">
        <SectionHeader id="interest-title" titleKey="home.interest.title" />
        <div className="grid grid--interest">
          <Suspense fallback={<Skeletons count={INTEREST_COUNT} variant="tile" />}>
            <InterestGrid />
          </Suspense>
        </div>
      </section>

      <section className="section container" aria-labelledby="featured-title">
        <SectionHeader id="featured-title" titleKey="home.featured.title" link={{ href: routes.packages(), labelKey: 'explore.allPackages' }} />
        <div className="grid grid--featured">
          <Suspense fallback={<Skeletons count={FEATURED_PACKAGE_COUNT} />}>
            <FeaturedPackages />
          </Suspense>
        </div>
      </section>

      <section className="section container" aria-labelledby="destinations-title">
        <SectionHeader id="destinations-title" titleKey="home.destinations.title" link={{ href: routes.destinations(), labelKey: 'home.destinations.link' }} />
        <div className="grid grid--destinations">
          <Suspense fallback={<Skeletons count={DESTINATION_COUNT} />}>
            <DestinationGrid />
          </Suspense>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
