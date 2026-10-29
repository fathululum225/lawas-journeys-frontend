'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';

interface AsyncState<T> {
  data: T | null;
  error: ApiError | Error | null;
  loading: boolean;
}

/**
 * Loads data in the browser (for things that need the visitor's login token, which the server
 * does not have). `reload` runs the loader again, e.g. from an error state's "Try again".
 * Pass `enabled: false` to wait, for instance until the session has been read from storage.
 */
export function useAsyncData<T>(load: () => Promise<T>, { enabled = true }: { enabled?: boolean } = {}) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: enabled });
  const loadRef = useRef(load);
  loadRef.current = load;

  const run = useCallback(async () => {
    setState((current) => ({ ...current, error: null, loading: true }));

    try {
      setState({ data: await loadRef.current(), error: null, loading: false });
    } catch (error) {
      setState({ data: null, error: error instanceof Error ? error : new Error(String(error)), loading: false });
    }
  }, []);

  useEffect(() => {
    if (enabled) void run();
  }, [enabled, run]);

  return { ...state, reload: run };
}
