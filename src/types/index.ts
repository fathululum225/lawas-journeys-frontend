/**
 * types/index.ts
 * Shapes of the JSON returned by the Express backend (see backend/models/*.model.js).
 */

export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface ItineraryDay {
  day?: number;
  title: string;
  description: string;
}

export interface TourPackage {
  id: number;
  slug: string;
  title: string;
  destination: { id: number; slug: string; name: string };
  categories: string[];
  summary: string;
  description: string;
  durationDays: number;
  durationNights: number;
  durationLabel: string;
  groupType: string;
  minPax: number;
  maxPax: number;
  difficulty: Difficulty;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface Season {
  months: string;
  note: string;
}

export interface BestTime {
  summary?: string;
  dry?: Season;
  rainy?: Season;
}

export interface Destination {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  bestTime: BestTime;
  sortOrder: number;
  packageCount: number;
}

export interface Attraction {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

export interface DestinationDetail extends Destination {
  attractions: Attraction[];
  packages: TourPackage[];
}

export interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  tags: string[];
  readMinutes: number;
  isFeatured: boolean;
  publishedAt: string;
}

export interface Article extends ArticleSummary {
  content: string;
  related: ArticleSummary[];
}

export interface ArticleCategories {
  total: number;
  categories: Array<{ name: string; count: number }>;
}

export interface ArticleTag {
  tag: string;
  count: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

export interface Booking {
  id: number;
  code: string;
  packageId: number;
  packageTitle: string;
  packageSlug: string | null;
  packageImage: string | null;
  userId: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  guests: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  group: string;
  label: string;
}

export type GatewayStatus = 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';

export interface PaymentSession {
  orderId: string;
  status: GatewayStatus;
  paymentType: string | null;
  amount: number;
  provider: string;
  mode: string;
  simulated: boolean;
  clientKey: string | null;
  snapToken: string | null;
  redirectUrl: string | null;
  expiresAt: string;
  paidAt: string | null;
  methods: PaymentMethod[];
  booking: {
    code: string;
    packageTitle: string;
    packageImage: string | null;
    travelDate: string;
    guests: number;
    totalPrice: number;
    customerName: string;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
  };
}

export interface WhatsAppConfig {
  provider: string;
  number: string;
  greeting: string;
  chatUrl: string;
}

export interface WhatsAppNotification {
  channel: string;
  delivered: boolean;
  url: string;
  message: string;
}

export type CustomTripStatus = 'new' | 'contacted' | 'quoted' | 'closed';

export interface CustomTrip {
  id: number;
  name: string;
  email: string;
  phone: string;
  destinations: string[];
  interests: string[];
  travelDate: string | null;
  durationDays: number | null;
  guests: number;
  budgetRange: string | null;
  message: string | null;
  status: CustomTripStatus;
  createdAt: string;
}

export interface DashboardData {
  totals: {
    bookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    revenue: number;
    packages: number;
    destinations: number;
    articles: number;
    newCustomTrips: number;
    subscribers: number;
  };
  recentBookings: Booking[];
}

/* ---- Request payloads ------------------------------------------------------- */

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface BookingInput {
  packageSlug?: string;
  packageId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  guests: number;
  notes?: string;
}

export interface CustomTripInput {
  name: string;
  email: string;
  phone: string;
  destinations: string[];
  interests: string[];
  travelDate?: string;
  durationDays?: number;
  guests?: number;
  budgetRange?: string;
  message?: string;
}

export interface PackageQuery {
  q?: string;
  destination?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  minDays?: number | string;
  maxDays?: number | string;
  guests?: number | string;
  featured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'duration' | 'newest';
  page?: number | string;
  limit?: number | string;
}

export interface ArticleQuery {
  category?: string;
  tag?: string;
  q?: string;
  featured?: boolean;
  page?: number | string;
  limit?: number | string;
}

export interface BookingQuery {
  status?: BookingStatus | '';
  q?: string;
  page?: number | string;
  limit?: number | string;
}

/** Create/update bodies for admin CRUD. The backend validates them; see backend/controllers. */
export type PackagePayload = Partial<Omit<TourPackage, 'id' | 'slug' | 'destination' | 'durationLabel' | 'createdAt'>> & {
  destinationId?: number;
};
export type DestinationPayload = Partial<Omit<Destination, 'id' | 'slug' | 'packageCount'>>;
export type ArticlePayload = Partial<Omit<Article, 'id' | 'slug' | 'related'>>;
