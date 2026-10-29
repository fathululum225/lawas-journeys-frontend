import { ApiError } from '@/lib/api';
import { ErrorState } from './ErrorState';

/** Server-side bridge: turns a caught error into the (serialisable) props of <ErrorState>. */
export function ApiErrorState({ error }: { error: unknown }) {
  const apiError = error instanceof ApiError ? error : null;

  return <ErrorState message={apiError?.message} isNetworkError={apiError?.isNetworkError ?? false} />;
}
