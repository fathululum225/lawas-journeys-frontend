import 'server-only';

import { cache } from 'react';
import { notFound } from 'next/navigation';
import { api, ApiError } from './api';

/**
 * Server-side loaders shared by a page and its generateMetadata(). React's cache() makes the two
 * calls share one request to the backend per render.
 */

/** Turns a 404 from the API into Next's not-found page; other errors are rethrown. */
const orNotFound = async <T>(load: Promise<T>): Promise<T> => {
  try {
    return await load;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

export const getPackage = cache((slug: string) => orNotFound(api.packages.get(slug)));
export const getDestination = cache((slug: string) => orNotFound(api.destinations.get(slug)));
export const getArticle = cache((slug: string) => orNotFound(api.articles.get(slug)));
