# Project Status

## Recent Updates (Jun 2026)

- **Server refactored to clean architecture** — Replaced flat handler modules with controllers/repositories pattern; MongoDB persistence via `npm:mongodb@^6.12.0`; Zod validation on all POST/PUT endpoints
- **JWT expiry fix** — Admin panel now validates `exp` (Unix seconds, standard) instead of non-standard `expiresIn`
- **Auth header fix** — `Authorization` header now correctly includes `Bearer` prefix in admin panel axios interceptor
- **NEXT_PUBLIC_API_URL debug log** — Added console log in public panel server calls for debugging

## What is Done

### Server (Deno/Hono) — Fully Functional
- **MongoDB persistence** via `npm:mongodb@^6.12.0` with 8 collections: `blogs`, `authors`, `categories`, `tags`, `navigation`, `socialMedia`, `staticPages`, `sites`
- **Connection:** `main.js` calls `connectDB()` → creates `MongoClient` with pooling (`maxPoolSize: 10`, `minPoolSize: 1`), retry logic (5 attempts with 2s backoff), and automatic reconnection monitoring (pings every 30s). Returns `db` instance injected into all controllers.
- **Clean architecture:** Repository pattern (stateless functions in `src/repositories/`), controller layer (dependency-injected handlers in `src/controllers/`), centralized config (`src/config.js`)
- **All CRUD routes implemented** for all 8 entities: blogs, categories, tags, navigation (sorted by position), social media, static pages, sites, authors
- **Full route inventory (52 endpoints):**
  - **Auth (1):** `POST /api/login` — JWT with standard `exp` claim (1 hour)
  - **Admin API (35, all JWT-protected):** Sites CRUD, Blogs CRUD, Categories CRUD, Tags CRUD, Navigation CRUD, Social Media CRUD, Static Pages CRUD, Author register/fetch, Image upload (stubbed), User detail
  - **Public API (16, no auth):** Logo, metadata, navigation, social media, blogs listing/featured/filtered, categories, writers, static pages, page-by-slug, plus 4 recently-added public aliases
- **JWT auth** on all `/api/*` routes (except `POST /api/login`). Credentials read from env vars (`AUTH_EMAIL`, `AUTH_PASSWORD`) with defaults. JWT secret from env (`JWT_SECRET`).
- **Seed script** (`deno task seed`) drops and repopulates all 8 collections with Pokemon-themed demo data
- **Bruno API collection** in `server/bruno/` — 33 request files across Admin/Login/Public folders
- **Server-side validation** via `npm:zod` — all POST/PUT endpoints validate request bodies with typed schemas
- **Image upload** via Cloudinary REST API (falls back to stub URL if Cloudinary env vars are empty). Supports multipart/form-data and base64 JSON payloads.

### Admin Panel (React CRA) — Functional
- **Login flow:** JWT token stored in localStorage (`abToken`), set as `Authorization: Bearer <token>` header on all axios requests via global interceptor
- **Multi-site management:** Per-site CRUD for blogs, categories, tags, navigation, social media, static pages
- **Dashboard** with stats. Rich text blog editor with image upload, SEO fields, FAQ section. Reusable table and form components. Redux state management.
- **`.env.local` configured** — `REACT_APP_API_BASE_URL=http://localhost:8000/api`

### Public Panel (Next.js) — Functional
- Homepage with hero, category filter, top authors, featured posts, CTA. Blog listing, single blog view with SEO metadata, author block, HTML rendering, related posts.
- Category-filtered listing, author listing, posts-by-author, static pages (About, Privacy, Contact).
- Client-side search with text highlighting. OG image generation API. Responsive layout with header/footer.
- **`.env.local` configured** — `NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"`

### Tests — 104 Passing
| Test File | Tests | Scope |
|-----------|-------|-------|
| `tests/endpoints/adminEndpoints.test.js` | 13 | Admin CRUD endpoints via JWT |
| `tests/endpoints/comprehensiveEndpoints.test.js` | 47 | All endpoints, edge cases, auth verification |
| `tests/endpoints/publicEndpoints.test.js` | 11 | Public panel routes |
| `tests/repositories/*.test.js` | 33 | Repository unit tests for all 8 entities |

