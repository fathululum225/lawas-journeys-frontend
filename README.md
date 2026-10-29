# Lawas Journeys — Next.js frontend

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. It talks to the existing Express + SQLite
backend over REST; nothing in `backend/` changed. The previous HTML site now lives in `../frontend-legacy` (untouched) and
keeps working until this app is confirmed.

## Run

```bash
# terminal 1: backend (port 3000)
cd backend && npm install && npm run dev

# terminal 2: this app (port 3001)
cd frontend
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3001
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`. Requires Node 22+.

Environment (`.env.local`): `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3000/api`),
`NEXT_PUBLIC_SITE_URL` (used for canonical / Open Graph URLs, default `http://localhost:3001`).

Admin: <http://localhost:3001/admin>, sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/explore` | Overview of ways to explore (packages, destinations, journal, custom trip) |
| `/packages` | Package list with URL-driven filters, sorting and pagination |
| `/package/[slug]` | Package detail (dynamic metadata + Open Graph image) |
| `/destinations`, `/destinations/[slug]` | Destination list / detail |
| `/journal`, `/journal/[category]` | Journal home / category (also `?tag=`, `?q=`, `?page=`) |
| `/article/[slug]` | Article (dynamic metadata, bookmark) |
| `/custom-trip` | Custom trip request form |
| `/about`, `/about/our-story`, `/about/our-guides`, `/about/responsible-tourism` | About |
| `/login`, `/register` | Auth (`?next=` redirect supported) |
| `/booking?package=slug` | Booking form + summary |
| `/payment?order=…`, `/booking/success` | Payment and confirmation |
| `/my-booking` | Signed-in bookings + lookup by code & email |
| `/contact`, `/legal` | Contact (info + WhatsApp), legal |
| `/admin` + `/admin/{packages,destinations,articles,bookings,custom-trips}` | Admin panel |

Booking flow: Package → Book now → form → summary → `POST /bookings` → `POST /payments` → `/payment` →
verification → `/booking/success` → My Booking.

## Layout

```
src/
├── app/
│   ├── layout.tsx        html, fonts, providers only
│   ├── (site)/           customer routes, wrapped by SiteShell (Navbar, Footer, WhatsApp button)
│   └── admin/            admin routes, own layout (AdminGate + AdminShell, no navbar/footer)
├── components/           layout/ shared/ home/ packages/ destinations/ journal/ booking/ auth/ admin/ ...
├── providers/            LanguageProvider (ID/EN), AuthProvider (token + user), ToastProvider
├── i18n/                 locales.ts (dictionaries), index.ts (translate), server.ts (cookie)
├── lib/                  api.ts (every backend call), data.ts (server fetchers), session.ts, routes.ts ...
├── hooks/                useAsyncData, useWhatsAppConfirm, useSavedArticles ...
├── types/                API types
└── styles/               theme.css (design tokens) + legacy/ (original BEM CSS, unchanged class names)
public/images/            all illustrations (same file names as the legacy site)
```

Data: server components fetch through `lib/data.ts` (React `cache()`, `notFound()` on 404); client
components use `lib/api.ts` with the Bearer token kept in `localStorage` by `AuthProvider`.
Language is stored in the `lj_language` cookie so server and client render the same text.

## Styling

`globals.css` imports the original CSS into Tailwind's cascade layers: tokens in `theme.css`
(`@theme static`, same variable names as before), `base.css` as the reset, `layout.css` and
`components.css` as components. Tailwind utilities can still be used and override components.
Tailwind's preflight is deliberately not imported. Admin styles load only on `/admin` (`app/admin/admin.css`).

## Notes

- `/package/[slug]` and similar detail routes stream a loading skeleton; a missing slug renders the
  not-found page with `noindex`, but the HTTP status is already 200 because of streaming.
- Moving to production: set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL`, and set the backend
  `CORS_ORIGIN` to the site's origin.
