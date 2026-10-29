import type { Metadata } from 'next';
import { Suspense } from 'react';
import { routes } from '@/lib/routes';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Skeletons } from '@/components/shared/Skeletons';
import { DestinationGrid, DESTINATION_COUNT } from '@/components/home/DestinationGrid';
import { FEATURED_PACKAGE_COUNT, FeaturedPackages } from '@/components/home/FeaturedPackages';
import { Hero } from '@/components/home/Hero';
import { HeroSearch } from '@/components/home/HeroSearch';
import { HeroSearchForm } from '@/components/home/HeroSearchForm';
import { INTEREST_COUNT, InterestGrid } from '@/components/home/InterestGrid';
import { JOURNAL_ARTICLE_COUNT, JournalGrid } from '@/components/home/JournalGrid';
import { WhySection } from '@/components/home/WhySection';

export const metadata: Metadata = {
  title: { absolute: 'Lawas Journeys | Archaeologist-Led Heritage Tours in Indonesia' },
  description: 'Archaeologist-led heritage journeys across Indonesia: Yogyakarta, Central Java, East Java and Eastern Indonesia.',
};

export default function HomePage() {
  return (
    <>
      <Hero>
        <Suspense fallback={<HeroSearchForm destinations={[]} />}>
          <HeroSearch />
        </Suspense>
      </Hero>

      <section className="section container" aria-labelledby="featured-title">
        <SectionHeader
          id="featured-title"
          titleKey="home.featured.title"
          link={{ href: routes.packages(), labelKey: 'home.featured.link' }}
        />
        <div className="grid grid--featured">
          <Suspense fallback={<Skeletons count={FEATURED_PACKAGE_COUNT} />}>
            <FeaturedPackages />
          </Suspense>
        </div>
      </section>

      <section className="section container" aria-labelledby="interest-title">
        <SectionHeader id="interest-title" titleKey="home.interest.title" />
        <div className="grid grid--interest">
          <Suspense fallback={<Skeletons count={INTEREST_COUNT} variant="tile" />}>
            <InterestGrid />
          </Suspense>
        </div>
      </section>

      <section className="section container" aria-labelledby="destinations-title">
        <SectionHeader
          id="destinations-title"
          titleKey="home.destinations.title"
          link={{ href: routes.destinations(), labelKey: 'home.destinations.link' }}
        />
        <div className="grid grid--destinations">
          <Suspense fallback={<Skeletons count={DESTINATION_COUNT} />}>
            <DestinationGrid />
          </Suspense>
        </div>
      </section>

      <WhySection />

      <section className="section container" aria-labelledby="journal-title">
        <SectionHeader
          id="journal-title"
          titleKey="home.journal.title"
          link={{ href: routes.journal(), labelKey: 'home.journal.link' }}
        />
        <div className="grid grid--journal">
          <Suspense fallback={<Skeletons count={JOURNAL_ARTICLE_COUNT} variant="row" />}>
            <JournalGrid />
          </Suspense>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
