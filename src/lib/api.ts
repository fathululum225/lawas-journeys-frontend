/**
 * api.ts
 * Every request to the backend goes through this file. Components never call fetch() directly,
 * and the browser never talks to the payment gateway or WhatsApp APIs: the backend does.
 *
 * The same client works in server components (public GET requests, no token) and in client
 * components (the stored login token is sent as a Bearer header).
 */

import type {
  Article,
  ArticleCategories,
  ArticlePayload,
  ArticleQuery,
  ArticleSummary,
  ArticleTag,
  AuthResult,
  Booking,
  BookingInput,
  BookingQuery,
  BookingStatus,
  Category,
  CustomTrip,
  CustomTripInput,
  CustomTripStatus,
  DashboardData,
  Destination,
  DestinationDetail,
  DestinationPayload,
  LoginInput,
  PackagePayload,
  PackageQuery,
  Paginated,
  PageMeta,
  PaymentSession,
  RegisterInput,
  TourPackage,
  User,
  WhatsAppConfig,
  WhatsAppNotification,
} from '@/types';
import { API_BASE_URL } from './config';
import { clearSession, getToken } from './session';
import { buildQueryString, type QueryValue } from './utils';

export interface ApiFieldError {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: ApiFieldError[];

  constructor(message: string, { status = 0, errors = [] }: { status?: number; errors?: ApiFieldError[] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** True when the server could not be reached at all (not running, wrong URL, CORS). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  /** Maps validation errors to { fieldName: message } for inline form feedback. */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries(
      this.errors.filter((error) => error.field).map((error) => [error.field as string, error.message]),
    );
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  query?: object;
  body?: unknown;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
  errors?: ApiFieldError[];
}

const NETWORK_ERROR_MESSAGE = 'We could not reach the server. Please make sure the backend is running (npm run dev) and try again.';

/** Sends one request and resolves with the full JSON envelope { data, meta, message }. */
const request = async <T>(path: string, { method = 'GET', query, body }: RequestOptions = {}): Promise<Envelope<T>> => {
  const token = getToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}${buildQueryString(query as Record<string, QueryValue>)}`, {
      method,
      cache: 'no-store',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, { status: 0 });
  }

  const payload = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !payload || payload.success === false) {
    if (response.status === 401 && token) clearSession();

    throw new ApiError(payload?.message || `Request failed (${response.status})`, {
      status: response.status,
      errors: payload?.errors,
    });
  }

  return payload;
};

const list = async <T>(path: string, query?: object): Promise<Paginated<T>> => {
  const { data, meta } = await request<T[]>(path, { query });
  return { items: data, meta: meta as PageMeta };
};

const get = async <T>(path: string, query?: object): Promise<T> => (await request<T>(path, { query })).data;
const send = async <T>(method: Method, path: string, body?: unknown): Promise<T> => (await request<T>(path, { method, body })).data;
const slugPath = (value: string): string => encodeURIComponent(value);

export const api = {
  health: () => get<{ status: string; uptime: number }>('/health'),

  categories: { list: () => get<Category[]>('/categories') },

  packages: {
    list: (query?: PackageQuery) => list<TourPackage>('/packages', query),
    get: (slug: string) => get<TourPackage>(`/packages/${slugPath(slug)}`),
    create: (payload: PackagePayload) => send<TourPackage>('POST', '/packages', payload),
    update: (id: number, payload: PackagePayload) => send<TourPackage>('PUT', `/packages/${id}`, payload),
    remove: (id: number) => send<null>('DELETE', `/packages/${id}`),
  },

  destinations: {
    list: () => get<Destination[]>('/destinations'),
    get: (slug: string) => get<DestinationDetail>(`/destinations/${slugPath(slug)}`),
    create: (payload: DestinationPayload) => send<Destination>('POST', '/destinations', payload),
    update: (id: number, payload: DestinationPayload) => send<Destination>('PUT', `/destinations/${id}`, payload),
    remove: (id: number) => send<null>('DELETE', `/destinations/${id}`),
  },

  articles: {
    list: (query?: ArticleQuery) => list<ArticleSummary>('/articles', query),
    categories: () => get<ArticleCategories>('/articles/categories'),
    tags: () => get<ArticleTag[]>('/articles/tags'),
    get: (slug: string) => get<Article>(`/articles/${slugPath(slug)}`),
    create: (payload: ArticlePayload) => send<Article>('POST', '/articles', payload),
    update: (id: number, payload: ArticlePayload) => send<Article>('PUT', `/articles/${id}`, payload),
    remove: (id: number) => send<null>('DELETE', `/articles/${id}`),
  },

  bookings: {
    create: (payload: BookingInput) => send<Booking>('POST', '/bookings', payload),
    get: (code: string) => get<Booking>(`/bookings/${slugPath(code)}`),
    lookup: (code: string, email: string) => get<Booking>('/bookings/lookup', { code, email }),
    mine: () => get<Booking[]>('/bookings/mine'),
    list: (query?: BookingQuery) => list<Booking>('/bookings', query),
    updateStatus: (code: string, status: BookingStatus) => send<Booking>('PATCH', `/bookings/${slugPath(code)}/status`, { status }),
  },

  payments: {
    create: (bookingCode: string) => send<PaymentSession>('POST', '/payments/create', { bookingCode }),
    get: (orderId: string) => get<PaymentSession>(`/payments/${slugPath(orderId)}`),
    verify: (orderId: string) => send<PaymentSession>('POST', '/payments/verify', { orderId }),
    simulate: (orderId: string, method: string) => send<PaymentSession>('POST', `/payments/${slugPath(orderId)}/simulate`, { method }),
  },

  whatsapp: {
    config: () => get<WhatsAppConfig>('/whatsapp/config'),
    notify: (bookingCode: string) => send<WhatsAppNotification>('POST', '/whatsapp/notify', { bookingCode }),
  },

  customTrips: {
    create: (payload: CustomTripInput) => send<CustomTrip>('POST', '/custom-trips', payload),
    list: () => get<CustomTrip[]>('/custom-trips'),
    updateStatus: (id: number, status: CustomTripStatus) => send<CustomTrip>('PATCH', `/custom-trips/${id}/status`, { status }),
    remove: (id: number) => send<null>('DELETE', `/custom-trips/${id}`),
  },

  auth: {
    register: (payload: RegisterInput) => send<AuthResult>('POST', '/auth/register', payload),
    login: (payload: LoginInput) => send<AuthResult>('POST', '/auth/login', payload),
    me: () => get<User>('/auth/me'),
  },

  newsletter: {
    subscribe: async (email: string): Promise<string> => (await request<null>('/newsletter', { method: 'POST', body: { email } })).message,
  },

  admin: { dashboard: () => get<DashboardData>('/admin/dashboard') },
};
