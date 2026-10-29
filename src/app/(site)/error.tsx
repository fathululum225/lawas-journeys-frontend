'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/ErrorState';

/** Last-resort error screen for a page whose server render or client code failed. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container section section--narrow">
      <ErrorState message={error.message} onRetry={reset} />
    </div>
  );
}
