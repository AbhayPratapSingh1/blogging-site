# Blogging Platform

A multi-site blogging platform with three components:

- **Server** (`server/`) — FastAPI/PostgreSQL API backend with JWT auth and RESTful endpoints
- **Admin Panel** (`blogging-site-author-panel/`) — React SPA (CRA) admin dashboard for authors and site managers
- **Public Panel** (`blogging-site-public-panel/`) — Next.js public-facing frontend for readers

The platform supports managing multiple blogs/sites from a single dashboard, with features like rich text editing, category/tag management, navigation customization, social media links, and static pages. Currently a prototype using Pokemon-themed mock data.

## Tech Stack

| Component | Runtime | Framework | Database | Key Libs |
|---|---|---|---|---|
| Server | Python 3.9+ | FastAPI + Uvicorn | PostgreSQL (asyncpg + SQLAlchemy) | Alembic, python-jose, httpx |
| Admin Panel | Node.js | React 18 (CRA) | — | Redux Toolkit, Axios, Formik, ReactQuill, Tailwind |
| Public Panel | Node.js | Next.js | — | Tailwind, Framer Motion, Swiper |

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker (for PostgreSQL)

### 1. Start PostgreSQL

```bash
docker run -d --name blogging-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blogging_platform \
  -p 5435:5432 postgres:15
```

### 2. Start Server

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4900
```

Or use the dev launcher:

```bash
./dev.sh
```

### 3. Seed Database

```bash
cd server
.venv/bin/python seed.py
```

### 4. Access Swagger Docs

```
http://localhost:4900/docs
```

### 5. Start Panels

**Admin Panel:**
```bash
cd blogging-site-author-panel
npm install
npm start
# Runs on http://localhost:4901
```

**Public Panel:**
```bash
cd blogging-site-public-panel
npm install
npm run dev
# Runs on http://localhost:4902
```

## Environment Variables

Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5435/blogging_platform

# JWT
JWT_SECRET=your-secret-key
AUTH_EMAIL=user@gmail.com
AUTH_PASSWORD=12345

# Cloudinary (optional - falls back to stub if empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Server
PORT=4900
```

## API Overview

### Auth (2 endpoints)
- `POST /api/login` — Returns JWT access token
- `GET /api/get-user-detail` — Returns user profile

### Admin API (35 endpoints, JWT-protected)
- **Sites:** CRUD on `/api/sites`, `/api/single-site/{id}`
- **Blogs:** CRUD on `/api/pages-by-site-id/{id}`, `/api/add-new-page`, `/api/single-page/{id}`
- **Categories:** CRUD on `/api/categories-by-site-id/{id}`, `/api/category`, `/api/category/{id}`
- **Tags:** CRUD on `/api/tags-by-site-id/{id}`, `/api/tags`, `/api/tags/{id}`
- **Navigation:** CRUD on `/api/navigation-by-site-id/{id}`, `/api/add-navigation`, `/api/navigation/{id}`
- **Social Media:** CRUD on `/api/social-media-by-site-id/{id}`, `/api/add-social-media`, `/api/social-media/{id}`
- **Static Pages:** CRUD on `/api/static-pages-by-site-id/{id}`, `/api/add-new-static-page`, `/api/single-static-page/{id}`
- **Authors:** CRUD on `/api/authors`, `/api/admin/register`, `/api/get-writer/{id}`, `/api/author/{id}`

### Public API (13 endpoints, no auth)
- `/blogs` — All published blogs
- `/categories` — Category names
- `/all-writers` — All authors
- `/get-navigation` — Navigation items
- `/get-social-media` — Social media links
- `/static-page/{slug}` — Static page by slug
- `/page-by-slug/{slug}` — Blog by slug
- `/blogs-by-category/{cat}` — Blogs filtered by category
- `/get-blogs-by-author-id/{id}` — Blogs by author
- `/get-meta-by-page/{page}` — Meta tags for page
- `/meta-data/{slug}` — Meta data (blog or static)
- `/single-fetaured` — Featured blog
- `/logo` — Site logo URL

## Project Structure

```
blogging-site/
├── server/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config.py         # Pydantic Settings
│   │   ├── database.py       # Async SQLAlchemy engine
│   │   ├── models.py         # 8 ORM models
│   │   ├── schemas.py        # Pydantic request schemas
│   │   ├── auth.py           # JWT create/verify
│   │   ├── cloudinary.py     # Image upload
│   │   ├── utils.py          # camelCase conversion helpers
│   │   ├── routers/          # API route handlers
│   │   │   ├── auth.py       # Login, user detail
│   │   │   ├── admin.py      # All admin CRUD endpoints
│   │   │   └── public.py     # All public endpoints
│   │   └── repositories/     # Database access layer
│   │       ├── site.py
│   │       ├── blog.py
│   │       ├── category.py
│   │       ├── tag.py
│   │       ├── navigation.py
│   │       ├── social_media.py
│   │       ├── static_page.py
│   │       └── author.py
│   ├── alembic/              # Database migrations
│   ├── seed.py               # Seed script
│   ├── seed_data.py          # Pokemon-themed demo data
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
├── blogging-site-author-panel/  # React admin (CRA)
├── blogging-site-public-panel/  # Next.js public
├── dev.sh                      # iTerm2 dev launcher
├── docker-compose.yml          # PostgreSQL container
├── TODO.md
├── FRONTEND_API_DOCUMENTATION.md
└── PROJECT_STATUS.md
```
