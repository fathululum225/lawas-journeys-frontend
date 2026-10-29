import Link from 'next/link';
import { SITE } from '@/lib/config';
import { routes } from '@/lib/routes';

export function Logo() {
  return (
    <Link className="logo" href={routes.home()} aria-label={SITE.name}>
      <span className="logo__lawas">Lawas</span> <span className="logo__journeys">Journeys</span>
    </Link>
  );
}
