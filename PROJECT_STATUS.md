# Project Status

## Recent Updates (Sep 2026)

- **Server migrated to FastAPI/PostgreSQL** — Replaced Deno/Hono/MongoDB with Python FastAPI + SQLAlchemy async + PostgreSQL (asyncpg)
- **All 47 API endpoints replicated** — Exact same routes, request/response formats, and field naming (camelCase) as the original Deno server
- **Zero frontend changes required** — Admin panel and public panel work unchanged
- **Alembic migrations** — Schema version control via `server/alembic/`
- **Docker PostgreSQL** — Dev database runs in Docker container `blogging-postgres` on port 5435
- **Seed script** — `python server/seed.py` populates 8 tables with Pokemon-themed demo data
- **dev.sh launcher** — iTerm2-based: 3 tabs (server + panels, opencode, PostgreSQL container)
- **Frontend API documentation updated** — Reflects FastAPI/PostgreSQL stack, UUID IDs, Pydantic validation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Python 3.9+ |
| **Framework** | FastAPI + Uvicorn |
| **Database** | PostgreSQL (asyncpg + SQLAlchemy async) |
| **Migrations** | Alembic |
| **Auth** | JWT (python-jose, HS256) |
| **Admin Panel** | React CRA + Redux Toolkit + Axios |
| **Public Panel** | Next.js (Pages Router) |
| **Dev DB** | Docker (PostgreSQL on port 5435) |

## API Inventory

### Complete FastAPI → Frontend Mapping

#### Auth (2 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| POST | `/api/login` | `loginAPI.login(dt)` | `login.jsx` |
| GET | `/api/get-user-detail` | `loginAPI.getuser()` | `DashBoardLayout.jsx` |

#### Sites (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/sites` | `siteAPI.getAll()` | `AllSites.jsx` |
| POST | `/api/sites` | `siteAPI.addNew(content)` | — |
| GET | `/api/single-site/{id}` | `siteAPI.single(id)` | `SiteMenu.jsx` |
| PUT | `/api/single-site/{id}` | `siteAPI.update({id,...})` | — |
| DELETE | `/api/single-site/{id}` | `siteAPI.delete(id)` | — |

#### Blogs (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/pages-by-site-id/{siteId}` | `blogAPI.getAll(siteId)` | `AllBlogs.jsx` |
| POST | `/api/add-new-page` | `blogAPI.addNew(content)` | `AddUpdateBlogsForm.jsx` |
| GET | `/api/single-page/{id}` | `blogAPI.single(id)` | `DeleteBlog.jsx`, `AddUpdateBlogsForm.jsx` |
| PUT | `/api/single-page/{id}` | `blogAPI.update({id,...})` | `AddUpdateBlogsForm.jsx` |
| DELETE | `/api/single-page/{id}` | `blogAPI.delete(id)` | `DeleteBlog.jsx` |

#### Categories (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/categories-by-site-id/{siteId}` | `categoryAPI.getAll(siteId)` | `AllCategory.jsx` |
| POST | `/api/category` | `categoryAPI.addNew(content)` | `AddUpdateCateegoryForm.jsx` |
| GET | `/api/category/{id}` | `categoryAPI.single(id)` | `DeleteCategory.jsx` |
| PUT | `/api/category/{id}` | `categoryAPI.update({id,...})` | `AddUpdateCateegoryForm.jsx` |
| DELETE | `/api/category/{id}` | `categoryAPI.delete(id)` | `DeleteCategory.jsx` |

#### Tags (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/tags-by-site-id/{siteId}` | `tagsAPI.getAll(siteId)` | `AllTags.jsx` |
| POST | `/api/tags` | `tagsAPI.addNew(content)` | `AddUpdateTagsForm.jsx` |
| GET | `/api/tags/{id}` | `tagsAPI.single(id)` | `DeleteTags.jsx` |
| PUT | `/api/tags/{id}` | `tagsAPI.update({id,...})` | `AddUpdateTagsForm.jsx` |
| DELETE | `/api/tags/{id}` | `tagsAPI.delete(id)` | `DeleteTags.jsx` |

#### Navigation (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/navigation-by-site-id/{siteId}` | `navigationAPI.getAll(siteId)` | `allNavigation.jsx` |
| POST | `/api/add-navigation` | `navigationAPI.addNew(content)` | `AddUpdateNavigation.jsx` |
| GET | `/api/navigation/{id}` | `navigationAPI.single(id)` | `DeleteNavigation.jsx` |
| PUT | `/api/navigation/{id}` | `navigationAPI.update({id,...})` | `AddUpdateNavigation.jsx` |
| DELETE | `/api/navigation/{id}` | `navigationAPI.delete(id)` | `DeleteNavigation.jsx` |

