import { api } from '@/lib/api';
import { DestinationSidebar } from '@/components/destinations/DestinationSidebar';
import { ApiErrorState } from '@/components/shared/ApiErrorState';
import { PageHero } from '@/components/shared/PageHero';

/** Hero and sidebar shared by the overview (/destinations) and every destination page. */
export default async function DestinationsLayout({ children }: { children: React.ReactNode }) {
  let sidebar: React.ReactNode;

  try {
    const destinations = await api.destinations.list();
    sidebar = <DestinationSidebar destinations={destinations.map(({ slug, name }) => ({ slug, name }))} />;
  } catch (error) {
    sidebar = <ApiErrorState error={error} />;
  }

  return (
    <>
      <PageHero titleKey="destinations.hero.title" textKey="destinations.hero.text" />
      <div className="container page-layout">
        <aside className="page-layout__sidebar" aria-label="Destinations">{sidebar}</aside>
        <div className="page-layout__content">{children}</div>
      </div>
    </>
  );
}
