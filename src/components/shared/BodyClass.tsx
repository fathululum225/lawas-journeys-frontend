'use client';

import { useEffect } from 'react';

/** Adds a class to <body> while the page is shown (the legacy site set one per page, e.g. page--auth). */
export function BodyClass({ name }: { name: string }) {
  useEffect(() => {
    document.body.classList.add(name);
    return () => document.body.classList.remove(name);
  }, [name]);

  return null;
}
