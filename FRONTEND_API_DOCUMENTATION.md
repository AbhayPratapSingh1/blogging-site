# Frontend API Documentation

> Auto-generated from frontend codebase analysis. Covers all API calls across the Author Panel (React), Public Panel (Next.js), and the FastAPI/PostgreSQL backend server.

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Environment & Base URLs](#2-environment--base-urls)
- [3. Authentication Architecture](#3-authentication-architecture)
- [4. API Inventory](#4-api-inventory)
- [5. Admin APIs (Author Panel)](#5-admin-apis-author-panel)
  - [5.1 Authentication](#51-authentication)
  - [5.2 Sites](#52-sites)
  - [5.3 Blogs/Pages](#53-blogspages)
  - [5.4 Categories](#54-categories)
  - [5.5 Tags](#55-tags)
  - [5.6 Navigation](#56-navigation)
  - [5.7 Social Media](#57-social-media)
  - [5.8 Static Pages](#58-static-pages)
  - [5.9 Authors](#59-authors)
  - [5.10 Image Upload](#510-image-upload)
- [6. Public APIs (Public Panel)](#6-public-apis-public-panel)
  - [6.1 Logo](#61-logo)
  - [6.2 Meta Data](#62-meta-data)
  - [6.3 Navigation](#63-navigation)
  - [6.4 Social Media](#64-social-media)
  - [6.5 Blogs](#65-blogs)
  - [6.6 Featured Post](#66-featured-post)
  - [6.7 Blog by Author](#67-blog-by-author)
  - [6.8 Blog by Category](#68-blog-by-category)
  - [6.9 Categories](#69-categories)
  - [6.10 Authors/Writers](#610-authorswriters)
  - [6.11 Static Page by Slug](#611-static-page-by-slug)
  - [6.12 Page by Slug](#612-page-by-slug)
  - [6.13 Additional Public Endpoints (Direct Fetch)](#613-additional-public-endpoints-direct-fetch)
- [7. Response Documentation](#7-response-documentation)
- [8. Error Response Format](#8-error-response-format)
- [9. Pagination, Filtering & Sorting](#9-pagination-filtering--sorting)
- [10. File Uploads & Downloads](#10-file-uploads--downloads)
- [11. API Dependencies and Relationships](#11-api-dependencies-and-relationships)
- [12. Third-Party APIs](#12-third-party-apis)
- [13. Duplicate / Shared APIs](#13-duplicate--shared-apis)
- [14. API Coverage / Confidence](#14-api-coverage--confidence)
- [15. API Flow Examples](#15-api-flow-examples)
- [16. Backend Implementation Notes](#16-backend-implementation-notes)
- [17. Unknowns / Questions for Backend](#17-unknowns--questions-for-backend)

---

## 1. Architecture Overview

| Component | Framework | Runtime | HTTP Client | State |
|---|---|---|---|---|
| **Server** (`server/`) | FastAPI | Python 3.12 | httpx (Cloudinary) | PostgreSQL (asyncpg + SQLAlchemy) |
| **Author Panel** (`blogging-site-author-panel/`) | React 18 (CRA) | Node.js | Axios | Redux Toolkit |
| **Public Panel** (`blogging-site-public-panel/`) | Next.js 16 (App Router) | Node.js | Server-side `fetch()` | Server Components |

- No TypeScript used anywhere — pure JavaScript.
- PostgreSQL with asyncpg + SQLAlchemy 2.0 (async).
- 8 PostgreSQL tables: `blogs`, `categories`, `tags`, `navigation`, `social_media`, `static_pages`, `authors`, `sites`.
- All IDs are UUID strings.
- Migrations managed by Alembic.

---

## 2. Environment & Base URLs

### Author Panel (React)

| Variable | Value | Source |
|---|---|---|
| `REACT_APP_API_BASE_URL` | `http://localhost:4900/api` | `blogging-site-author-panel/.env.local` |
| `REACT_APP_API_URL` | Same as `REACT_APP_API_BASE_URL` (used interchangeably) | `.env.example` |

The Author Panel uses two base URL variables interchangeably:
- `REACT_APP_API_BASE_URL` — used in `loginAPI.js` for login and get-user-detail.
- `REACT_APP_API_URL` — used in all other API files for entity CRUD.

Both point to the same backend at `http://localhost:4900/api`.

### Public Panel (Next.js)

| Variable | Value | Source |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:4900` | `blogging-site-public-panel/.env.local` |

All public API calls use `NEXT_PUBLIC_API_URL` as a server-side base URL (not exposed to the browser). Public endpoints are **not** prefixed with `/api`.

### Server (FastAPI)

| Variable | Default | Source |
|---|---|---|
| `PORT` | `4900` | `server/.env` |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5435/blogging_platform` | `server/.env` |
| `JWT_SECRET` | `12345678` | `server/.env` |
| `AUTH_EMAIL` | `user@gmail.com` | `server/.env` |
| `AUTH_PASSWORD` | `12345` | `server/.env` |
| `CLOUDINARY_CLOUD_NAME` | (empty) | `server/.env` |
| `CLOUDINARY_API_KEY` | (empty) | `server/.env` |
| `CLOUDINARY_API_SECRET` | (empty) | `server/.env` |

> **Note:** Do not expose actual values. Only the variable names and their purpose are documented.

---

## 3. Authentication Architecture

### How It Works

This project uses a **single-user, hardcoded credential** authentication model. There is no user registration, no password hashing, no roles, and no permissions.

### Login Flow

1. Frontend sends `POST /api/login` with `{ email, password }`.
2. Server compares against hardcoded `AUTH_EMAIL` and `AUTH_PASSWORD` from environment.
3. On success, server returns a JWT `accessToken` (HS256, 1-hour expiry).
4. Frontend stores the token in `localStorage` under key `abToken`.
5. Frontend sets `Authorization: Bearer <token>` as default Axios header for all subsequent requests.
6. Frontend decodes the token using `jwt-decode` to check expiry.

### Token Details

| Property | Value |
|---|---|
| Algorithm | HS256 |
| Secret | `JWT_SECRET` env var |
| Expiry | 1 hour (`3600` seconds) |
| `sub` | Email address |
| `iss` | `"Me"` |
| Storage | `localStorage` key: `abToken` |
| Header | `Authorization: Bearer <token>` |

### Token Handling (Frontend)

- **Storage:** `localStorage.setItem('abToken', accessToken)` — `loginSlice.js:9`
- **Retrieval:** `localStorage.getItem('abToken')` — `login.jsx:28`, `DashBoardLayout.jsx:34`
- **Setting header:** `axios.defaults.headers.common.Authorization = 'Bearer ${token}'` — `setAuthorizationHeader.js:5`
- **Expiry check:** `jwtDecode(token).exp < Math.floor(Date.now() / 1000)` — `DashBoardLayout.jsx:42`
- **On expiry/invalid:** `localStorage.clear()`, redirect to `/` — `DashBoardLayout.jsx:27-31`

### Auth Exemptions

Only `POST /api/login` is exempt from JWT authentication. All other `/api/*` routes require a valid Bearer token.

### No Refresh Token

There is **no refresh token mechanism**. When the token expires, the user is logged out and redirected to `/`.

### No Admin/Role-Based Access

There is **no role-based or permission-based access control**. All authenticated users have the same access.

---

## 4. API Inventory

| # | Method | Endpoint | Auth | Panel | Feature | Source |
|---|---|---|---|---|---|---|
| 1 | POST | `/api/login` | No | Admin | Login | `src/api/loginAPI.js` |
| 2 | GET | `/api/get-user-detail` | JWT | Admin | Get User | `src/api/loginAPI.js` |
| 3 | GET | `/api/sites` | JWT | Admin | List Sites | `src/api/siteAPI.js` |
| 4 | POST | `/api/sites` | JWT | Admin | Create Site | `src/api/siteAPI.js` |
| 5 | GET | `/api/single-site/:id` | JWT | Admin | Get Site | `src/api/siteAPI.js` |
| 6 | PUT | `/api/single-site/:id` | JWT | Admin | Update Site/Author | `src/api/siteAPI.js` |
| 7 | DELETE | `/api/single-site/:id` | JWT | Admin | Delete Site/Author | `src/api/siteAPI.js` |
| 8 | GET | `/api/pages-by-site-id/:siteId` | JWT | Admin | List Blogs by Site | `src/api/blogAPI.js` |
| 9 | POST | `/api/add-new-page` | JWT | Admin | Create Blog | `src/api/blogAPI.js` |
| 10 | GET | `/api/single-page/:id` | JWT | Admin | Get Blog | `src/api/blogAPI.js` |
| 11 | PUT | `/api/single-page/:id` | JWT | Admin | Update Blog | `src/api/blogAPI.js` |
| 12 | DELETE | `/api/single-page/:id` | JWT | Admin | Delete Blog | `src/api/blogAPI.js` |
| 13 | GET | `/api/categories-by-site-id/:siteId` | JWT | Admin | List Categories | `src/api/categoryAPI.js` |
| 14 | POST | `/api/category` | JWT | Admin | Create Category | `src/api/categoryAPI.js` |
| 15 | GET | `/api/category/:id` | JWT | Admin | Get Category | `src/api/categoryAPI.js` |
| 16 | PUT | `/api/category/:id` | JWT | Admin | Update Category | `src/api/categoryAPI.js` |
| 17 | DELETE | `/api/category/:id` | JWT | Admin | Delete Category | `src/api/categoryAPI.js` |
| 18 | GET | `/api/tags-by-site-id/:siteId` | JWT | Admin | List Tags | `src/api/tagsAPI.js` |
| 19 | POST | `/api/tags` | JWT | Admin | Create Tag | `src/api/tagsAPI.js` |
| 20 | GET | `/api/tags/:id` | JWT | Admin | Get Tag | `src/api/tagsAPI.js` |
| 21 | PUT | `/api/tags/:id` | JWT | Admin | Update Tag | `src/api/tagsAPI.js` |
| 22 | DELETE | `/api/tags/:id` | JWT | Admin | Delete Tag | `src/api/tagsAPI.js` |
| 23 | GET | `/api/navigation-by-site-id/:siteId` | JWT | Admin | List Navigation | `src/api/navigationAPI.js` |
| 24 | POST | `/api/add-navigation` | JWT | Admin | Create Navigation | `src/api/navigationAPI.js` |
| 25 | GET | `/api/navigation/:id` | JWT | Admin | Get Navigation | `src/api/navigationAPI.js` |
| 26 | PUT | `/api/navigation/:id` | JWT | Admin | Update Navigation | `src/api/navigationAPI.js` |
| 27 | DELETE | `/api/navigation/:id` | JWT | Admin | Delete Navigation | `src/api/navigationAPI.js` |
| 28 | GET | `/api/social-media-by-site-id/:siteId` | JWT | Admin | List Social Media | `src/api/socialMediaAPI.js` |
| 29 | POST | `/api/add-social-media` | JWT | Admin | Create Social Media | `src/api/socialMediaAPI.js` |
| 30 | GET | `/api/social-media/:id` | JWT | Admin | Get Social Media | `src/api/socialMediaAPI.js` |
| 31 | PUT | `/api/social-media/:id` | JWT | Admin | Update Social Media | `src/api/socialMediaAPI.js` |
| 32 | DELETE | `/api/social-media/:id` | JWT | Admin | Delete Social Media | `src/api/socialMediaAPI.js` |
| 33 | GET | `/api/static-pages-by-site-id/:siteId` | JWT | Admin | List Static Pages | `src/api/staticPagesAPI.js` |
| 34 | POST | `/api/add-new-static-page` | JWT | Admin | Create Static Page | `src/api/staticPagesAPI.js` |
| 35 | GET | `/api/single-static-page/:id` | JWT | Admin | Get Static Page | `src/api/staticPagesAPI.js` |
| 36 | PUT | `/api/single-static-page/:id` | JWT | Admin | Update Static Page | `src/api/staticPagesAPI.js` |
| 37 | DELETE | `/api/single-static-page/:id` | JWT | Admin | Delete Static Page | `src/api/staticPagesAPI.js` |
| 38 | POST | `/api/admin/register` | JWT | Admin | Register Author | `src/api/authorAPI.js` |
| 39 | GET | `/api/get-writer/:id` | JWT | Admin | Get Author | `src/api/authorAPI.js` |
| 40 | GET | `/api/authors` | JWT | Admin | List Authors | `src/api/authorAPI.js` |
| 41 | PUT | `/api/author/:id` | JWT | Admin | Update Author | `src/api/authorAPI.js` |
| 42 | DELETE | `/api/author/:id` | JWT | Admin | Delete Author | `src/api/authorAPI.js` |
| 43 | POST | `/api/upload-single-image` | JWT | Admin | Upload Image | `src/api/uploadImageAPI.js` |
| 44 | GET | `/logo` | No | Public | Logo | `app/serverCalls.js` |
| 45 | GET | `/meta-data/:page` | No | Public | Meta Data | `app/serverCalls.js` |
| 46 | GET | `/get-navigation` | No | Public | Navigation | `app/serverCalls.js` |
| 47 | GET | `/get-social-media` | No | Public | Social Media | `app/serverCalls.js` |
| 48 | GET | `/blogs` | No | Public | All Blogs | `app/serverCalls.js` |
| 49 | GET | `/single-fetaured` | No | Public | Featured Post | `app/serverCalls.js` |
| 50 | GET | `/get-blogs-by-author-id/:id` | No | Public | Blogs by Author | `app/serverCalls.js` |
| 51 | GET | `/blogs-by-category/:category` | No | Public | Blogs by Category | `app/serverCalls.js` |
| 52 | GET | `/categories` | No | Public | Categories | `app/serverCalls.js` |
| 53 | GET | `/all-writers` | No | Public | All Authors | `app/serverCalls.js` |
| 54 | GET | `/static-page/:slug` | No | Public | Static Page | `app/serverCalls.js` |
| 55 | GET | `/page-by-slug/:slug` | No | Public | Blog by Slug | `app/serverCalls.js` |
| 56 | GET | `/user-detail/:id` | JWT | Admin | User Detail by Site ID | `server/src/app.js:217` |
| 57 | PUT | `/api/site/:id` | JWT | Admin | Update Site (alt) | `server/src/app.js:218` |
| 58 | DELETE | `/api/site/:id` | JWT | Admin | Delete Site (alt) | `server/src/app.js:219` |
| 59 | GET | `/get-meta-by-page/:page` | No | Public | Meta Data by Page (alt) | `app/Components/helper.js:58` |
| 60 | GET | `/pages-by-category/:category` | No | Public | Posts by Category (alt) | `app/post/[category]/page.js:46` |
| 61 | GET | `/static-page-by-slug/:slug` | No | Public | Static Page by Slug (alt) | `app/post/[category]/page.js:56` |
| 62 | GET | `/category` | No | Public | Categories (alt) | `app/Components/mainComponents/categoryPost.js:6` |

**Total: 62 endpoints** (43 Admin-authenticated + 18 Public unauthenticated + 1 hybrid)

---

## 5. Admin APIs (Author Panel)

All Admin APIs require JWT Bearer token authentication.

### 5.1 Authentication

#### POST `/api/login`

**Purpose:** Authenticate and receive a JWT access token.

**Source:** `src/api/loginAPI.js:6`, `src/features/loginSlice.js:5-16`

**Request:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email or password"
}
```

**Frontend Usage:**
- Stores `accessToken` in `localStorage` as `abToken`
- Sets `isAuthenticated` to `true` in Redux state
- No refresh token or token renewal mechanism

**Confidence:** Confirmed

---

#### GET `/api/get-user-detail`

**Purpose:** Get hardcoded user profile for the admin panel header.

**Source:** `src/api/loginAPI.js:7`, `src/features/loginSlice.js:18-27`

**Request:** None (JWT in Authorization header)

**Success Response (200):**
```json
{
  "profilePic": {
    "url": "https://www.w3schools.com/howto/img_avatar.png"
  },
  "name": "Rajesh"
}
```

**Frontend Usage:**
- Called on dashboard layout mount if `user._id` is not present
- Response stored in `login.user` Redux state

**Confidence:** Confirmed (hardcoded response in `adminController.js:46-50`)

---

### 5.2 Sites

#### GET `/api/sites`

**Purpose:** List all sites.

**Source:** `src/api/siteAPI.js:6`, `src/features/siteSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "Site Name",
    "isActive": true,
    "createdAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `sites.allSites` array.

**Confidence:** Confirmed

---

#### POST `/api/sites`

**Purpose:** Create a new site.

**Source:** `src/api/siteAPI.js:7`, `src/features/siteSlice.js:17-25`

**Request:**
```json
{
  "name": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Site created",
  "id": "UUID string"
}
```

**Frontend Usage:** `data.message` displayed via `setMessage()`.

**Confidence:** Confirmed

---

#### GET `/api/single-site/:id`

**Purpose:** Get a single site by ID.

**Source:** `src/api/siteAPI.js:14`, `src/features/siteSlice.js:28-36`

**Path Parameter:** `id` — UUID string

**Success Response (200):**
```json
{
  "_id": "UUID string",
  "name": "Site Name",
  "isActive": true,
  "createdAt": 1699900000000
}
```

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Frontend Usage:** Response stored as `sites.singleSite`.

**Confidence:** Confirmed

---

#### PUT `/api/single-site/:id`

**Purpose:** Update a site or author (polymorphic endpoint).

**Source:** `src/api/siteAPI.js:8-11`, `src/features/siteSlice.js:41-49`

**Path Parameter:** `id` — UUID string

**Request:**
```json
{
  "name": "string (optional)",
  "isActive": "boolean (optional)"
}
```

**Behavior:** If `body.name` exists and `body.isActive` is undefined, updates the **author**. Otherwise, updates the **site**.

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Error Response (400):**
```json
{
  "error": "Request body is empty"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/single-site/:id`

**Purpose:** Delete a site or author (polymorphic endpoint).

**Source:** `src/api/siteAPI.js:13`, `src/features/siteSlice.js:52-60`

**Path Parameter:** `id` — UUID string

**Behavior:** Checks if the ID belongs to a site or author and deletes accordingly.

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Confidence:** Confirmed

---

### 5.3 Blogs/Pages

#### GET `/api/pages-by-site-id/:siteId`

**Purpose:** List all blogs/pages for a specific site.

**Source:** `src/api/blogAPI.js:6`, `src/features/blogSlice.js:5-13`

**Path Parameter:** `siteId` — Site identifier string

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "title": "Blog Title",
    "description": "<p>HTML content</p>",
    "slug": "blog-slug",
    "category": "Category Name",
    "tags": "tag1, tag2, tag3",
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "metaKeywords": "keyword1, keyword2",
    "author": {
      "authorId": "string",
      "name": "Author Name",
      "url": "https://example.com/image.jpg"
    },
    "images": {
      "name": "image.jpg",
      "url": "https://example.com/image.jpg"
    },
    "coverAlt": "alt text",
    "faqHeading": "FAQ Heading",
    "faqs": [
      { "question": "Q?", "answer": "A" }
    ],
    "redirectUrl": "https://example.com",
    "siteId": "site-id-1",
    "featured": false,
    "createdAt": 1699900000000,
    "updatedAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `blogs.allBlogs`.

**Confidence:** Confirmed

---

#### POST `/api/add-new-page`

**Purpose:** Create a new blog/post.

**Source:** `src/api/blogAPI.js:7`, `src/features/blogSlice.js:17-25`

**Request:**
```json
{
  "title": "string (required, min 1 char)",
  "description": "string (optional)",
  "slug": "string (optional)",
  "category": "string (optional)",
  "tags": "string (optional, comma-separated)",
  "metaTitle": "string (optional)",
  "metaDescription": "string (optional)",
  "metaKeywords": "string (optional)",
  "author": {
    "authorId": "string (optional)",
    "name": "string (optional)",
    "url": "string (optional)"
  },
  "images": {
    "name": "string (optional)",
    "url": "string (optional)"
  },
  "coverAlt": "string (optional)",
  "faqHeading": "string (optional)",
  "faqs": [
    { "question": "string", "answer": "string" }
  ],
  "redirectUrl": "string (optional)",
  "siteId": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Blog created",
  "id": "UUID string"
}
```

**Frontend Usage:** `data.message` displayed via `setMessage()`.

**Confidence:** Confirmed

---

#### GET `/api/single-page/:id`

**Purpose:** Get a single blog by ID.

**Source:** `src/api/blogAPI.js:12`, `src/features/blogSlice.js:28-36`

**Success Response (200):** Blog object (same structure as list item).

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Frontend Usage:** Response stored as `blogs.singleBlog`.

**Confidence:** Confirmed

---

#### PUT `/api/single-page/:id`

**Purpose:** Update a blog.

**Source:** `src/api/blogAPI.js:8-10`, `src/features/blogSlice.js:41-49`

**Request:** Same fields as create, all optional except `title` and `description` if provided (must be non-empty).

**Additional field:** `featured: boolean (optional)` — not available on create.

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/single-page/:id`

**Purpose:** Delete a blog.

**Source:** `src/api/blogAPI.js:11`, `src/features/blogSlice.js:52-60`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.4 Categories

#### GET `/api/categories-by-site-id/:siteId`

**Purpose:** List all categories for a site.

**Source:** `src/api/categoryAPI.js:6`, `src/features/categorySlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "categoryName": "Technology",
    "createdAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `category.allCategories`.

**Confidence:** Confirmed

---

#### POST `/api/category`

**Purpose:** Create a category.

**Source:** `src/api/categoryAPI.js:7`, `src/features/categorySlice.js:17-25`

**Request:**
```json
{
  "categoryName": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Category created",
  "id": "UUID string"
}
```

**Confidence:** Confirmed

---

#### GET `/api/category/:id`

**Purpose:** Get a single category.

**Source:** `src/api/categoryAPI.js:14`

**Success Response (200):** Category object.

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Confidence:** Confirmed

---

#### PUT `/api/category/:id`

**Purpose:** Update a category.

**Source:** `src/api/categoryAPI.js:8-11`, `src/features/categorySlice.js:41-49`

**Request:**
```json
{
  "categoryName": "string (optional, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/category/:id`

**Purpose:** Delete a category.

**Source:** `src/api/categoryAPI.js:13`, `src/features/categorySlice.js:51-59`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.5 Tags

#### GET `/api/tags-by-site-id/:siteId`

**Purpose:** List all tags for a site.

**Source:** `src/api/tagsAPI.js:6`, `src/features/tagsSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "tagName": "javascript",
    "createdAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `tags.allTags`.

**Confidence:** Confirmed

---

#### POST `/api/tags`

**Purpose:** Create a tag.

**Source:** `src/api/tagsAPI.js:7`, `src/features/tagsSlice.js:17-25`

**Request:**
```json
{
  "tagName": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Tag created",
  "id": "UUID string"
}
```

**Confidence:** Confirmed

---

#### GET `/api/tags/:id`

**Purpose:** Get a single tag.

**Source:** `src/api/tagsAPI.js:13`

**Success Response (200):** Tag object.

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Confidence:** Confirmed

---

#### PUT `/api/tags/:id`

**Purpose:** Update a tag.

**Source:** `src/api/tagsAPI.js:8-10`, `src/features/tagsSlice.js:41-49`

**Request:**
```json
{
  "tagName": "string (optional, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/tags/:id`

**Purpose:** Delete a tag.

**Source:** `src/api/tagsAPI.js:11`, `src/features/tagsSlice.js:51-59`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.6 Navigation

#### GET `/api/navigation-by-site-id/:siteId`

**Purpose:** List all navigation items for a site.

**Source:** `src/api/navigationAPI.js:6`, `src/features/navigationSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "Home",
    "link": "/",
    "position": 1,
    "siteId": "site-id-1",
    "createdAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `navigation.allNavigations`.

**Confidence:** Confirmed

---

#### POST `/api/add-navigation`

**Purpose:** Create a navigation item.

**Source:** `src/api/navigationAPI.js:7`, `src/features/navigationSlice.js:16-24`

**Request:**
```json
{
  "name": "string (required, min 1 char)",
  "position": "number | string (required, coerced to number)",
  "link": "string (required, min 1 char)",
  "site": "string (required, min 1 char, site ID)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Done adding new Navigation"
}
```

**Note:** The field `site` in the request is mapped to `siteId` on the server side.

**Confidence:** Confirmed

---

#### GET `/api/navigation/:id`

**Purpose:** Get a single navigation item.

**Source:** `src/api/navigationAPI.js:13`

**Success Response (200):** Navigation object.

**Error Response (404):** `Not Found` (plain text body)

**Confidence:** Confirmed

---

#### PUT `/api/navigation/:id`

**Purpose:** Update a navigation item.

**Source:** `src/api/navigationAPI.js:8-10`, `src/features/navigationSlice.js:40-48`

**Request:**
```json
{
  "name": "string (optional)",
  "position": "number | string (optional)",
  "link": "string (optional)",
  "siteId": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/navigation/:id`

**Purpose:** Delete a navigation item.

**Source:** `src/api/navigationAPI.js:12`, `src/features/navigationSlice.js:50-58`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.7 Social Media

#### GET `/api/social-media-by-site-id/:siteId`

**Purpose:** List all social media links for a site.

**Source:** `src/api/socialMediaAPI.js:6`, `src/features/socialMediaSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "facebook",
    "link": "https://facebook.com/page",
    "createdAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `socialMedia.allSocialMedias`.

**Confidence:** Confirmed

---

#### POST `/api/add-social-media`

**Purpose:** Create a social media link.

**Source:** `src/api/socialMediaAPI.js:7`, `src/features/socialMediaSlice.js:17-25`

**Request:**
```json
{
  "name": "string (required, min 1 char)",
  "link": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Social media created",
  "id": "UUID string"
}
```

**Confidence:** Confirmed

---

#### GET `/api/social-media/:id`

**Purpose:** Get a single social media link.

**Source:** `src/api/socialMediaAPI.js:13`

**Success Response (200):** Social media object.

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Confidence:** Confirmed

---

#### PUT `/api/social-media/:id`

**Purpose:** Update a social media link.

**Source:** `src/api/socialMediaAPI.js:8-10`, `src/features/socialMediaSlice.js:41-49`

**Request:**
```json
{
  "name": "string (optional)",
  "link": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/social-media/:id`

**Purpose:** Delete a social media link.

**Source:** `src/api/socialMediaAPI.js:12`, `src/features/socialMediaSlice.js:51-59`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.8 Static Pages

#### GET `/api/static-pages-by-site-id/:siteId`

**Purpose:** List all static pages for a site.

**Source:** `src/api/staticPagesAPI.js:6`, `src/features/staticPagesSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "title": "About Us",
    "slug": "about",
    "description": "<p>HTML content</p>",
    "createdAt": 1699900000000,
    "updatedAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `staticPages.allStaticPages`.

**Confidence:** Confirmed

---

#### POST `/api/add-new-static-page`

**Purpose:** Create a static page.

**Source:** `src/api/staticPagesAPI.js:7`, `src/features/staticPagesSlice.js:17-25`

**Request:**
```json
{
  "title": "string (required, min 1 char)",
  "slug": "string (required, min 1 char)",
  "description": "string (required, min 1 char)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Static page created",
  "id": "UUID string"
}
```

**Confidence:** Confirmed

---

#### GET `/api/single-static-page/:id`

**Purpose:** Get a single static page.

**Source:** `src/api/staticPagesAPI.js:13`

**Success Response (200):** Static page object.

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Confidence:** Confirmed

---

#### PUT `/api/single-static-page/:id`

**Purpose:** Update a static page.

**Source:** `src/api/staticPagesAPI.js:8-10`, `src/features/staticPagesSlice.js:41-49`

**Request:**
```json
{
  "title": "string (optional)",
  "slug": "string (optional)",
  "description": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/single-static-page/:id`

**Purpose:** Delete a static page.

**Source:** `src/api/staticPagesAPI.js:12`, `src/features/staticPagesSlice.js:51-59`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.9 Authors

#### POST `/api/admin/register`

**Purpose:** Register a new author.

**Source:** `src/api/authorAPI.js:8`, `src/features/authorSlice.js:17-25`

**Request:**
```json
{
  "name": "string (required, min 1 char)",
  "email": "string (required, valid email)"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Author registered",
  "id": "UUID string"
}
```

**Confidence:** Confirmed

---

#### GET `/api/authors`

**Purpose:** List all authors.

**Source:** `src/api/authorAPI.js:7`, `src/features/authorSlice.js:5-13`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "Author Name",
    "email": "author@example.com",
    "profilePic": {
      "url": "https://example.com/pic.jpg"
    },
    "createdAt": 1699900000000,
    "updatedAt": 1699900000000
  }
]
```

**Frontend Usage:** Response stored as `author.allAuthors`.

**Confidence:** Confirmed

---

#### GET `/api/get-writer/:id`

**Purpose:** Get a single author.

**Source:** `src/api/authorAPI.js:15`, `src/features/authorSlice.js:28-36`

**Success Response (200):** Author object.

**Error Response (404):**
```json
{
  "error": "Not Found"
}
```

**Frontend Usage:** Response stored as `author.singleAuthor`.

**Confidence:** Confirmed

---

#### PUT `/api/author/:id`

**Purpose:** Update an author.

**Source:** `src/api/authorAPI.js:9-12`, `src/features/authorSlice.js:41-49`

**Request:**
```json
{
  "name": "string (optional)",
  "email": "string (optional, valid email)",
  "profilePic": {
    "url": "string (optional)"
  }
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Updated"
}
```

**Confidence:** Confirmed

---

#### DELETE `/api/author/:id`

**Purpose:** Delete an author.

**Source:** `src/api/authorAPI.js:14`, `src/features/authorSlice.js:51-59`

**Success Response (200):**
```json
{
  "message": "Deleted!"
}
```

**Confidence:** Confirmed

---

### 5.10 Image Upload

#### POST `/api/upload-single-image`

**Purpose:** Upload an image to Cloudinary.

**Source:** `src/api/uploadImageAPI.js:6`, `src/utils/helper.js:14-23`

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Image file (also accepts `image` as field name) |

Alternatively, accepts JSON body with base64 encoded image in `file` field.

**Frontend Usage (two methods):**

1. **Via `uploadImageAPI.js`:** Sends raw FormData to the endpoint.
2. **Via `helper.js` `uploadImageToAPI()`:** Creates FormData with field name `file` and sends to the same endpoint.

**Success Response (200):**
```json
{
  "url": "https://res.cloudinary.com/.../image/upload/..."
}
```

**Error Response (500):**
```json
{
  "error": "Upload failed"
}
```

**Cloudinary Fallback:** If Cloudinary is not configured, returns a stub Wikipedia URL.

**Confidence:** Confirmed

---

## 6. Public APIs (Public Panel)

All public APIs are unauthenticated. The Public Panel calls these via server-side `fetch()` in Next.js Server Components.

**Base URL:** `NEXT_PUBLIC_API_URL` (e.g., `http://127.0.0.1:8000`)

### 6.1 Logo

#### GET `/logo`

**Source:** `app/serverCalls.js:43-49`

**Success Response (200):**
```json
{
  "url": "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
}
```

**Fallback:** `{ "url": "/logo.png" }`

**Confidence:** Confirmed (hardcoded in `publicController.js:8-9`)

---

### 6.2 Meta Data

#### GET `/meta-data/:page`

**Source:** `app/serverCalls.js:31-37`

**Path Parameter:** `page` — Page identifier (`home`, `blog`, or a static page slug)

**Success Response (200) — for `home`:**
```json
{
  "metaTitle": "Gotta Catch 'Em All | Ultimate Pokémon Strategy & News",
  "metaKeywords": "Pokémon, Pokedex, Gaming News, Nintendo Switch, Strategy Guide",
  "metaDescription": "Your premier destination for..."
}
```

**Success Response (200) — for `blog`:**
```json
{
  "title": "The Trainer's Journal | Latest Articles & Tips",
  "excerpt": "Deep dives into game mechanics...",
  "publishedAt": "2026-09-14T00:00:00.000Z",
  "coverImage": "https://raw.githubusercontent.com/.../25.png"
}
```

**Success Response (200) — for static page slug:**
```json
{
  "title": "Page Title",
  "excerpt": "Description text (max 160 chars, HTML stripped)",
  "publishedAt": "2026-09-14T00:00:00.000Z",
  "coverImage": "https://raw.githubusercontent.com/.../25.png"
}
```

**Fallback:** `{ metaDescription: "something", metaKeywords: "keywords", title: "some title" }`

**Confidence:** Confirmed

---

### 6.3 Navigation

#### GET `/get-navigation`

**Source:** `app/serverCalls.js:52-59`

**Behavior:** Hardcoded to query `siteId = "site-id-1"`.

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "Home",
    "link": "/",
    "position": 1,
    "siteId": "site-id-1",
    "createdAt": 1699900000000
  }
]
```

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.4 Social Media

#### GET `/get-social-media`

**Source:** `app/serverCalls.js:61-68`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "facebook",
    "link": "https://facebook.com/page",
    "createdAt": 1699900000000
  }
]
```

**Fallback (if empty):**
```json
[
  { "name": "facebook", "link": "/" },
  { "name": "whatsapp", "link": "/ws" },
  { "name": "linkedin", "link": "/in" },
  { "name": "twitter", "link": "/tw" },
  { "name": "instagram", "link": "/ig" }
]
```

**Confidence:** Confirmed

---

### 6.5 Blogs

#### GET `/blogs`

**Source:** `app/serverCalls.js:70-76`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "title": "Blog Title",
    "description": "<p>HTML content</p>",
    "slug": "blog-slug",
    "category": "Technology",
    "tags": "javascript, react",
    "author": {
      "authorId": "string",
      "name": "Author Name",
      "url": "https://example.com/pic.jpg"
    },
    "images": {
      "name": "image.jpg",
      "url": "https://example.com/image.jpg"
    },
    "coverAlt": "alt text",
    "featured": false,
    "createdAt": 1699900000000
  }
]
```

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.6 Featured Post

#### GET `/single-fetaured`

**Note:** Endpoint name has a typo ("fetaured" instead of "featured").

**Source:** `app/serverCalls.js:79-88`

**Behavior:** Returns the first blog where `featured: true`. If none found, returns the first blog in the collection.

**Success Response (200):** Single blog object (same structure as blog list item).

**Fallback:**
```json
{
  "category": "some",
  "slug": "pg-1",
  "images": { "url": "/images/hero1.avif", "name": "Cup " },
  "title": "A cup of coffee to start off the day",
  "author": { "name": "Rajesh Sharma", "type": "Developer", "url": "/images/download.jpeg" },
  "createdAt": 14,
  "tags": "asdf, asdf, asdf"
}
```

**Confidence:** Confirmed

---

### 6.7 Blog by Author

#### GET `/get-blogs-by-author-id/:id`

**Source:** `app/serverCalls.js:108-114`

**Path Parameter:** `id` — Author ID

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "title": "Blog Title",
    "description": "<p>HTML content</p>",
    "slug": "blog-slug",
    "category": "Technology",
    "tags": "javascript, react",
    "author": {
      "authorId": "string",
      "name": "Author Name",
      "url": "https://example.com/pic.jpg"
    },
    "images": {
      "name": "image.jpg",
      "url": "https://example.com/image.jpg"
    },
    "createdAt": 1699900000000
  }
]
```

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.8 Blog by Category

#### GET `/blogs-by-category/:category`

**Source:** `app/serverCalls.js:126-132`

**Path Parameter:** `category` — Category name (case-insensitive regex match)

**Success Response (200):** Array of blog objects (same structure).

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.9 Categories

#### GET `/categories`

**Source:** `app/serverCalls.js:98-105`

**Behavior:** Extracts unique categories from all blogs. Does not query the `categories` collection.

**Success Response (200):**
```json
[
  { "categoryName": "Technology" },
  { "categoryName": "Lifestyle" }
]
```

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.10 Authors/Writers

#### GET `/all-writers`

**Source:** `app/serverCalls.js:90-96`

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "name": "Author Name",
    "email": "author@example.com",
    "profilePic": {
      "url": "https://example.com/pic.jpg"
    },
    "createdAt": 1699900000000
  }
]
```

**Fallback:** `[]`

**Confidence:** Confirmed

---

### 6.11 Static Page by Slug

#### GET `/static-page/:slug`

**Source:** `app/serverCalls.js:117-123`

**Path Parameter:** `slug` — Static page slug

**Success Response (200):**
```json
{
  "_id": "UUID string",
  "title": "About Us",
  "slug": "about",
  "description": "<p>HTML content</p>",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**Fallback:** `{}`

**Error Response (404):** `Not Found` (plain text body)

**Confidence:** Confirmed

---

### 6.12 Page by Slug

#### GET `/page-by-slug/:slug`

**Source:** Direct `fetch()` call in `app/post/[category]/[slug]/page.js:9`

**Path Parameter:** `slug` — Blog post slug

**Success Response (200):** Full blog object (same structure as blog list item, including all fields like `metaTitle`, `metaKeywords`, `metaDescription`, `faqHeading`, `faqs`, `redirectUrl`).

**Error Response (404):** `Not Found` (plain text body)

**Frontend Usage:** Used for SEO metadata generation (`generateMetadata`) and single blog page rendering.

**Confidence:** Confirmed

---

### 6.13 Additional Public Endpoints (Direct Fetch)

These endpoints are called directly via `fetch()` in Public Panel components, bypassing the `serverCalls.js` wrapper.

#### GET `/get-meta-by-page/:page`

**Purpose:** Get SEO metadata for a specific page/slug.

**Source:** `app/Components/helper.js:58` (called from `getSeo()`)

**Path Parameter:** `page` — Page slug or identifier

**Success Response (200):**
```json
{
  "title": "Page Title",
  "metaDescription": "Description text",
  "metaKeywords": "keyword1, keyword2"
}
```

**Note:** This is an alias for `/meta-data/:page` defined on the server at `app.js:239`.

**Confidence:** Highly likely (endpoint exists on server, direct fetch found in helper.js)

---

#### GET `/pages-by-category/:category`

**Purpose:** Get all blog posts matching a category.

**Source:** `app/post/[category]/page.js:46`

**Path Parameter:** `category` — Category name (case-insensitive)

**Request Headers:**
```
encodedes: process.env.NEXT_PUBLIC_SITE_NAME
```

**Next.js Config:** `{ next: { tags: ['posts'] } }` (for on-demand revalidation)

**Success Response (200):**
```json
[
  {
    "_id": "UUID string",
    "title": "Blog Title",
    "slug": "blog-slug",
    "category": "Technology",
    ...
  }
]
```

**Note:** This is an alias for `/blogs-by-category/:category` defined on the server at `app.js:240`.

**Confidence:** Highly likely (endpoint exists on server, direct fetch found in component)

---

#### GET `/static-page-by-slug/:slug`

**Purpose:** Get a static page by its slug.

**Source:** `app/post/[category]/page.js:56`

**Path Parameter:** `slug` — Static page slug

**Request Headers:**
```
encodedes: process.env.NEXT_PUBLIC_SITE_NAME
```

**Next.js Config:** `{ next: { tags: ['nav'] } }` (for on-demand revalidation)

**Success Response (200):**
```json
{
  "_id": "UUID string",
  "title": "About Us",
  "slug": "about",
  "description": "<p>HTML content</p>",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**Note:** This is an alias for `/static-page/:slug` defined on the server at `app.js:241`.

**Confidence:** Highly likely (endpoint exists on server, direct fetch found in component)

---

#### GET `/category`

**Purpose:** Get categories list (alternative to `/categories`).

**Source:** `app/Components/mainComponents/categoryPost.js:6`

**Request Headers:**
```
encodedes: process.env.NEXT_PUBLIC_SITE_NAME
```

**Next.js Config:** `{ next: { tags: ['posts'] } }` (for on-demand revalidation)

**Success Response (200):**
```json
[
  { "categoryName": "Technology" },
  { "categoryName": "Lifestyle" }
]
```

**Note:** This is an alias for `/categories` defined on the server at `app.js:238`. Both endpoints use the same handler (`handleCategories`).

**Confidence:** Confirmed (endpoint exists on server, direct fetch found in component)

---

## 7. Response Documentation

### Standard Success Responses

All admin CRUD endpoints follow consistent patterns:

**Create:** `{ status: true, message: "Entity created", id: "UUID" }`
**Read (single):** Raw entity object from PostgreSQL
**Read (list):** Raw array of entity objects from PostgreSQL
**Update:** `{ status: true, message: "Updated" }`
**Delete:** `{ message: "Deleted!" }`

### List Response Structure

All list endpoints return raw PostgreSQL arrays with no wrapper:

```json
[
  { "_id": "...", "field": "value", ... },
  { "_id": "...", "field": "value", ... }
]
```

### ID Format

All IDs are UUID strings (e.g., `"550e8400-e29b-41d4-a716-446655440000"`).

### Timestamps

All entities include `createdAt` (and most include `updatedAt`) as Unix epoch milliseconds (`Date.now()`).

---

## 8. Error Response Format

### Validation Errors (400)

The server uses Zod validation. On validation failure:

```json
{
  "error": "fieldName: Validation message; anotherField: Another message"
}
```

Example:
```json
{
  "error": "email: Invalid email format; password: Password is required"
}
```

The error message is a single string with semicolon-separated field errors.

### Authentication Errors (400)

```json
{
  "error": "Invalid email or password"
}
```

### Not Found Errors (404)

```json
{
  "error": "Not Found"
}
```

Or plain text body: `Not Found`

### Empty Body Error (400)

```json
{
  "error": "Request body is empty"
}
```

### Upload Errors (500)

```json
{
  "error": "Upload failed"
}
```

### Frontend Error Handling

The Author Panel catches Axios errors and extracts `error.response.data.message`:

```js
catch (error) {
    if (error.response) {
        return rejectWithValue(error.response.data.message)
    }
}
```

**Important Note:** The server returns errors under the `error` key, but the frontend expects `message`. This means **error messages from the backend are currently NOT properly displayed** in the frontend. The frontend's `rejectWithValue(error.response.data.message)` will receive `undefined` since the server uses `error` as the key, not `message`.

---

## 9. Pagination, Filtering & Sorting

### Current State

**There is NO pagination, filtering, or sorting implemented in the frontend or backend.**

All list endpoints return the complete, unfiltered collection:

- `GET /api/sites` → all sites
- `GET /api/pages-by-site-id/:siteId` → all blogs for a site
- `GET /api/categories-by-site-id/:siteId` → all categories
- `GET /api/tags-by-site-id/:siteId` → all tags
- `GET /api/navigation-by-site-id/:siteId` → all navigation items
- `GET /api/social-media-by-site-id/:siteId` → all social media links
- `GET /api/static-pages-by-site-id/:siteId` → all static pages
- `GET /api/authors` → all authors
- `GET /blogs` → all blogs
- `GET /categories` → unique categories from blogs

### Client-Side Filtering

The Author Panel performs client-side filtering in some components (e.g., searching/filtering tables), but this is purely UI-level.

### Future Considerations

If pagination is added, the backend should support:
- `page` / `limit` query parameters
- `sort` / `order` query parameters
- `search` query parameter for text search

---

## 10. File Uploads & Downloads

### Image Upload

**Endpoint:** `POST /api/upload-single-image`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Description |
|---|---|---|
| `file` | File | The image file (primary field name) |
| `image` | File | Alternative field name (also accepted) |

**File Type:** Images (processed as JPEG by Cloudinary)

**Maximum Size:** Not specified in frontend or backend code.

**Cloudinary Integration:**
- Server-side upload to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
- Uses signed upload with timestamp and SHA-1 signature
- Returns `{ url: secure_url }` on success

**Frontend Usage:**
1. `src/api/uploadImageAPI.js` — raw FormData upload
2. `src/utils/helper.js:uploadImageToAPI()` — wrapper that creates FormData with `file` field

**No downloads, exports, CSV uploads, or blob responses exist in the frontend.**

---

## 11. API Dependencies and Relationships

```mermaid
graph TD
    A[POST /api/login] -->|accessToken| B[GET /api/get-user-detail]
    B --> C[GET /api/sites]
    C -->|siteId| D[GET /api/pages-by-site-id/:siteId]
    C -->|siteId| E[GET /api/categories-by-site-id/:siteId]
    C -->|siteId| F[GET /api/tags-by-site-id/:siteId]
    C -->|siteId| G[GET /api/navigation-by-site-id/:siteId]
    C -->|siteId| H[GET /api/social-media-by-site-id/:siteId]
    C -->|siteId| I[GET /api/static-pages-by-site-id/:siteId]
    D -->|blogId| J[GET /api/single-page/:id]
    E -->|categoryId| K[GET /api/category/:id]
    F -->|tagId| L[GET /api/tags/:id]
    G -->|navId| M[GET /api/navigation/:id]
    H -->|socialId| N[GET /api/social-media/:id]
    I -->|staticPageId| O[GET /api/single-static-page/:id]
```

### Key Dependencies

1. **Login → All Admin APIs:** JWT token from login is required for all admin endpoints.
2. **Sites → Entities:** `siteId` from site list is needed to fetch blogs, categories, tags, navigation, social media, and static pages.
3. **Authors → Blogs:** `authorId` from author list can be used to filter blogs.
4. **Blogs → Public Blog Pages:** Blog `slug` and `category` are used in public URLs: `/post/{category}/{slug}`.

---

## 12. Third-Party APIs

### Cloudinary (Image Upload)

**Type:** Third-party cloud image hosting

**Usage:** Server-side image upload in `server/src/cloudinary.js`

**Endpoint:** `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`

**Authentication:** Signed upload with API key and SHA-1 signature

**Configuration:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` env vars

**Fallback:** If not configured, returns a stub Wikipedia URL

**Frontend does NOT interact with Cloudinary directly — all uploads go through the backend.**

---

## 13. Duplicate / Shared APIs

### Shared: GET `/categories` vs GET `/categories-by-site-id/:siteId`

| | `/categories` (Public) | `/categories-by-site-id/:siteId` (Admin) |
|---|---|---|
| **Used by** | Public Panel → Homepage | Admin Panel → Category List |
| **Behavior** | Extracts unique categories from blogs | Queries `categories` collection directly |
| **Response** | `[{ "categoryName": "..." }]` | `[{ _id, categoryName, createdAt }]` |

These are **different implementations** that serve different purposes.

### Shared: GET `/all-writers` (Public) vs GET `/api/authors` (Admin)

| | `/all-writers` (Public) | `/api/authors` (Admin) |
|---|---|---|
| **Used by** | Public Panel → Author blocks | Admin Panel → Author management |
| **Auth** | None | JWT required |

Same underlying data, same controller function (`handleWriters`/`handleAllWriters`), but different routes with different auth requirements.

### Shared: PUT `/api/single-site/:id` and DELETE `/api/single-site/:id`

These are **polymorphic endpoints** that handle both site and author operations:
- If body contains only `name` (no `isActive`), it updates the author
- If body contains `isActive`, it updates the site
- Same applies to DELETE

### Duplicate Route: `/static-page/:slug` and `/static-page-by-slug/:slug`

Both routes exist on the server (line 235 and 241 of `app.js`) and map to the same handler. The public panel uses both:
- `/static-page/:slug` via `serverCalls.js`
- `/static-page-by-slug/:slug` via direct `fetch()` in `app/post/[category]/page.js`

### Duplicate Route: `/categories` and `/category`

Both routes exist on the server (line 232 and 238 of `app.js`) and map to the same handler. The public panel uses both:
- `/categories` via `serverCalls.js`
- `/category` via direct `fetch()` in `categoryPost.js`

### Duplicate Route: `/blogs-by-category/:category` and `/pages-by-category/:category`

Both routes exist on the server (line 230 and 240 of `app.js`) and map to the same handler. The public panel uses both:
- `/blogs-by-category/:category` via `serverCalls.js`
- `/pages-by-category/:category` via direct `fetch()` in `app/post/[category]/page.js`

### Duplicate Route: `/meta-data/:page` and `/get-meta-by-page/:page`

Both routes exist on the server (line 222 and 239 of `app.js`) and map to the same handler. The public panel uses both:
- `/meta-data/:page` via `serverCalls.js`
- `/get-meta-by-page/:page` via direct `fetch()` in `helper.js`

---

## 14. API Coverage / Confidence

| # | Endpoint | Confidence | Notes |
|---|---|---|---|
| 1 | POST `/api/login` | Confirmed | Fully implemented in frontend + backend |
| 2 | GET `/api/get-user-detail` | Confirmed | Hardcoded response |
| 3 | GET `/api/sites` | Confirmed | |
| 4 | POST `/api/sites` | Confirmed | |
| 5 | GET `/api/single-site/:id` | Confirmed | |
| 6 | PUT `/api/single-site/:id` | Confirmed | Polymorphic (site/author) |
| 7 | DELETE `/api/single-site/:id` | Confirmed | Polymorphic (site/author) |
| 8-12 | Blog CRUD | Confirmed | |
| 13-17 | Category CRUD | Confirmed | |
| 18-22 | Tag CRUD | Confirmed | |
| 23-27 | Navigation CRUD | Confirmed | |
| 28-32 | Social Media CRUD | Confirmed | |
| 33-37 | Static Page CRUD | Confirmed | |
| 38-42 | Author CRUD | Confirmed | |
| 43 | POST `/api/upload-single-image` | Confirmed | |
| 44-55 | Public endpoints | Confirmed | |
| 56-58 | Alt site endpoints | Partial | Defined in routes but not used by frontend API clients |
| 59 | GET `/get-meta-by-page/:page` | Confirmed | Direct fetch in helper.js |
| 60 | GET `/pages-by-category/:category` | Confirmed | Direct fetch in category page |
| 61 | GET `/static-page-by-slug/:slug` | Confirmed | Direct fetch in category page |
| 62 | GET `/category` | Confirmed | Direct fetch in categoryPost.js |

---

## 15. API Flow Examples

### Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant S as Server (FastAPI)
    participant DB as PostgreSQL

    U->>F: Enter email + password
    F->>S: POST /api/login { email, password }
    S->>S: Validate with Pydantic
    S->>S: Compare against env vars
    S->>F: { accessToken: "eyJ..." }
    F->>F: localStorage.setItem('abToken', token)
    F->>F: axios.defaults.headers.common.Authorization = 'Bearer token'
    F->>S: GET /api/get-user-detail
    S->>F: { profilePic: {...}, name: "Rajesh" }
    F->>F: Navigate to /dashboard
```

### Admin CRUD Flow (Blog Example)

```mermaid
sequenceDiagram
    participant F as Frontend
    participant S as Server (FastAPI)
    participant DB as PostgreSQL

    F->>S: GET /api/sites
    S->>DB: select(sites)
    DB-->>S: [sites]
    S-->>F: [sites]

    Note over F: User selects site, navigates to blogs

    F->>S: GET /api/pages-by-site-id/{siteId}
    S->>DB: select(blogs).where(site_id=siteId)
    DB-->>S: [blogs]
    S-->>F: [blogs]

    Note over F: User clicks "Add New Blog"

    F->>S: POST /api/add-new-page { title, description, ... }
    S->>S: Validate with Pydantic
    S->>DB: insert(blog)
    DB-->>S: { id: "..." }
    S-->>F: { status: true, message: "Blog created", id: "..." }

    Note over F: Success message displayed
```

### Public Page Load Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js Server
    participant S as Backend Server (FastAPI)
    participant DB as PostgreSQL

    B->>N: GET / (homepage)
    N->>S: GET /logo
    S-->>N: { url: "..." }
    N->>S: GET /get-navigation
    S->>DB: select(navigation).where(site_id=...)
    S-->>N: [nav items]
    N->>S: GET /get-social-media
    S-->>N: [social items]
    N->>S: GET /single-fetaured
    S->>DB: select(blogs).where(featured=True)
    S-->>N: { blog }
    N->>S: GET /blogs
    S-->>N: [blogs]
    N->>S: GET /categories
    S-->>N: [categories]
    N->>S: GET /all-writers
    S-->>N: [authors]
    N->>B: Rendered HTML
```

---

## 16. Backend Implementation Notes

### Required Endpoints

All endpoints listed in the API Inventory (Section 4) are actively used by the frontend.

### Authentication

- **Single-user model:** Hardcoded email/password from env vars
- **JWT:** HS256, 1-hour expiry, no refresh token
- **Header:** `Authorization: Bearer <token>`
- **Storage key:** `abToken` in localStorage

### Error Handling Convention

- **Validation errors:** Return 400 with `{ error: "field: message; ..." }`
- **Not found:** Return 404 with `{ error: "Not Found" }`
- **Success create:** Return 200 with `{ status: true, message: "Entity created", id: "..." }`
- **Success update:** Return 200 with `{ status: true, message: "Updated" }`
- **Success delete:** Return 200 with `{ message: "Deleted!" }`

### Important: Error Key Mismatch

The server uses `{ error: "..." }` but the frontend expects `{ message: "..." }` in error responses. This means error messages are **not properly surfaced** to users. The backend should either:
- Change to `{ message: "..." }` for errors, OR
- The frontend should be updated to read `error.response.data.error` instead of `error.response.data.message`

### Date/Time Format

- **Creation/update timestamps:** Unix epoch milliseconds (`Date.now()`)
- **JWT expiry:** Unix epoch seconds

### ID Format

- UUID strings (generated by Python `uuid.uuid4()`)

### Enum Values

- No enum fields currently exist in the data models

### Status Values

- `isActive` (boolean) — only on sites
- `featured` (boolean) — only on blogs

### Validation

All request bodies validated with Pydantic schemas in `server/app/schemas.py`.

### CORS

Enabled via FastAPI CORS middleware for all origins.

### No Pagination

All list endpoints return complete collections. No `limit`, `offset`, `page`, or `cursor` parameters.

---

## 17. Unknowns / Questions for Backend

1. **Error response key mismatch:** Frontend reads `error.response.data.message` but server returns `{ error: "..." }`. Should the backend change to `{ message: "..." }`?

2. **Dashboard data:** The dashboard component (`pages/dashboard/dashboard.jsx`) exists but its route is commented out in `routes.jsx`. Does the backend need dashboard-specific aggregated endpoints?

3. **`REACT_APP_API_URL` vs `REACT_APP_API_BASE_URL`:** Both env vars exist and are used interchangeably. Should these be consolidated?

4. **User detail endpoint:** `GET /api/get-user-detail` returns a hardcoded response. Should this return actual user data from the database?

5. **Missing frontend usage:** Endpoints `GET /api/user-detail/:id`, `PUT /api/site/:id`, `DELETE /api/site/:id` (lines 217-219 of `app.js`) are defined but have no corresponding frontend API client methods. Are these legacy or planned?

6. **Navigation inline routes:** Some navigation routes in `app.js` (lines 150-176) use inline handlers instead of controller functions. Should these be consolidated?

7. **Maximum file upload size:** Not specified anywhere in frontend or backend.

8. **Blog category reference:** The public endpoint `GET /categories` extracts unique categories from blog `category` fields (strings), while the admin endpoint queries a separate `categories` collection. Should these be linked?

9. **`featured` blog field:** Only settable via PUT (update), not via POST (create). Should the create schema also support `featured`?

10. **Rate limiting:** No rate limiting on any endpoint. Should login or upload endpoints be rate-limited?

11. **Duplicate endpoint paths:** The server defines 4 pairs of duplicate routes that map to the same handler (`/categories` vs `/category`, `/blogs-by-category` vs `/pages-by-category`, `/static-page` vs `/static-page-by-slug`, `/meta-data` vs `/get-meta-by-page`). Should these be consolidated?

12. **Direct fetch in components:** Several Public Panel components bypass `serverCalls.js` and make direct `fetch()` calls. This creates maintenance issues and inconsistent error handling. Should all API calls be centralized?

13. **`encodedes` header:** Several direct `fetch()` calls include a header `encodedes: process.env.NEXT_PUBLIC_SITE_NAME` that is not consumed by the backend. What is its purpose?

---

*Document generated from frontend codebase analysis. All endpoints, request fields, and response structures are derived from actual code in the repository.*