Test isolation with per-test DB setup/teardown. All tests use `app.request()` (no server needed).

## What is Dummy / Placeholder / Not Yet Functional

- **Auth is minimal** — credentials from env vars but still a single hardcoded username/password. No user registration, no password reset, no role-based access.
- **Image upload is real via Cloudinary** — but falls back to stub URL if Cloudinary env vars are empty.
- **No server-side validation for public GET routes** — only POST/PUT endpoints are validated.
- **No rate limiting** — no protection against abuse.
- **No HTTPS** — plain HTTP on port 8000.
- **No environment variable loading** — uses `Deno.env.get()` directly. The `--env-file` flag is not used (would need `--allow-env` adjustment).
- **Stubbed/incomplete UI pieces:**
  - Author posts page has a placeholder div: `POSTS BY AUTHOR : "" || UPDATE THIS IN THE FUTURE`
  - Dashboard route is commented out in `routes.jsx`
  - Configuration sidebar link has no route
  - `Components/test.js` and `temperery/try.js` are abandoned test files (300+ lines)
  - Heavy `console.log` debugging spread across 50+ locations
  - Newsletter CTA email input has no backend integration
  - "Not a member? Sign up!" and "Forgot password?" links exist but lead nowhere

## Persistence & Connectivity Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Database** | ✅ Connected | MongoDB via `npm:mongodb@^6.12.0` |
| **Connection string** | ✅ Configurable | `MONGODB_URI` env var, defaults to `mongodb://localhost:27017/blogging-platform` |
| **Collections** | ✅ 8/8 | blogs, authors, categories, tags, navigation, socialMedia, staticPages, sites |
| **Seed data** | ✅ Available | `deno task seed` drops & repopulates all collections |
| **Connection pooling** | ✅ Configured | `maxPoolSize: 10`, `minPoolSize: 1`, `retryWrites: true`, `retryReads: true` |
| **Reconnection** | ✅ Automatic | 5 retry attempts on connect (2s delay), 30s ping monitor for live reconnection |
| **Indexes** | ❌ None | No MongoDB indexes defined |
| **Transactions** | ❌ None | No multi-document transactions |

## Auth Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Login endpoint** | ✅ Working | `POST /api/login` returns JWT |
| **JWT protection** | ✅ All `/api/*` | Except `POST /api/login` itself |
| **JWT format** | ✅ Standard | `sub`, `iss`, `exp` (Unix seconds, 1 hour) |
| **Credentials** | ✅ From env | `AUTH_EMAIL` / `AUTH_PASSWORD` env vars, with defaults |
| **Secret** | ✅ From env | `JWT_SECRET` env var, with default `"12345678"` |
| **Registration** | ⚠️ Exists but limited | `POST /api/admin/register` creates author record (no role distinction) |
| **Password hashing** | ❌ None | Stored as plain text |
| **Role-based access** | ❌ None | All authenticated users have same access |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Deno |
| **Framework** | Hono v4 |
| **Database** | MongoDB (raw driver) |
| **Auth** | `hono/jwt` (HS256) |
| **Admin Panel** | React CRA + Redux Toolkit + Axios |
| **Public Panel** | Next.js (Pages Router) |
| **Testing** | Deno test runner + `std/assert` |
| **API Client** | Bruno (collection in `server/bruno/`) |

## Future Scope

- User registration, role-based access, proper password hashing (bcrypt/argon2)
- Newsletter/email notification system
- MongoDB indexes for query performance
- Rate limiting
- Premium/paid features (the `UpdateToPremium` component exists in sidebar)
- FAQ rendering on public panel (data collected in blog form)
- Configuration page for global settings
- Docker setup and CI/CD pipeline
- Search indexing and full-text search
- Analytics and reader engagement metrics