#### Social Media (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/social-media-by-site-id/{siteId}` | `socialMediaAPI.getAll(siteId)` | `allSocialMedia.jsx` |
| POST | `/api/add-social-media` | `socialMediaAPI.addNew(content)` | `AddUpdateSocialMedia.jsx` |
| GET | `/api/social-media/{id}` | `socialMediaAPI.single(id)` | `deleteSocialMedia.jsx` |
| PUT | `/api/social-media/{id}` | `socialMediaAPI.update({id,...})` | `AddUpdateSocialMedia.jsx` |
| DELETE | `/api/social-media/{id}` | `socialMediaAPI.delete(id)` | `deleteSocialMedia.jsx` |

#### Static Pages (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/static-pages-by-site-id/{siteId}` | `staticPagesAPI.getAll(siteId)` | `AllStaticPage.jsx` |
| POST | `/api/add-new-static-page` | `staticPagesAPI.addNew(content)` | `AddUpdateStaticPage.jsx` |
| GET | `/api/single-static-page/{id}` | `staticPagesAPI.single(id)` | `DeleteStaticPage.jsx` |
| PUT | `/api/single-static-page/{id}` | `staticPagesAPI.update({id,...})` | `AddUpdateStaticPage.jsx` |
| DELETE | `/api/single-static-page/{id}` | `staticPagesAPI.delete(id)` | `DeleteStaticPage.jsx` |

#### Authors (5 endpoints)
| Method | Route | Frontend API | Component |
|--------|-------|-------------|-----------|
| GET | `/api/authors` | `authorAPI.getAll()` | `AllAuthors.jsx` |
| POST | `/api/admin/register` | `authorAPI.addNew(content)` | — |
| GET | `/api/get-writer/{id}` | `authorAPI.single(id)` | — |
| PUT | `/api/author/{id}` | `authorAPI.update({id,...})` | — |
| DELETE | `/api/author/{id}` | `authorAPI.delete(id)` | — |

#### Public (13 endpoints, no auth)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/logo` | Site logo URL |
| GET | `/get-navigation` | Navigation items |
| GET | `/get-social-media` | Social media links |
| GET | `/blogs` | All published blogs |
| GET | `/single-fetaured` | Featured blog |
| GET | `/all-writers` | All authors |
| GET | `/categories` | Category names |
| GET | `/static-page/{slug}` | Static page by slug |
| GET | `/get-meta-by-page/{page}` | Meta tags for page |
| GET | `/blogs-by-category/{cat}` | Blogs filtered by category |
| GET | `/page-by-slug/{slug}` | Blog by slug |
| GET | `/meta-data/{slug}` | Meta data (blog or static) |
| GET | `/get-blogs-by-author-id/{id}` | Blogs by author |

## Database Schema

8 PostgreSQL tables with async SQLAlchemy ORM:

| Table | Key Fields | ID Format |
|-------|-----------|-----------|
| `sites` | name, is_active | UUID |
| `authors` | name, email, profile_pic | UUID |
| `blogs` | title, slug, description, category, tags, meta_*, author (JSON), images (JSON), featured | UUID |
| `categories` | category_name, site_id | UUID |
| `tags` | tag_name, site_id | UUID |
| `navigation` | name, link, position, site_id | UUID |
| `social_media` | name, link, site_id | UUID |
| `static_pages` | title, slug, description, site_id | UUID |

## Field Naming Convention

All API responses use camelCase (matching original Deno server):

| DB Column | API Field | Notes |
|-----------|-----------|-------|
| `id` | `_id` | UUID string |
| `created_at` | `createdAt` | Unix epoch ms |
| `updated_at` | `updatedAt` | Unix epoch ms |
| `site_id` | `site` | Navigation, SocialMedia |
| `site_id` | `siteId` | Blog, Category, Tag, StaticPage |
| `category_name` | `categoryName` | Category |
| `tag_name` | `tagName` | Tag |
| `profile_pic` | `profilePic` | Author |
| `is_active` | `isActive` | Site |
| `meta_title` | `metaTitle` | Blog |
| `meta_description` | `metaDescription` | Blog |
| `meta_keywords` | `metaKeywords` | Blog |
| `cover_alt` | `coverAlt` | Blog |
| `faq_heading` | `faqHeading` | Blog |
| `redirect_url` | `redirectUrl` | Blog |

## Running the Project

```bash
# Start PostgreSQL (Docker)
docker run -d --name blogging-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=blogging_platform -p 5435:5432 postgres:15

# Start server + panels
./dev.sh

# Seed database
cd server && .venv/bin/python seed.py

# Access Swagger docs
open http://localhost:4900/docs
```

## Known Gaps

- **Auth is minimal** — single hardcoded user, no registration flow, no password hashing
- **Image upload** — Cloudinary integration (falls back to stub if env vars empty)
- **No rate limiting** — no protection against abuse
- **No HTTPS** — plain HTTP
- **Unused frontend actions** — Site CRUD, Author CRUD, Upload (defined in Redux slices but no UI dispatching)
- **Orphaned components** — `SingleSiteMenu.jsx`, `AllAuthors.jsx` (no route)
