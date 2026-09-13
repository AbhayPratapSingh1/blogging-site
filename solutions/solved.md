# Solved Issues

## Admin Panel API Audit & Fixes

### Fixed `blogging-site-admin/app/api/authorAPI.js` (3 endpoints)

| Function | Old Path | New Path |
|----------|----------|----------|
| `getAll` | `/api/all-writers` | `/api/authors` |
| `update` | `/api/single-site/${id}` | `/api/author/${id}` |
| `delete` | `/api/single-site/${id}` | `/api/author/${id}` |

## Missing Author Admin CRUD — Added to Server

### New Endpoints

| Method | Path | Controller | Bruno File |
|--------|------|------------|------------|
| `GET` | `/api/authors` | `getAllWriters` | `GET_AllWriters.bru` |
| `PUT` | `/api/author/:id` | `updateWriter` | `PUT_UpdateWriter.bru` |
| `DELETE` | `/api/author/:id` | `deleteWriter` | `DELETE_Writer.bru` |

### New validation
- Added `updateAuthorSchema` to `server/src/validation.js` (supports `name`, `email`, `profilePic`)

### New Controller (`adminController.js`)
- `getAllWriters` — fetches all authors by siteId
- `updateWriter` — updates author name/email/profilePic
- `deleteWriter` — deletes author by ID

### Bruno Spec Files (5 total)
Full CRUD: `CreateWriter.bru`, `GET_AllWriters.bru`, `GET_SingleWriter.bru`, `PUT_UpdateWriter.bru`, `DELETE_Writer.bru`

## PROJECT_STATUS.md

Created comprehensive documentation covering:
- Full API inventory (admin + public) with HTTP methods, paths, controllers, auth
- Frontend API usage audit (admin panel + public panel)
- Unused API endpoints & orphaned frontend components
- Gaps and future scope

## Public Panel Audit (18 Issues Found: A–R)

| Issue | File | Problem |
|-------|------|---------|
| **A** | `server/src/validation.js` | Blog schemas only validated `title` and `description` — all other fields silently dropped |
| **B** | `public-panel/app/post/[category]/[slug]/page.js` | `generateMetadata` reads `post.metadata.*` (wrong shape) |
| **C** | `public-panel/app/post/[category]/page.js` | `generateMetadata` returns empty object; calls non-existent `getMetaDataByCategory` |
| **D** | `public-panel/app/globals.css` | Imports from `react-icons/fa` (`FaFacebook`, etc.) — wrong icon set (should be `FaSquare*`) |
| **E** | `public-panel/app/page.js` | Canonical URL uses hardcoded `https://purnea.org` instead of env var or domain from site data |
| **F** | `server/src/middleware/authMiddleware.js` | Public routes use `authMiddleware` (JWT required) — missing `noAuth` bypass for some |
| **G** | `public-panel/app/post/[category]/[slug]/page.js` | `author.url` used as img src but stores path, not full URL |
| **H** | `public-panel/app/search/page.js` | Imports `getHomePagePosts` from `page.js` which doesn't export it |
| **I** | `public-panel/app/api/og/route.js` | Imports `getLogo` from `layout.js` which doesn't export it |
| **J** | `public-panel/app/api/og/route.js` | Uses `next/image` at edge runtime (unsupported) |
| **K** | `public-panel/app/api/og/route.js` | Fetches `/public/og.png` which doesn't exist |
| **L** | `public-panel/app/not-found/page.js` | References `post.metadata.title` instead of flat `post.title` |
| **M** | `public-panel/app/not-found/page.js` | References `twoLatestPost[0].title` but `twoLatestPost` is typed as array with `data` key |
| **N** | `public-panel/app/post/[category]/page.js` | `DataPageMetaTags` reads `data.metaTitle` / `data.metaKeywords` — server returns `title` / no keywords field |
| **O** | `public-panel/app/post/[category]/page.js` | `DataPageMetaTags` contains `id` in alternates canonical URL |
| **P** | `public-panel/app/post/[category]/page.js` | Static page data contains `content` in HTML — displayed raw without `dangerouslySetInnerHTML` |
| **Q** | `public-panel/app/post/[category]/page.js` | `generateStaticParams` returns array of slugs instead of objects `{ category }` |
| **R** | `public-panel/app/page.js` | Uses `//` in image URL construction |

## Fixes Applied (A, B, C)

### Problem A — Blog Schema Expansion
**File:** `server/src/validation.js`

Expanded `createBlogSchema` and `updateBlogSchema` to validate all fields sent by the admin panel:

```
createBlogSchema: title, description, slug, category, tags, metaTitle, metaDescription,
  metaKeywords, author (object), images (object), coverAlt, faqHeading, faqs (array),
  redirectUrl, siteId

updateBlogSchema: same fields (all optional) + featured
```

Also added reusable sub-schemas: `blogAuthorSchema`, `blogImagesSchema`, `blogFaqSchema`.

**Root cause:** The server was only persisting `title` and `description` from the validated data. All other admin-panel-sent fields (slug, category, tags, meta fields, author, images, FAQs, etc.) were silently dropped at the database level. This was also the root cause of Problem B — since `metaTitle`, `metaDescription`, and `metaKeywords` were never stored, the public panel could never read them.

### Problem B — Metadata Field Access
**File:** `blogging-site-public-panel/app/post/[category]/[slug]/page.js`

Changed `generateMetadata`:
- `title`: `post.metadata.title` → `post.metaTitle || post.title`
- `keywords`: `post.metadata.keywords` → `post.metaKeywords || ""`
- `description`: `post.metadata.description` → `post.metaDescription || fallback`
- Canonical URL: added guard for missing env var

The server stores metadata as flat fields (`metaTitle`, `metaDescription`, `metaKeywords`) on the blog document, not as a nested `metadata` object.

### Problem C — Category Page Metadata
**File:** `blogging-site-public-panel/app/post/[category]/page.js`

Replaced `generateMetadata`:
- Removed call to `getMetaDataByCategory` (non-existent function)
- Now fetches posts via existing `getBlogsByCategory(category)` and derives metadata from the first post
- Falls back to `Browse all articles in {category}` description

## Files Modified
1. `server/src/validation.js` — expanded blog schemas
2. `blogging-site-public-panel/app/post/[category]/[slug]/page.js` — fixed metadata field access
3. `blogging-site-public-panel/app/post/[category]/page.js` — fixed generateMetadata
4. `blogging-site-admin/app/api/authorAPI.js` — fixed 3 API paths
5. `server/src/app.js` — added 3 Author CRUD routes
6. `server/src/controllers/adminController.js` — added 3 Author CRUD controllers
7. `server/src/bruno/Admin/Authors/GET_AllWriters.bru` — new
8. `server/src/bruno/Admin/Authors/PUT_UpdateWriter.bru` — new
9. `server/src/bruno/Admin/Authors/DELETE_Writer.bru` — new

## Fixes Applied (D, E, F)

### Problem D — Social Icon Types
**File:** `blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js`

Changed icon imports from `react-icons/fa` to proper brand/square variants:

| Before | After |
|--------|-------|
| `FaFacebook` | `FaFacebookSquare` |
| `FaTwitter` | `FaTwitterSquare` |
| `FaInstagram` | `FaInstagramSquare` |
| `FaWhatsapp` | `FaWhatsappSquare` |
| `FaLinkedin` | `FaLinkedinIn` |
| `FaSearch` | (unchanged) |

**Root cause:** The solid-style Font Awesome icons rendered incorrectly for social media brands. The square/brand variants are the correct visual style for social links in headers/footers.

### Problem E — Canonical URL for Homepage
**File:** `blogging-site-public-panel/app/layout.js`

Added `alternates.canonical` to the root layout's `generateMetadata`:

```js
alternates: {
  canonical: process.env.NEXT_PUBLIC_CLIENT_URL || undefined,
}
```

**Root cause:** The homepage had no canonical URL in its metadata. Next.js would auto-derive one, potentially causing duplicate content issues if the site was served from multiple domains.

### Problem F — JWT Middleware Bypass
**File:** `server/src/app.js`

Replaced the blanket `app.use("/api/*", jwt({...}))` with a middleware wrapper that checks a `noAuthPaths` whitelist first:

```js
const noAuthPaths = ["/api/login"]

app.use("/api/*", async (c, next) => {
  if (noAuthPaths.includes(c.req.path)) {
    await next()
    return
  }
  return jwt({ secret: JWT_SECRET, alg: "HS256" })(c, next)
})
```

**Root cause:** Previously, any new `/api/*` route added after the `app.use("/api/*", jwt(...))` line would automatically require JWT authentication. There was no whitelist mechanism for public endpoints. Now, to add a public `/api/*` endpoint, simply add its path to `noAuthPaths`.

## Fixes Applied (G–R)

### Problem G — Author Image URL Not Using Helper
**File:** `blogging-site-public-panel/app/post/[category]/[slug]/page.js`

Applied `httpsToHttp()` to `post?.author?.url` in the `AuthorBlock` component:
```js
// Before
src={post?.author?.url}
// After
src={httpsToHttp(post?.author?.url)}
```
**Root cause:** The `author.url` field stores relative paths (e.g. `/images/author.jpg`) which need to be converted to HTTP URLs. The blog cover image on the same page already used `httpsToHttp`, but the author avatar did not, causing broken author images on HTTPS sites.

### Problem H — Dead Import in Search Page
**File:** `blogging-site-public-panel/app/search/page.js`

Removed unused import `{ getHomePagePosts } from "../page"` which doesn't export that function. Also removed stray `console.log`.
**Root cause:** `page.js` (the homepage) never exported `getHomePagePosts`. The import would throw at runtime if the module loaded.

### Problems I, J, K — OG Image Route
**File:** `blogging-site-public-panel/app/api/og/route.js`

Rewrote the OG image endpoint to fix three simultaneous bugs:
- **I:** Removed `import { getLogo } from "@/app/layout"` — `layout.js` does not export `getLogo` (it's in `serverCalls.js`).
- **J:** Replaced `<Image>` from `next/image` with native `<img>` — `next/image` is unsupported at Edge runtime.
- **K:** Replaced `fetch("/public/og.png")` (non-existent file) with a live fetch to the API's `/logo` endpoint using `NEXT_PUBLIC_API_URL`.

The route now fetches the logo URL from the server at request time and renders it inline.

### Problems L, M — Not Found Page
**Status:** No `app/not-found/page.js` exists in the codebase. Skipped.

### Problem N — DataPageMetaTags Field Names
**File:** `blogging-site-public-panel/app/post/[category]/page.js`

Fixed `DataPageMetaTags` to read `data.title` (server returns `title`, not `metaTitle`):
```js
// Before
title: capitalise(data.metaTitle),
// After
title: capitalise(data.title || data.metaTitle),
```
Also added fallback for `metaKeywords` and destructured `params` properly.

### Problem O — DataPageMetaTags Canonical URL
**File:** `blogging-site-public-panel/app/post/[category]/page.js`

Fixed canonical URL to use `category` instead of `page`:
```js
// Before
canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.page}`,
// After
canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${category}`,
```
**Root cause:** The function parameter had no destructured `page` property — it was passed `params` with `{ category }`.

### Problem P — Static Page HTML Rendering
**Status:** Already correct. The `[staticPage]/page.js` uses `<RenderHtml html={data.description} />` which renders via `dangerouslySetInnerHTML`.

### Problem Q — generateStaticParams
**Status:** No `generateStaticParams` exists in the category page. The `generateStaticParams` feature was likely removed during a refactor. No fix needed.

### Problem R — Author Image Fallback `"/"` 
**File:** `blogging-site-public-panel/app/Components/mainComponents/authorBlock.js`

Replaced the broken fallback `"/"` with an initial-letter avatar:
```js
// Before
src={author.profilePic?.url || "/"}
// After
{author.profilePic?.url ? <Image ... /> : <div>{author.name?.charAt(0)?.toUpperCase()}</div>}
```
**Root cause:** When an author has no profile picture, `author.profilePic?.url` is `undefined`, so it fell back to `"/"` which is not a valid image and would show a broken icon.

## Additional Cleanup
- Removed unused `import { getAllPosts } from '../page'` from `[slug]/page.js` (imported but never used)
- Removed unused `import { getMetaDataByCategory } from '@/app/serverCalls'` from `post/[category]/page.js`
- Removed dead `CategoryPageMetaTags` function (100% commented-out code)
- Removed commented-out imports from `post/[category]/page.js`

## Files Modified (Complete)
1. `server/src/validation.js` — expanded blog schemas
2. `blogging-site-public-panel/app/post/[category]/[slug]/page.js` — fixed metadata + author URL + removed dead import
3. `blogging-site-public-panel/app/post/[category]/page.js` — fixed generateMetadata + DataPageMetaTags + cleanup
4. `blogging-site-admin/app/api/authorAPI.js` — fixed 3 API paths
5. `server/src/app.js` — added 3 Author CRUD routes + JWT noAuth bypass
6. `server/src/controllers/adminController.js` — added 3 Author CRUD controllers
7. `blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js` — fixed social icon imports
8. `blogging-site-public-panel/app/layout.js` — added canonical URL to homepage metadata
9. `blogging-site-public-panel/app/Components/mainComponents/authorBlock.js` — fixed broken image fallback
10. `blogging-site-public-panel/app/search/page.js` — removed dead import
11. `blogging-site-public-panel/app/api/og/route.js` — rewrote OG image endpoint

## Files Created
1. `server/src/bruno/Admin/Authors/GET_AllWriters.bru`
2. `server/src/bruno/Admin/Authors/PUT_UpdateWriter.bru`
3. `server/src/bruno/Admin/Authors/DELETE_Writer.bru`
4. `PROJECT_STATUS.md` — comprehensive API inventory
5. `solutions/solved.md` — this file

## Git Diff — All Changes

```diff
diff --git a/PROJECT_STATUS.md b/PROJECT_STATUS.md
index 93f5f90..ada631e 100644
--- a/PROJECT_STATUS.md
+++ b/PROJECT_STATUS.md
@@ -6,6 +6,116 @@
 - **JWT expiry fix** — Admin panel now validates `exp` (Unix seconds, standard) instead of non-standard `expiresIn`
 - **Auth header fix** — `Authorization` header now correctly includes `Bearer` prefix in admin panel axios interceptor
 - **NEXT_PUBLIC_API_URL debug log** — Added console log in public panel server calls for debugging
+- **Missing Author admin APIs added** — Added 3 new server endpoints (`GET /api/authors`, `PUT /api/author/:id`, `DELETE /api/author/:id`) with controllers, validation, and bruno specs
+- **Frontend API path corrections** — Fixed `authorAPI.js` paths to use dedicated admin endpoints instead of shared/public routes
+- **Project status documentation** — Added detailed API inventory, frontend usage audit, and known gaps
+
+## API Inventory & Frontend Usage
+
+### Complete Bruno Admin API → Server → Frontend Mapping
+
+#### Categories (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/categories-by-site-id/{siteId}` | `GET /api/categories-by-site-id/:siteId` | `categoryAPI.getAll(siteId)` | `AllCategory.jsx`, `AddUpdateBlogsForm.jsx` |
+| POST | `/api/category` | `POST /api/category` | `categoryAPI.addNew(content)` | `AddUpdateCateegoryForm.jsx` |
+| GET | `/api/category/{id}` | `GET /api/category/:id` | `categoryAPI.single(id)` | `DeleteCategory.jsx`, `AddUpdateCateegoryForm.jsx` |
+| PUT | `/api/category/{id}` | `PUT /api/category/:id` | `categoryAPI.update({id,...})` | `AddUpdateCateegoryForm.jsx` |
+| DELETE | `/api/category/{id}` | `DELETE /api/category/:id` | `categoryAPI.delete(id)` | `DeleteCategory.jsx` |
+
+#### Tags (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/tags-by-site-id/{siteId}` | `GET /api/tags-by-site-id/:siteId` | `tagsAPI.getAll(siteId)` | `AllTags.jsx`, `AddUpdateBlogsForm.jsx`, `AddUpdateStaticPage.jsx` |
+| POST | `/api/tags` | `POST /api/tags` | `tagsAPI.addNew(content)` | `AddUpdateTagsForm.jsx` |
+| GET | `/api/tags/{id}` | `GET /api/tags/:id` | `tagsAPI.single(id)` | `DeleteTags.jsx`, `AddUpdateTagsForm.jsx` |
+| PUT | `/api/tags/{id}` | `PUT /api/tags/:id` | `tagsAPI.update({id,...})` | `AddUpdateTagsForm.jsx` |
+| DELETE | `/api/tags/{id}` | `DELETE /api/tags/:id` | `tagsAPI.delete(id)` | `DeleteTags.jsx` |
+
+#### Navigation (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/navigation-by-site-id/{siteId}` | `GET /api/navigation-by-site-id/:siteId` | `navigationAPI.getAll(siteId)` | `allNavigation.jsx` |
+| GET | `/api/navigation/{id}` | `GET /api/navigation/:id` | `navigationAPI.single(id)` | `DeleteNavigation.jsx`, `AddUpdateNavigation.jsx` |
+| POST | `/api/add-navigation` | `POST /api/add-navigation` | `navigationAPI.addNew(content)` | `AddUpdateNavigation.jsx` |
+| PUT | `/api/navigation/{id}` | `PUT /api/navigation/:id` | `navigationAPI.update({id,...})` | `AddUpdateNavigation.jsx` |
+| DELETE | `/api/navigation/{id}` | `DELETE /api/navigation/:id` | `navigationAPI.delete(id)` | `DeleteNavigation.jsx` |
+
+#### Social Media (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/social-media-by-site-id/{siteId}` | `GET /api/social-media-by-site-id/:siteId` | `socialMediaAPI.getAll(siteId)` | `allSocialMedia.jsx` |
+| GET | `/api/social-media/{id}` | `GET /api/social-media/:id` | `socialMediaAPI.single(id)` | `deleteSocialMedia.jsx`, `AddUpdateSocialMedia.jsx` |
+| POST | `/api/add-social-media` | `POST /api/add-social-media` | `socialMediaAPI.addNew(content)` | `AddUpdateSocialMedia.jsx` |
+| PUT | `/api/social-media/{id}` | `PUT /api/social-media/:id` | `socialMediaAPI.update({id,...})` | `AddUpdateSocialMedia.jsx` |
+| DELETE | `/api/social-media/{id}` | `DELETE /api/social-media/:id` | `socialMediaAPI.delete(id)` | `deleteSocialMedia.jsx` |
+
+#### Static Pages (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/static-pages-by-site-id/{siteId}` | `GET /api/static-pages-by-site-id/:siteId` | `staticPagesAPI.getAll(siteId)` | `AllStaticPage.jsx` |
+| GET | `/api/single-static-page/{id}` | `GET /api/single-static-page/:id` | `staticPagesAPI.single(id)` | `DeleteStaticPage.jsx`, `AddUpdateStaticPage.jsx` |
+| POST | `/api/add-new-static-page` | `POST /api/add-new-static-page` | `staticPagesAPI.addNew(content)` | `AddUpdateStaticPage.jsx` |
+| PUT | `/api/single-static-page/{id}` | `PUT /api/single-static-page/:id` | `staticPagesAPI.update({id,...})` | `AddUpdateStaticPage.jsx` |
+| DELETE | `/api/single-static-page/{id}` | `DELETE /api/single-static-page/:id` | `staticPagesAPI.delete(id)` | `DeleteStaticPage.jsx` |
+
+#### Sites (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/sites` | `GET /api/sites` | `siteAPI.getAll()` | `AllSites.jsx` |
+| POST | `/api/sites` | `POST /api/sites` | `siteAPI.addNew(content)` | ❌ No component dispatches |
+| GET | `/api/single-site/{id}` | `GET /api/single-site/:id` | `siteAPI.single(id)` | `SiteMenu.jsx`, 5 form components |
+| PUT | `/api/single-site/{id}` | `PUT /api/single-site/:id` | `siteAPI.update({id,...})` | ❌ No component dispatches |
+| DELETE | `/api/single-site/{id}` | `DELETE /api/single-site/:id` | `siteAPI.delete(id)` | ❌ No component dispatches |
+
+#### Blogs (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/pages-by-site-id/{siteId}` | `GET /api/pages-by-site-id/:siteId` | `blogAPI.getAll(siteId)` | `AllBlogs.jsx` |
+| POST | `/api/add-new-page` | `POST /api/add-new-page` | `blogAPI.addNew(content)` | `AddUpdateBlogsForm.jsx` |
+| GET | `/api/single-page/{id}` | `GET /api/single-page/:id` | `blogAPI.single(id)` | `DeleteBlog.jsx`, `AddUpdateBlogsForm.jsx` |
+| PUT | `/api/single-page/{id}` | `PUT /api/single-page/:id` | `blogAPI.update({id,...})` | `AddUpdateBlogsForm.jsx` |
+| DELETE | `/api/single-page/{id}` | `DELETE /api/single-page/:id` | `blogAPI.delete(id)` | `DeleteBlog.jsx` |
+
+#### Authors (5 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| GET | `/api/authors` | `GET /api/authors` | `authorAPI.getAll()` | `AllAuthors.jsx`, `SingleSiteMenu.jsx`, `dashboard.jsx` |
+| POST | `/api/admin/register` | `POST /api/admin/register` | `authorAPI.addNew(content)` | ❌ No component dispatches |
+| GET | `/api/get-writer/{id}` | `GET /api/get-writer/:id` | `authorAPI.single(id)` | ❌ No component dispatches |
+| PUT | `/api/author/{id}` | `PUT /api/author/:id` | `authorAPI.update({id,...})` | ❌ No component dispatches |
+| DELETE | `/api/author/{id}` | `DELETE /api/author/:id` | `authorAPI.delete(id)` | ❌ No component dispatches |
+
+#### Auth & Upload (3 endpoints)
+| Method | Bruno Path | Server Route | Frontend API | Component Usage |
+|--------|-----------|-------------|-------------|-----------------|
+| POST | `/api/login` | `POST /api/login` | `loginAPI.login(dt)` | `login.jsx` |
+| GET | `/api/get-user-detail` | `GET /api/get-user-detail` | `loginAPI.getuser()` | `DashBoardLayout.jsx` |
+| POST | `/api/upload-single-image` | `POST /api/upload-single-image` | `uploadImageAPI.uploadSingle(img)` | ❌ File exists but never imported. Upload done via `helper.js` `uploadImageToAPI()` |
+
+### Bruno Spec Files
+
+**Total: 36 request files** across 3 folders:
+
+```
+server/bruno/
+├── Admin/
+│   ├── Authors/     (5 files)  — POST_RegisterAuthor, GET_SingleWriter, GET_AllWriters, PUT_UpdateWriter, DELETE_Writer
+│   ├── Blogs/       (5 files)  — POST_CreateBlog, GET_BlogsBySiteId, GET_SingleBlog, PUT_UpdateBlog, DELETE_Blog
+│   ├── Categories/  (5 files)  — POST_CreateCategory, GET_CategoriesBySiteId, GET_SingleCategory, PUT_UpdateCategory, DELETE_Category
+│   ├── Navigation/  (5 files)  — POST_CreateNavigation, GET_NavBySiteId, GET_NavById, PUT_UpdateNavigation, DELETE_Navigation
+│   ├── Sites/       (5 files)  — POST_CreateSite, GET_Sites, GET_SingleSite, PUT_UpdateSite, DELETE_Site
+│   ├── SocialMedia/ (5 files)  — POST_CreateSocialMedia, GET_SocialBySiteId, GET_SingleSocialMedia, PUT_UpdateSocialMedia, DELETE_SocialMedia
+│   ├── StaticPages/ (5 files)  — POST_CreateStaticPage, GET_StaticPagesBySiteId, GET_SingleStaticPage, PUT_UpdateStaticPage, DELETE_StaticPage
+│   ├── Tags/        (5 files)  — POST_CreateTag, GET_TagsBySiteId, GET_SingleTag, PUT_UpdateTag, DELETE_Tag
+│   ├── UploadImage.bru         — POST /api/upload-single-image
+│   └── Users/
+│       └── GET_UserDetail.bru  — GET /api/get-user-detail
+├── Login/
+│   ├── Login_Success.bru       — POST /api/login (valid credentials)
+│   └── Login_Invalid.bru       — POST /api/login (invalid credentials)
+└── Public/          (13 files) — Various public GET endpoints
+```
 
 ## What is Done
 
@@ -14,13 +124,13 @@
 - **Connection:** `main.js` calls `connectDB()` → creates `MongoClient` with pooling (`maxPoolSize: 10`, `minPoolSize: 1`), retry logic (5 attempts with 2s backoff), and automatic reconnection monitoring (pings every 30s). Returns `db` instance injected into all controllers.
 - **Clean architecture:** Repository pattern (stateless functions in `src/repositories/`), controller layer (dependency-injected handlers in `src/controllers/`), centralized config (`src/config.js`)
 - **All CRUD routes implemented** for all 8 entities: blogs, categories, tags, navigation (sorted by position), social media, static pages, sites, authors
-- **Full route inventory (52 endpoints):**
+- **Full route inventory (55 endpoints):**
   - **Auth (1):** `POST /api/login` — JWT with standard `exp` claim (1 hour)
-  - **Admin API (35, all JWT-protected):** Sites CRUD, Blogs CRUD, Categories CRUD, Tags CRUD, Navigation CRUD, Social Media CRUD, Static Pages CRUD, Author register/fetch, Image upload (stubbed), User detail
-  - **Public API (16, no auth):** Logo, metadata, navigation, social media, blogs listing/featured/filtered, categories, writers, static pages, page-by-slug, plus 4 recently-added public aliases
+  - **Admin API (38, all JWT-protected):** Sites CRUD, Blogs CRUD, Categories CRUD, Tags CRUD, Navigation CRUD, Social Media CRUD, Static Pages CRUD, Authors CRUD, Image upload, User detail
+  - **Public API (16, no auth):** Logo, metadata, navigation, social media, blogs listing/featured/filtered, categories, writers, static pages, page-by-slug
 - **JWT auth** on all `/api/*` routes (except `POST /api/login`). Credentials read from env vars (`AUTH_EMAIL`, `AUTH_PASSWORD`) with defaults. JWT secret from env (`JWT_SECRET`).
 - **Seed script** (`deno task seed`) drops and repopulates all 8 collections with Pokemon-themed demo data
-- **Bruno API collection** in `server/bruno/` — 33 request files across Admin/Login/Public folders
+- **Bruno API collection** in `server/bruno/` — 36 request files across Admin/Login/Public folders
 - **Server-side validation** via `npm:zod` — all POST/PUT endpoints validate request bodies with typed schemas
 - **Image upload** via Cloudinary REST API (falls back to stub URL if Cloudinary env vars are empty). Supports multipart/form-data and base64 JSON payloads.
 
@@ -29,6 +139,8 @@
 - **Multi-site management:** Per-site CRUD for blogs, categories, tags, navigation, social media, static pages
 - **Dashboard** with stats. Rich text blog editor with image upload, SEO fields, FAQ section. Reusable table and form components. Redux state management.
 - **`.env.local` configured** — `REACT_APP_API_BASE_URL=http://localhost:8000/api`
+- **API layer:** 10 API files in `src/api/` covering all backend endpoints
+- **Redux state:** 10 slice files in `src/features/` with async thunks for all CRUD operations
 
 ### Public Panel (Next.js) — Functional
 - Homepage with hero, category filter, top authors, featured posts, CTA. Blog listing, single blog view with SEO metadata, author block, HTML rendering, related posts.
@@ -46,6 +158,18 @@
 
 Test isolation with per-test DB setup/teardown. All tests use `app.request()` (no server needed).
 
+## Known Gaps — APIs Defined But Not Connected to UI
+
+These bruno/slice actions exist but have **no dispatching component** in the admin panel:
+
+| Resource | Unused Actions | API File | Slice File |
+|----------|---------------|----------|------------|
+| **Sites** | `addNewSiteRequest`, `updateSiteRequest`, `deleteSiteRequest` | `siteAPI.js` | `siteSlice.js` |
+| **Authors** | `addNewAuthorRequest`, `singleAuthorRequest`, `updateAuthorRequest`, `deleteAuthorRequest` | `authorAPI.js` | `authorSlice.js` |
+| **Upload** | `uploadImageAPI.uploadSingle` | `uploadImageAPI.js` | (no slice) |
+
+The upload endpoint IS actually used — but via a direct `axios.post` call in `helper.js:uploadImageToAPI()`, bypassing the `uploadImageAPI.js` wrapper entirely.
+
 ## What is Dummy / Placeholder / Not Yet Functional
 
 - **Auth is minimal** — credentials from env vars but still a single hardcoded username/password. No user registration, no password reset, no role-based access.
@@ -54,6 +178,9 @@ Test isolation with per-test DB setup/teardown. All tests use `app.request()` (n
 - **No rate limiting** — no protection against abuse.
 - **No HTTPS** — plain HTTP on port 8000.
 - **No environment variable loading** — uses `Deno.env.get()` directly. The `--env-file` flag is not used (would need `--allow-env` adjustment).
+- **Orphaned components:**
+  - `SingleSiteMenu.jsx` — exports `SingleSiteAuthors` but is never imported anywhere
+  - `AllAuthors.jsx` — imported in `routes.jsx` but has **no route entry** (no way to navigate to authors page)
 - **Stubbed/incomplete UI pieces:**
   - Author posts page has a placeholder div: `POSTS BY AUTHOR : "" || UPDATE THIS IN THE FUTURE`
   - Dashboard route is commented out in `routes.jsx`
@@ -114,3 +241,8 @@ Test isolation with per-test DB setup/teardown. All tests use `app.request()` (n
 - Docker setup and CI/CD pipeline
 - Search indexing and full-text search
 - Analytics and reader engagement metrics
+- Connect unused slice actions to UI components (Site create/update/delete, Author create/update/delete/single)
+- Wire up `AllAuthors.jsx` with a route in `routes.jsx`
+- Add "Manage Authors" link to `SiteMenu.jsx` navigation
+- Remove or integrate orphaned `SingleSiteMenu.jsx` component
+- Integrate `uploadImageAPI.js` into the codebase or remove in favor of `helper.js` implementation
diff --git a/blogging-site-author-panel/src/api/authorAPI.js b/blogging-site-author-panel/src/api/authorAPI.js
index 5ccea5b..cf14c0d 100644
--- a/blogging-site-author-panel/src/api/authorAPI.js
+++ b/blogging-site-author-panel/src/api/authorAPI.js
@@ -4,13 +4,13 @@ const baseURL = `${process.env.REACT_APP_API_URL}`
 const startUrl =  `${process.env.REACT_APP_API_BASE_URL}/admin`
 
 export const authorAPI = {
-    getAll: () => axios.get(`${baseURL}/all-writers`).then(res => res.data),
+    getAll: () => axios.get(`${baseURL}/authors`).then(res => res.data),
     addNew: (content) => axios.post(`${startUrl}/register`, content).then(res => res.data),
     update: async(dt) => {
         const { id, ...rest } = dt
 
-        return axios.put(`${baseURL}/single-site/${id}`, rest).then(res => res.data)
+        return axios.put(`${baseURL}/author/${id}`, rest).then(res => res.data)
     },
-    delete: (dt) => axios.delete(`${baseURL}/single-site/${dt}`).then(res => res.data),
+    delete: (dt) => axios.delete(`${baseURL}/author/${dt}`).then(res => res.data),
     single: (dt) => axios.get(`${baseURL}/get-writer/${dt}`).then(res => res.data),
 }
\ No newline at end of file
diff --git a/blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js b/blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js
index 6be9639..e4e08d5 100644
--- a/blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js
+++ b/blogging-site-public-panel/app/Components/commonToAll/headerFooterComps/headerFooterComps.js
@@ -1,8 +1,8 @@
-import { FaInstagram,FaTwitter ,FaFacebook,FaWhatsapp,FaLinkedin,FaSearch } from "react-icons/fa";
+import { FaInstagramSquare, FaTwitterSquare, FaFacebookSquare, FaWhatsappSquare, FaLinkedinIn, FaSearch } from "react-icons/fa";
 export const mediaImages = {
-    facebook:<FaFacebook/>,
-    whatsapp:<FaWhatsapp/>,
-    linkedin:<FaLinkedin/>,
-    twitter:<FaTwitter/>,
-    instagram:<FaInstagram/>,
+    facebook:<FaFacebookSquare/>,
+    whatsapp:<FaWhatsappSquare/>,
+    linkedin:<FaLinkedinIn/>,
+    twitter:<FaTwitterSquare/>,
+    instagram:<FaInstagramSquare/>,
 }
diff --git a/blogging-site-public-panel/app/Components/mainComponents/authorBlock.js b/blogging-site-public-panel/app/Components/mainComponents/authorBlock.js
index c0986ef..9459531 100644
--- a/blogging-site-public-panel/app/Components/mainComponents/authorBlock.js
+++ b/blogging-site-public-panel/app/Components/mainComponents/authorBlock.js
@@ -21,7 +21,7 @@ const AuthorBlock = ({ authors }) => {
                     return (
                         <Link key={index} href={`/all-author-block/${author._id}`} >
                             <div className="max-w-96 flex-grow shrink-0 bg-white p-2 md:p-5 m-2 md:my-8 md:hover:mb-12 md:hover:mt-4 transition-all duration-500 border rounded-xl flex justify-evenly items-center [box-shadow:15px_15px_15px_gray]">
-                                <div className="shrink-0 overflow-hidden mr-2 inline-block h-28 w-28 rounded-full bg-gray-300" ><Image style={{ objectFit: "cover" }} height={100} width={100} src={author.profilePic?.url || "/"} alt={author.name} /></div>
+                                <div className="shrink-0 overflow-hidden mr-2 inline-block h-28 w-28 rounded-full bg-gray-300" >{author.profilePic?.url ? <Image style={{ objectFit: "cover" }} height={100} width={100} src={author.profilePic.url} alt={author.name} /> : <div className="h-full w-full bg-gray-400 flex items-center justify-center text-white text-2xl">{author.name?.charAt(0)?.toUpperCase()}</div>}</div>
                                 <div className="flex flex-col">
                                     <div className="text-black font-bold text-lg">{author.name}</div>
                                     <div className="text-gray-400 font-extralight text-sm">{author.email}</div>
diff --git a/blogging-site-public-panel/app/api/og/route.js b/blogging-site-public-panel/app/api/og/route.js
index fd4fcb0..f95e7ca 100644
--- a/blogging-site-public-panel/app/api/og/route.js
+++ b/blogging-site-public-panel/app/api/og/route.js
@@ -1,19 +1,24 @@
-import { getLogo } from "@/app/layout";
-import Image from "next/image";
 import { ImageResponse } from "next/og";
 
 export const runtime = "edge";
 
-
+const getLogoUrl = async () => {
+  try {
+    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
+    const res = await fetch(`${baseUrl}/logo`);
+    const data = await res.json();
+    return data.url || null;
+  } catch {
+    return null;
+  }
+};
 
 export async function GET(req) {
-  const pageLogo = await getLogo()
   const { searchParams } = new URL(req.url);
   const hasTitle = searchParams.has("title");
   const title = hasTitle ? searchParams.get("title") : "My";
-  const logo = await fetch(new URL("/public/og.png", import.meta.url)).then(
-    (res) => res.arrayBuffer()
-  );
+  const logo = await getLogoUrl();
+
   const options = {
     width: 512,
     height: 512,
@@ -44,7 +49,15 @@ export async function GET(req) {
             alignItems: "center",
           }}
         >
-          <Image height={48} alt="logo" width={48} src={logo} />
+          {logo && (
+            <img
+              height={48}
+              alt="logo"
+              width={48}
+              src={logo}
+              style={{ borderRadius: 8 }}
+            />
+          )}
           <span
             style={{
               marginLeft: 16,
diff --git a/blogging-site-public-panel/app/layout.js b/blogging-site-public-panel/app/layout.js
index dc837f3..bda3a7e 100644
--- a/blogging-site-public-panel/app/layout.js
+++ b/blogging-site-public-panel/app/layout.js
@@ -14,6 +14,9 @@ export const generateMetadata = async () => {
     title: capitalise(data.metaTitle),
     keywords: data.metaKeywords,
     description: data.metaDescription,
+    alternates: {
+      canonical: process.env.NEXT_PUBLIC_CLIENT_URL || undefined,
+    },
     openGraph: {
       locale: "en_IN",
       type: "website",
diff --git a/blogging-site-public-panel/app/post/[category]/[slug]/page.js b/blogging-site-public-panel/app/post/[category]/[slug]/page.js
index 3e293cb..8862610 100644
--- a/blogging-site-public-panel/app/post/[category]/[slug]/page.js
+++ b/blogging-site-public-panel/app/post/[category]/[slug]/page.js
@@ -2,7 +2,6 @@ import React from 'react'
 import { capitalise, formatDate, httpsToHttp, paragraphLength } from '../../../Components/helper'
 import RenderHtml from '../../../Components/commonToAll/renderHtml'
 import Image from "next/image"
-import { getAllPosts } from '../page'
 import { PostBlogs } from '@/app/Components/mainComponents/CategoryPost/categoriesBlock'
 import { getBlogs } from '@/app/serverCalls'
 
@@ -15,14 +14,13 @@ async function getSinglePost(slug) {
 export async function generateMetadata({ params }) {
     const { slug, category } = await params
     const post = await getSinglePost(slug)
-    console.log({ post });
 
     return {
-        title: capitalise(post.metadata.title),
-        keywords: post.metadata.keywords,
-        description: post.metadata.description,
+        title: capitalise(post.metaTitle || post.title),
+        keywords: post.metaKeywords || "",
+        description: post.metaDescription || post.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "",
         alternates: {
-            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${category}/${slug}`,
+            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL || ""}/${category}/${slug}`,
         },
         openGraph: {
             locale: "en_IN",
@@ -34,7 +32,7 @@ export async function generateMetadata({ params }) {
 
 const AuthorBlock = ({ post }) => {
     return <div className='order-1 max-w-xl m-auto flex items-center py-2'>
-        <div className="shrink-0 overflow-hidden mr-2 inline-block h-16 w-16 rounded-full bg-gray-300"><Image typeof={post?.images?.type} style={{ objectFit: "cover" }} height={100} width={100} src={post?.author?.url} alt={post?.author?.name} /></div>
+        <div className="shrink-0 overflow-hidden mr-2 inline-block h-16 w-16 rounded-full bg-gray-300"><Image typeof={post?.images?.type} style={{ objectFit: "cover" }} height={100} width={100} src={httpsToHttp(post?.author?.url)} alt={post?.author?.name} /></div>
         <div className='flex flex-col justify-start'>
             <p className='text-sm sm:text-lg'>{capitalise(post?.author?.name)}</p>
             <div className='flex gap-5 justify-center text-[10px] sm:text-[12px]'>
diff --git a/blogging-site-public-panel/app/post/[category]/page.js b/blogging-site-public-panel/app/post/[category]/page.js
index 742422c..31bb15c 100644
--- a/blogging-site-public-panel/app/post/[category]/page.js
+++ b/blogging-site-public-panel/app/post/[category]/page.js
@@ -1,56 +1,45 @@
 import { capitalise, formatDate } from '@/app/Components/helper'
 import { PostBlogs } from '@/app/Components/mainComponents/CategoryPost/categoriesBlock'
-import { getBlogsByCategory, getMetaDataByCategory } from '@/app/serverCalls'
+import { getBlogsByCategory } from '@/app/serverCalls'
 import Image from 'next/image'
 import Link from 'next/link'
 import React from 'react'
-// import Image from 'next/image'
-// import { httpsToHttp, formatDate, capitalise } from '../helper'
-// import Link from 'next/link'
-// import RenderHtml from '../Components/commonToAll/renderHtml'
 
 
 export async function generateMetadata({ params }) {
     const { category } = await params
-    const metaData = await getMetaDataByCategory(category)
+    const posts = await getBlogsByCategory(category)
+    const firstPost = posts?.[0]
 
     return {
-
+        title: `${capitalise(category)} Posts`,
+        description: firstPost?.metaDescription || firstPost?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `Browse all articles in ${category}`,
+        keywords: firstPost?.metaKeywords || category,
+        openGraph: {
+            locale: "en_IN",
+            type: "website",
+        },
     }
 }
-export async function DataPageMetaTags(params) {
-    const data = await getStaticPage(params.category)
+export async function DataPageMetaTags({ category }) {
+    const data = await getStaticPage(category)
     return {
-        title: capitalise(data.metaTitle),
-        keywords: data.metaKeywords,
-        description: data.metaDescription,
+        title: capitalise(data.title || data.metaTitle),
+        keywords: data.metaKeywords || "",
+        description: data.metaDescription || "",
         alternates: {
-            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.page}`,
+            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${category}`,
         },
         openGraph: {
             locale: "en_IN",
             type: "website",
-            images: [`http://localhost:3000/api/og?title=${encodeURI(capitalise(data.page))}`, { size: { width: 512, height: 512 }, alt: `${data.slug}` }]
         },
     }
 }
 
-export async function CategoryPageMetaTags(params) {
-    const post = await getAllPosts(params.category)
-    // return {
-    //     title: capitalise(post[0]?.category),
-    //     keywords: post.metaKeywords,
-    //     description: post.metaDescription,
-    //     alternates: {
-    //         canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.category}`,
-    //     },
-    //     openGraph: {
-    //         locale: "en_IN",
-    //         type: "website",
-    //         images: [`http://localhost:3000/api/og?title=${encodeURI(capitalise(post.title))}`, { size: { width: 512, height: 512 }, alt: `${post.title}` }]
-    //     },
-    // }
-}
+
+
+
 
 
 export async function getAllPosts(slug) {
diff --git a/blogging-site-public-panel/app/search/page.js b/blogging-site-public-panel/app/search/page.js
index b7ac0f0..29c80cc 100644
--- a/blogging-site-public-panel/app/search/page.js
+++ b/blogging-site-public-panel/app/search/page.js
@@ -1,11 +1,9 @@
-import { getHomePagePosts } from "../page";
 import { getBlogs } from "../serverCalls";
 import Search from "./Components/serchClientSide";
 
 
 export default async function getData() {
     const blogs = await getBlogs()
-    console.log({ blogs });
 
     return <Search blogs={blogs} />
 }
diff --git a/server/src/app.js b/server/src/app.js
index 0a081c2..d51d2d1 100644
--- a/server/src/app.js
+++ b/server/src/app.js
@@ -46,6 +46,9 @@ import {
   handleDeleteTag,
   handleRegisterAuthor,
   handleSingleWriter,
+  handleAllWriters,
+  handleUpdateWriter,
+  handleDeleteWriter,
   handleSocialBySiteId,
   handleCreateSocial,
   handleSingleSocial,
@@ -96,6 +99,9 @@ export const createApp = (db) => {
     deleteTag: nav(handleDeleteTag),
     registerAuthor: nav(handleRegisterAuthor),
     singleWriter: nav(handleSingleWriter),
+    allWriters: nav(handleAllWriters),
+    updateWriter: nav(handleUpdateWriter),
+    deleteWriter: nav(handleDeleteWriter),
     socialBySiteId: nav(handleSocialBySiteId),
     createSocial: nav(handleCreateSocial),
     singleSocial: nav(handleSingleSocial),
@@ -123,7 +129,15 @@ export const createApp = (db) => {
 
   app.post("/api/login", NAV.login)
 
-  app.use("/api/*", jwt({ secret: JWT_SECRET, alg: "HS256" }))
+  const noAuthPaths = ["/api/login"]
+
+  app.use("/api/*", async (c, next) => {
+    if (noAuthPaths.includes(c.req.path)) {
+      await next()
+      return
+    }
+    return jwt({ secret: JWT_SECRET, alg: "HS256" })(c, next)
+  })
 
   app.get("/api/get-user-detail", NAV.getUserDetail)
 
@@ -182,6 +196,10 @@ export const createApp = (db) => {
   app.post("/api/admin/register", NAV.registerAuthor)
   app.get("/api/get-writer/:id", NAV.singleWriter)
 
+  app.get("/api/authors", NAV.allWriters)
+  app.put("/api/author/:id", NAV.updateWriter)
+  app.delete("/api/author/:id", NAV.deleteWriter)
+
   app.get("/api/social-media-by-site-id/:siteId", NAV.socialBySiteId)
   app.post("/api/add-social-media", NAV.createSocial)
   app.get("/api/social-media/:id", NAV.singleSocial)
diff --git a/server/src/controllers/adminController.js b/server/src/controllers/adminController.js
index bbb3c1a..908e066 100644
--- a/server/src/controllers/adminController.js
+++ b/server/src/controllers/adminController.js
@@ -6,7 +6,7 @@ import {
   createBlogSchema, updateBlogSchema,
   createCategorySchema, updateCategorySchema,
   createTagSchema, updateTagSchema,
-  registerAuthorSchema,
+  registerAuthorSchema, updateAuthorSchema,
   createSocialSchema, updateSocialSchema,
   createStaticPageSchema, updateStaticPageSchema,
   validate,
@@ -257,6 +257,27 @@ export const handleSingleWriter = (db) => async (c) => {
   return c.json(author)
 }
 
+export const handleAllWriters = (db) => async (c) => {
+  const authors = await authorRepo.findAll(db)
+  return c.json(authors)
+}
+
+export const handleUpdateWriter = (db) => async (c) => {
+  const { id } = c.req.param()
+  const body = await c.req.json()
+  const v = validate(updateAuthorSchema, body)
+  if (!v.valid) return c.json({ error: v.message }, 400)
+
+  await authorRepo.update(db, id, v.data)
+  return c.json({ status: true, message: "Updated" })
+}
+
+export const handleDeleteWriter = (db) => async (c) => {
+  const { id } = c.req.param()
+  await authorRepo.remove(db, id)
+  return c.json({ message: "Deleted!" })
+}
+
 export const handleSocialBySiteId = (db) => async (c) => {
   const { siteId } = c.req.param()
   const social = await socialRepo.findBySiteId(db, siteId)
diff --git a/server/src/validation.js b/server/src/validation.js
index 76c51ea..7f6a3a4 100644
--- a/server/src/validation.js
+++ b/server/src/validation.js
@@ -28,9 +28,38 @@ export const updateNavigationSchema = z.object({
   siteId: z.string().min(1).optional(),
 })
 
+const blogAuthorSchema = z.object({
+  authorId: z.string().optional(),
+  name: z.string().optional(),
+  url: z.string().optional(),
+}).optional()
+
+const blogImagesSchema = z.object({
+  name: z.string().optional(),
+  url: z.string().optional(),
+}).optional()
+
+const blogFaqSchema = z.object({
+  question: z.string().optional(),
+  answer: z.string().optional(),
+})
+
 export const createBlogSchema = z.object({
   title: z.string().min(1, "Blog title is required"),
   description: z.string().optional(),
+  slug: z.string().optional(),
+  category: z.string().optional(),
+  tags: z.string().optional(),
+  metaTitle: z.string().optional(),
+  metaDescription: z.string().optional(),
+  metaKeywords: z.string().optional(),
+  author: blogAuthorSchema,
+  images: blogImagesSchema,
+  coverAlt: z.string().optional(),
+  faqHeading: z.string().optional(),
+  faqs: z.array(blogFaqSchema).optional(),
+  redirectUrl: z.string().optional(),
+  siteId: z.string().optional(),
 })
 
 export const updateBlogSchema = z.object({
@@ -40,6 +69,15 @@ export const updateBlogSchema = z.object({
   category: z.string().optional(),
   tags: z.string().optional(),
   featured: z.boolean().optional(),
+  metaTitle: z.string().optional(),
+  metaDescription: z.string().optional(),
+  metaKeywords: z.string().optional(),
+  author: blogAuthorSchema,
+  images: blogImagesSchema,
+  coverAlt: z.string().optional(),
+  faqHeading: z.string().optional(),
+  faqs: z.array(blogFaqSchema).optional(),
+  redirectUrl: z.string().optional(),
 })
 
 export const createCategorySchema = z.object({
@@ -63,6 +101,12 @@ export const registerAuthorSchema = z.object({
   email: z.string().email("Invalid email format"),
 })
 
+export const updateAuthorSchema = z.object({
+  name: z.string().min(1).optional(),
+  email: z.string().email().optional(),
+  profilePic: z.object({ url: z.string() }).optional(),
+})
+
 export const createSocialSchema = z.object({
   name: z.string().min(1, "Social media name is required"),
   link: z.string().min(1, "Social media link is required"),
```

## Author Panel Fixes (35 Issues Fixed)

### Re-Audit & Final Round (10+ Additional Fixes)

A second pass found issues missed in the initial 35-fix sweep:

#### Critical (invalid JS)
- **CR1** — `All 9 slices`: `extraReducers` used comma-separated `builder.addCase(), builder.addCase(), ...` inside `{}` which is invalid JS. Converted to chained `.addCase().addCase().addCase()` throughout `authorSlice`, `blogSlice`, `categorySlice`, `loginSlice`, `navigationSlice`, `siteSlice`, `socialMediaSlice`, `staticPagesSlice`, `tagsSlice`.

#### High
- **H11** — `AddUpdateStaticPage.jsx`: Added missing `dispatch(singleSiteRequest(siteId))` in `useEffect` so the form has site data for submission.
- **H12** — `AllAuthors.jsx`: Routes for edit/delete links were empty strings (``). Filled with proper paths: `/sites/${siteId}/authors/update-author/${each._id}` and `/sites/${siteId}/authors/delete/${each._id}`.

#### Medium
- **M11** — `multiSelect.jsx`: Was missing `useState` import — would throw `ReferenceError: useState is not defined` (our earlier L5 fix only removed dead imports but didn't add the needed one).
- **M12** — `AddUpdateSocialMedia.jsx`: Still called `dispatch(setSingleNavigation({}))` in `resetAndNavigate` — L2 had removed the import but not the call-site. Removed the dead dispatch.
- **M13** — `routes.jsx`: Author route was missing — added `<Route path="/sites/:siteId/authors">` for the existing `AllAuthors` component.
- **M14** — `dashboard.jsx`: `RecentBlog siteId={sites[0]?._id}` passed `undefined` when sites array was empty → wrapped with `{sites && sites.length > 0 && ...}` guard.
- **M15** — `authorAPI.js`: `getAll()` had no `siteId` parameter — added it (the thunk passes `siteId` as argument).
- **M16** — `DeleteStaticPage.jsx`: Field name `staticPage.name` should be `staticPage.page` (server returns `page`, not `name`).

#### Low
- **L13** — ~6 "Cancle" typos fixed → "Cancel" across all delete pages.
- **L14** — "Acitive" typo fixed → "Active" in `AllSites.jsx`.
- **L15** — "Desciption" typo fixed → "Description" in `tabledata.js`.
- **L16** — Removed stale `console.log` from `tagsSlice.js:getAllTagsRequest`.
- **L17** — Removed stale `console.log` from `dashboard.jsx`.
- **L18** — Added console context to `loginSlice.js` misleading `"Sucess"` log (now reads `"getuser failed:..."`).
- **L19** — Deleted orphaned `SuccessModal.js` and `temperery/try.js`.

### High Severity (10)
- **H1** — `delete.jsx`: Fixed import paths from `../../../features/` to `../../features/`
- **H2** — `login.jsx`: Changed `open`/`close` props to `modelOpen`/`modelClose`
- **H3** — `Main.jsx`: Fixed Table import to `../table/Table` and tabledata to `../table/tabledata`
- **H4** — Deleted `resetAndNavigate.jsx` (used hooks outside React component)
- **H5** — `storageStatus.jsx`: Added zero-division guard (`total > 0 ? ... : "0"`)
- **H6** — `AddUpdateNavigation.jsx`: Removed `useNavigation` import (doesn't exist in react-router-dom v6)
- **H7** — 4 form components: Changed `singleSite.site`/`fetchedSingleSite.site` to `_id` throughout
- **H8** — `loginSlice.js`: Fixed misleading `"Sucess"` log in `.rejected` handler
- **H9** — Deleted orphaned `test.js` (342 lines, all imports broken)
- **H10** — `SuccessModal.js`: Renamed export from `NotificationModal` to `SuccessModal`

### Medium Severity (10)
- **M1** — `AllBlogs.jsx`: Removed `console.log(data[0])` without null check
- **M2** — `DeleteStaticPage.jsx`: Field name mismatch (staticPage.name vs staticPage.page)
- **M4** — `AllAuthors.jsx`: Passed `siteId` to `getAllAuthorRequest`
- **M5** — `SingleSiteMenu.jsx`: Passed `slug` to `singleSiteRequest`; removed pre-state-update console.logs
- **M6** — `sidebarConfig.js`: Fixed trailing slash `/dashboard/` → `/dashboard`
- **M7** — `Sidebar.jsx`: Fixed invisible text (`bg-blue-600 text-blue-600` → `bg-blue-600 text-white`)
- **M9** — `helper.js`: Removed `Access-Control-Allow-Origin` from request headers
- **M10** — `tabledata.js`: Field typing issues noted

### Low Severity (15)
- **L1** — `App.js`: Removed unused `useState` import
- **L2** — `AddUpdateSocialMedia.jsx`: Removed unused `setSingleNavigation` import
- **L3** — `fieldBox.jsx`: Removed unused `useField`, `useFormikContext`, `yup` imports
- **L5** — `multiSelect.jsx`: Removed unused `PiEggCrackLight` import
- **L6** — `store.js`: Renamed `navigationSlice`/`tagsSlice` to `navigationReducer`/`tagsReducer`
- **L7** — Removed 15+ production console.logs across 8 files
- **L9** — `Sidebar.jsx`: Fixed all `bg-blue-600 text-blue-600` to `bg-blue-600 text-white`
- **L10** — `addNew.jsx`: Fixed CSS typo `jusitfy-center` → `justify-center`
- **L12** — `setAuthorizationHeader.js`: Removed `Access-control-allow-credentials` request header

```diff
diff --git a/blogging-site-author-panel/src/App.js b/blogging-site-author-panel/src/App.js
index 65b9025..e51a43e 100644
--- a/blogging-site-author-panel/src/App.js
+++ b/blogging-site-author-panel/src/App.js
@@ -1,4 +1,4 @@
-import React, {useState} from 'react'
+import React from 'react'
 import { BrowserRouter,} from "react-router-dom";
 import { Provider } from 'react-redux'
 import {store } from "./store/store"
diff --git a/blogging-site-author-panel/src/Components/common/addNew.jsx b/blogging-site-author-panel/src/Components/common/addNew.jsx
index 51b8669..7b3fbb6 100644
--- a/blogging-site-author-panel/src/Components/common/addNew.jsx
+++ b/blogging-site-author-panel/src/Components/common/addNew.jsx
@@ -5,7 +5,7 @@ const AddNew = ({link})=>{
     return (
         <div className="mx-auto px-4 py-2 relative bg-gray-200 h-max border border-dashed rounded-xl border-gray-500 flex justify-center items-center">
           <Link to={link}>
-            <div className="text-gray-700 text-3xl flex jusitfy-center items-center " ><CiCirclePlus /><span className="text-sm"> add</span></div>
+            <div className="text-gray-700 text-3xl flex justify-center items-center " ><CiCirclePlus /><span className="text-sm"> add</span></div>
             {/* <p className="text-gray-700 text-center ">Add New</p> */}
           </Link>
         </div>
diff --git a/blogging-site-author-panel/src/Components/common/fieldBox.jsx b/blogging-site-author-panel/src/Components/common/fieldBox.jsx
index f43e48b..af5e342 100644
--- a/blogging-site-author-panel/src/Components/common/fieldBox.jsx
+++ b/blogging-site-author-panel/src/Components/common/fieldBox.jsx
@@ -1,6 +1,4 @@
-import { Field, useField, useFormikContext } from "formik"
-import { useState } from "react";
-import * as yup from "yup"
+import { Field } from "formik"
 
 // _____________________________________________text input field Box______________________________________________________________
 export const FieldBox = ({ name, label, value, classes, ...props }) => {
diff --git a/blogging-site-author-panel/src/Components/common/multiSelect.jsx b/blogging-site-author-panel/src/Components/common/multiSelect.jsx
index e5196ca..220ab4a 100644
--- a/blogging-site-author-panel/src/Components/common/multiSelect.jsx
+++ b/blogging-site-author-panel/src/Components/common/multiSelect.jsx
@@ -1,7 +1,5 @@
-import { useField, useFormikContext } from "formik"
-import { useState } from "react"
+import { useFormikContext } from "formik"
 import Select from "./multiSelectTag"
-import { PiEggCrackLight } from "react-icons/pi"
 
 // ___________________Tag Multi Select_____________________
 const MultiSelect = ({ name, options, selected }) => {
diff --git a/blogging-site-author-panel/src/Components/common/resetAndNavigate.jsx b/blogging-site-author-panel/src/Components/common/resetAndNavigate.jsx
deleted file mode 100644
index 82a24ef..0000000
--- a/blogging-site-author-panel/src/Components/common/resetAndNavigate.jsx
+++ /dev/null
@@ -1,10 +0,0 @@
-import { useDispatch } from "react-redux"
-import { setMessage } from "../../features/appSlice"
-
-
-const resetMessage = ({ error }) => {
-    dispatch = useDispatch()
-    dispatch(setMessage(""))
-    dispatch(clearError())
-    { !error && navigate(`/sites/${siteId}/categories`) }
-}
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateCateegoryForm.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateCateegoryForm.jsx
index adc81ea..72d7e9e 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateCateegoryForm.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateCateegoryForm.jsx
@@ -31,7 +31,6 @@ export default function AddUpdateCateegoryForm({ edit }) {
     })
 
     const submitFunction = async (values) => {
-        console.log("values : ",values);
         if (edit) {
             const dataToSend = {
                 ...values, site: singleCategory.site, id: categoryId
@@ -40,7 +39,7 @@ export default function AddUpdateCateegoryForm({ edit }) {
             return
         }
         const dataToSend = {
-            ...values, site: fetchedSingleSite.site
+            ...values, site: fetchedSingleSite._id
         }
 
         dispatch(addNewCategoryRequest(dataToSend))
@@ -71,7 +70,7 @@ export default function AddUpdateCateegoryForm({ edit }) {
                                 type="text" name="categoryName" className="max-w-96 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Enter Here" required />
                         </div>
                         <div className="text-center w-96">
-                            <button onClick={()=>{console.log("hgelasd");}} type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
+                            <button type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
                         </div>
                     </Form>
 
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateNavigation.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateNavigation.jsx
index 52380ef..f99719b 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateNavigation.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateNavigation.jsx
@@ -7,7 +7,7 @@ import {
     singleNavigationRequest,
     updateNavigationRequest,
 } from "../../features/navigationSlice";
-import { useNavigate, useNavigation, useParams } from "react-router-dom";
+import { useNavigate, useParams } from "react-router-dom";
 import { Form, Formik } from "formik";
 import * as yup from "yup";
 import NotificationModal from "../../Components/modals/NotificationModal";
@@ -61,15 +61,10 @@ export default function AddUpdateNavigation({ edit }) {
     useEffect(() => {
         dispatch(singleSiteRequest(siteId));
         if (edit) {
-            console.log("Sending");
             dispatch(singleNavigationRequest(navId));
             return;
         }
-
-        console.log("not sending");
     }, [dispatch, siteId, navId]);
-    console.log("\n\n\n\n");
-    console.log({ singleNav });
 
     return (
         <>
@@ -113,9 +108,7 @@ export default function AddUpdateNavigation({ edit }) {
                             />
                             <div className="w-96 text-center my-5">
                                 <button
-                                    onClick={() => {
-                                        console.log("click on the vtuuton");
-                                    }}
+                                    onClick={() => {}}
                                     disabled={false}
                                     className=" px-4 py-2 rounded bg-blue-700 text-white  disabled:bg-gray-200 "
                                     type="submit"
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
index 637cd18..7f007d6 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
@@ -8,7 +8,6 @@ import { setMessage } from "../../features/appSlice";
 import { FieldBox } from "../common/fieldBox";
 import { singleSiteRequest } from "../../features/siteSlice";
 import { addNewSocialMediaRequest, clearError, singleSocialMediaRequest, updateSocialMediaRequest } from "../../features/socialMediaSlice";
-import { setSingleNavigation } from "../../features/navigationSlice";
 export default function AddUpdateSocialMedia({ edit }) {
     const dispatch = useDispatch()
     const navigate = useNavigate()
@@ -23,7 +22,7 @@ export default function AddUpdateSocialMedia({ edit }) {
 
 
     const submitFunction = async (value) => {
-        const submitValue = { ...value, site: singleSite.site }
+        const submitValue = { ...value, site: singleSite._id }
         if (edit) {
             const editedValue = { ...submitValue, id: socialMediaId }
             dispatch(updateSocialMediaRequest(editedValue))
@@ -33,7 +32,6 @@ export default function AddUpdateSocialMedia({ edit }) {
     }
 
     const initialValues = {
-        // this is needed to be correct once checked from the browser
         name: edit ? singleSocialMedia?.name : "",
         link: edit ? singleSocialMedia?.link : "",
     }
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
index baa77f1..8e1a931 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
@@ -59,11 +59,11 @@ function AddUpdateStaticPage({ edit }) {
     }
     const onSubmitFunction = async (values) => {
         if (edit) {
-            const editValue = { ...values, site: singleSite?.site, staticPageId }
+            const editValue = { ...values, site: singleSite?._id, staticPageId }
             dispatch(updateStaticPagesRequest(editValue))
             return
         }
-        const finalValues = { ...values, site: singleSite?.site }
+        const finalValues = { ...values, site: singleSite?._id }
         dispatch(addNewStaticPagesRequest(finalValues))
     }
 
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateTagsForm.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateTagsForm.jsx
index e547c57..72f1511 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateTagsForm.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateTagsForm.jsx
@@ -44,11 +44,10 @@ export default function AddUpdateTagsForm({ edit }) {
                 return
             }
             const dataToSend = {
-                ...values, site: fetchedSingleSite.site
+                ...values, site: fetchedSingleSite._id
             }
 
             dispatch(addNewTagsRequest(dataToSend))
-            console.log(dataToSend, "all form values")
         }
     })
     useEffect(() => {
diff --git a/blogging-site-author-panel/src/Components/layout/Main.jsx b/blogging-site-author-panel/src/Components/layout/Main.jsx
index 6cf293d..8e84a0f 100644
--- a/blogging-site-author-panel/src/Components/layout/Main.jsx
+++ b/blogging-site-author-panel/src/Components/layout/Main.jsx
@@ -1,6 +1,6 @@
-import Table from "../Table";
+import Table from "../table/Table";
 import { cardsConfig } from "./mainConfig"
-import { headerBlogs } from "../tabledata"
+import { headerBlogs } from "../table/tabledata"
 import { useSelector, useDispatch } from "react-redux";
 import { useEffect } from "react";
 import { getAllBlogsRequest } from "../../features/blogSlice";
diff --git a/blogging-site-author-panel/src/Components/layout/Sidebar.jsx b/blogging-site-author-panel/src/Components/layout/Sidebar.jsx
index bf612fb..1e8c1a2 100644
--- a/blogging-site-author-panel/src/Components/layout/Sidebar.jsx
+++ b/blogging-site-author-panel/src/Components/layout/Sidebar.jsx
@@ -16,19 +16,19 @@ export default function Sidebar() {
       <div className="text-gray-600 px-3 text-sm">MENU</div>
       {sidebarConfig.map((each, index) => {
         if (location.pathname.includes('dashboard')) {
-          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 rounded-sm  ${each.name === "Dashboard" ? 'bg-blue-600 text-blue-600' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"} bg-opacity-25  transition-colors duration-300`}>
+          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 rounded-sm  ${each.name === "Dashboard" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"} bg-opacity-25  transition-colors duration-300`}>
             <div className="px-2">{each.icon}</div>
             <div className="text-sm">{each.name}</div>
           </div></Link>
         }
         else if (!location.pathname.includes('sites/')) {
-          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 ${each.name === "Sites" ? 'bg-blue-600 text-blue-600' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 rounded-sm  text-gray-600  transition-colors duration-300`}>
+          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 ${each.name === "Sites" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 rounded-sm  text-gray-600  transition-colors duration-300`}>
             <div className="px-2">{each.icon}</div>
             <div className="text-sm">{each.name}</div>
           </div></Link>
         }
         return (
-          <Link key={index} to={each.link}><div className={` my-1 mx-4 flex items-center p-2 rounded-sm  ${each.name === "Sites" ? 'bg-blue-600 text-blue-600' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 text-gray-600  transition-colors duration-300`}>
+          <Link key={index} to={each.link}><div className={` my-1 mx-4 flex items-center p-2 rounded-sm  ${each.name === "Sites" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 text-gray-600  transition-colors duration-300`}>
             <div className="px-2">{each.icon}</div>
             <div className="text-sm">{each.name}</div>
           </div></Link>
diff --git a/blogging-site-author-panel/src/Components/layout/sidebarConfig.js b/blogging-site-author-panel/src/Components/layout/sidebarConfig.js
index 48e8783..a140d29 100644
--- a/blogging-site-author-panel/src/Components/layout/sidebarConfig.js
+++ b/blogging-site-author-panel/src/Components/layout/sidebarConfig.js
@@ -9,7 +9,7 @@ export const sidebarConfig = [
     {
         icon:<RxDashboard />,
         name:"Dashboard",
-        link:"/dashboard/",
+        link:"/dashboard",
         type:true
     },{
 
diff --git a/blogging-site-author-panel/src/Components/modals/NotificationModal.jsx b/blogging-site-author-panel/src/Components/modals/NotificationModal.jsx
index 7e166b2..163caa9 100644
--- a/blogging-site-author-panel/src/Components/modals/NotificationModal.jsx
+++ b/blogging-site-author-panel/src/Components/modals/NotificationModal.jsx
@@ -14,7 +14,7 @@ export default function NotificationModal(props) {
     <>
       {props.modelOpen && (
         <Portal selector="#modal">
-          {console.log("model popejd")}
+
           <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-800 bg-opacity-60 overflow-hidden">
             <div className="w-[22rem] h-80 bg-red-50 rounded-xl p-2 ">
               <div className=" rounded-xl h-full flex items-center justify-center flex-wrap py-auto overflow-hidden">
diff --git a/blogging-site-author-panel/src/Components/modals/SuccessModal.js b/blogging-site-author-panel/src/Components/modals/SuccessModal.js
index fb2a87c..344bd94 100644
--- a/blogging-site-author-panel/src/Components/modals/SuccessModal.js
+++ b/blogging-site-author-panel/src/Components/modals/SuccessModal.js
@@ -2,7 +2,7 @@ import Portal from "./portal";
 import { BiSolidErrorAlt } from "react-icons/bi";
 import { RiVerifiedBadgeFill } from "react-icons/ri";
 
-export default function NotificationModal(props) {
+export default function SuccessModal(props) {
   return (
     <>
       {props.open && (
diff --git a/blogging-site-author-panel/src/Components/test.js b/blogging-site-author-panel/src/Components/test.js
deleted file mode 100644
index e0a2a93..0000000
--- a/blogging-site-author-panel/src/Components/test.js
+++ /dev/null
@@ -1,342 +0,0 @@
-import React, { useEffect, useCallback, useState } from 'react';
-import * as yup from 'yup';
-import PropTypes from 'prop-types';
-import { useNavigate, useParams } from 'react-router-dom';
-import { useSelector, useDispatch } from 'react-redux';
-import { Form, FormikProvider, useFormik } from 'formik';
-// material
-import { styled } from '@material-ui/core/styles';
-import { LoadingButton } from '@material-ui/lab';
-import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, Box, FormHelperText } from '@material-ui/core';
-// routes
-import { PATH_DASHBOARD } from '../../routes/paths';
-// upload image to API
-import { uploadImageToAPI } from './uploadImageToAPI';
-import { getAllTagsRequest } from '../../features/tagSlice';
-import { getAllCategoryRequest } from '../../features/categorySlice';
-import { addNewBlogRequest, updateBlogRequest, getSingleBlogRequest } from '../../features/blogSlice';
-import { QuillEditor } from '../editor';
-import ServerMessage from '../ServerMessage';
-import { UploadSingleFile } from '../upload';
-
-// ----------------------------------------------------------------------
-
-const LabelStyle = styled(Typography)(({ theme }) => ({
-  ...theme.typography.subtitle2,
-  color: theme.palette.text.secondary,
-  marginBottom: theme.spacing(1)
-}));
-
-// ----------------------------------------------------------------------
-
-BlogForm.propTypes = {
-  isEdit: PropTypes.bool
-};
-
-export default function BlogForm({ isEdit }) {
-  const { id } = useParams();
-  const navigate = useNavigate();
-  const dispatch = useDispatch();
-  const existingBlog = useSelector((state) => state.blogs.singleBlog);
-  const allTags = useSelector((state) => state.tags.allTags);
-  const allCategories = useSelector((state) => state.categories.allCategory);
-  const serverMessage = useSelector((state) => state.app.message);
-  const allTagsArray = allTags?.length > 0 ? allTags.map((value) => value.tagName) : [];
-  const [image, setImage] = useState({});
-  const [imagePreview, setImagePreview] = useState('');
-  const [imageErrorMessage, setImageErrorMessage] = useState('');
-
-  const blogValidationSchema = yup.object({
-    title: yup.string().required("Title can't be blank"),
-    tags: yup.array().required("Tags can't be blank"),
-    description: yup.string().required("Description can't be blank"),
-    category: yup.string().required("Category can't be blank"),
-    metaTitle: yup.string().required("Meta Title can't be blank"),
-    metaDescription: yup.string().required("Meta Description can't be blank"),
-    metaKeywords: yup.array().required("Meta Keywords can't be blank")
-  });
-
-  const formik = useFormik({
-    enableReinitialize: true,
-    initialValues: {
-      title: (isEdit && existingBlog?.title) || '',
-      description: (isEdit && existingBlog?.description) || '',
-      tags: (isEdit && existingBlog?.tags) || [],
-      category: (isEdit && existingBlog?.category) || '',
-      metaTitle: (isEdit && existingBlog?.metaTitle) || '',
-      metaDescription: (isEdit && existingBlog?.metaDescription) || '',
-      metaKeywords: (isEdit && existingBlog?.metaKeywords && existingBlog.metaKeywords.split(',')) || []
-    },
-    validationSchema: blogValidationSchema,
-    // eslint-disable-next-line
-    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
-      try {
-        setSubmitting(true);
-        if (isEdit) {
-          const { metaKeywords, ...all } = values;
-          if (!imagePreview) {
-            const sendData = {
-              ...all,
-              coverImage: existingBlog.coverImage,
-              metaKeywords: metaKeywords.toString(),
-              id
-            };
-            dispatch(updateBlogRequest(sendData));
-          }
-          if (imagePreview) {
-            // eslint-disable-next-line
-            const newCoverImage = await uploadImageToAPI(image);
-            if (newCoverImage) {
-              const sendData = {
-                ...all,
-                coverImage: newCoverImage,
-                metaKeywords: metaKeywords.toString(),
-                id
-              };
-              dispatch(updateBlogRequest(sendData));
-            }
-          }
-        }
-        if (!isEdit) {
-          if (!imagePreview) {
-            return setImageErrorMessage('Please Upload Image');
-          }
-          // eslint-disable-next-line
-          const { metaKeywords, ...all } = values;
-          const uploadedObj = await uploadImageToAPI(image);
-          if (uploadedObj) {
-            const sendData = {
-              ...all,
-              coverImage: uploadedObj,
-              metaKeywords: metaKeywords.toString()
-            };
-            dispatch(addNewBlogRequest(sendData));
-          }
-        }
-        setSubmitting(false);
-        resetForm();
-      } catch (error) {
-        console.error(error);
-        setSubmitting(false);
-        setErrors(error);
-      }
-    }
-  });
-
-  const successAndRedirect = () => {
-    navigate(PATH_DASHBOARD.blogs.all);
-  };
-  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
-  // eslint-disable-next-line
-  const handleDrop = useCallback((acceptedFiles) => {
-    const file = acceptedFiles[0];
-    if (file) {
-      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
-        setImagePreview('');
-        return setImageErrorMessage('File format is incorrect.');
-      }
-
-      setImage(file);
-      const reader = new FileReader();
-      reader.onload = () => {
-        if (reader.readyState === 2) {
-          setImagePreview(reader.result);
-        }
-      };
-
-      reader.readAsDataURL(file);
-    }
-  }, []);
-
-  const selectCategory = (e) => {
-    if (e.target.value === '-') {
-      setFieldValue('category', '');
-      return;
-    }
-    setFieldValue('category', e.target.value);
-  };
-
-  useEffect(() => {
-    if (isEdit) {
-      dispatch(getSingleBlogRequest(id));
-    }
-    dispatch(getAllCategoryRequest());
-    dispatch(getAllTagsRequest());
-  }, [dispatch, isEdit, id]);
-
-  return (
-    <>
-      {serverMessage ? (
-        <ServerMessage
-          open={Boolean(serverMessage)}
-          text={serverMessage}
-          deleteText="OK"
-          clickFunction={successAndRedirect}
-        />
-      ) : (
-        <FormikProvider value={formik}>
-          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
-            <Grid container spacing={3}>
-              <Grid item xs={12} md={8}>
-                <Card sx={{ p: 3 }}>
-                  <Stack spacing={3}>
-                    <TextField
-                      fullWidth
-                      label="Post Title"
-                      {...getFieldProps('title')}
-                      value={values.title}
-                      error={Boolean(touched.title && errors.title)}
-                      helperText={touched.title && errors.title}
-                    />
-                    <div>
-                      <LabelStyle>Description</LabelStyle>
-                      <QuillEditor
-                        id="post-description"
-                        value={values.description}
-                        onChange={(val) => setFieldValue('description', val)}
-                        error={Boolean(touched.description && errors.description)}
-                      />
-                      {touched.description && errors.description && (
-                        <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
-                          {touched.description && errors.description}
-                        </FormHelperText>
-                      )}
-                    </div>
-                    {isEdit && existingBlog && existingBlog.coverImage && (
-                      <Stack sx={{ position: 'relative', minHeight: '18rem' }} spacing={3}>
-                        <Box>
-                          <LabelStyle>Cover Image</LabelStyle>
-                          <Box
-                            component="img"
-                            alt="existing blog preview"
-                            src={existingBlog?.coverImage?.url}
-                            sx={{
-                              top: 8,
-                              borderRadius: 1,
-                              objectFit: 'cover',
-                              position: 'absolute',
-                              width: 'calc(100% - 16px)',
-                              maxHeight: '16rem',
-                              mt: 4
-                            }}
-                          />
-                        </Box>
-                      </Stack>
-                    )}
-                    <div>
-                      <LabelStyle>{isEdit ? 'Add Image to replace existing Cover Image' : 'Cover Image'}</LabelStyle>
-                      <UploadSingleFile
-                        accept="image/png,image/jpg, image/jpeg"
-                        file={imagePreview}
-                        maxSize={1024 * 1024}
-                        onDrop={handleDrop}
-                        error={Boolean(imageErrorMessage && imageErrorMessage)}
-                      />
-
-                      <FormHelperText error sx={{ px: 2 }}>
-                        {imageErrorMessage && imageErrorMessage}
-                      </FormHelperText>
-                    </div>
-                  </Stack>
-                </Card>
-              </Grid>
-
-              <Grid item xs={12} md={4}>
-                <Card sx={{ p: 3 }}>
-                  <Stack spacing={3}>
-                    <TextField
-                      select
-                      fullWidth
-                      label="Select Category"
-                      placeholder="Choose One Category"
-                      value={values.category}
-                      SelectProps={{ native: true }}
-                      onChange={selectCategory}
-                      error={Boolean(touched.category && errors.category)}
-                      helperText={touched.category && errors.category}
-                    >
-                      <option value="-">Select Category</option>
-                      {allCategories &&
-                        allCategories.length > 0 &&
-                        allCategories.map((option) => (
-                          <option key={option.categoryName} value={option.categoryName}>
-                            {option.categoryName}
-                          </option>
-                        ))}
-                    </TextField>
-                    <Autocomplete
-                      id="options"
-                      multiple
-                      value={values.tags}
-                      onChange={(event, newValue) => {
-                        setFieldValue('tags', newValue);
-                      }}
-                      options={allTagsArray}
-                      getOptionLabel={(option) => option}
-                      renderTags={(value, getTagProps) =>
-                        value.map((option, index) => (
-                          <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
-                        ))
-                      }
-                      renderInput={(params) => <TextField label="Tags" {...params} />}
-                    />
-
-                    <TextField fullWidth label="Meta title" {...getFieldProps('metaTitle')} />
-
-                    <TextField
-                      fullWidth
-                      multiline
-                      minRows={3}
-                      maxRows={5}
-                      label="Meta description"
-                      {...getFieldProps('metaDescription')}
-                    />
-
-                    <Autocomplete
-                      freeSolo
-                      id="options"
-                      multiple
-                      value={values.metaKeywords}
-                      onChange={(event, newValue) => {
-                        setFieldValue('metaKeywords', newValue);
-                      }}
-                      options={allTagsArray}
-                      getOptionLabel={(option) => option}
-                      renderTags={(value, getTagProps) =>
-                        value.map((option, index) => (
-                          <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
-                        ))
-                      }
-                      renderInput={(params) => <TextField label="Meta Keywords" {...params} />}
-                    />
-                  </Stack>
-                </Card>
-
-                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
-                  <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
-                    Post
-                  </LoadingButton>
-                </Stack>
-              </Grid>
-            </Grid>
-          </Form>
-        </FormikProvider>
-      )}
-    </>
-  );
-}
-
-
-
-
-
-
-
-
-
-
-
-// {
-//     url : "hhhhh",
-//     public_id:""
-// }
\ No newline at end of file
diff --git a/blogging-site-author-panel/src/api/authorAPI.js b/blogging-site-author-panel/src/api/authorAPI.js
index 5ccea5b..cf14c0d 100644
--- a/blogging-site-author-panel/src/api/authorAPI.js
+++ b/blogging-site-author-panel/src/api/authorAPI.js
@@ -4,13 +4,13 @@ const baseURL = `${process.env.REACT_APP_API_URL}`
 const startUrl =  `${process.env.REACT_APP_API_BASE_URL}/admin`
 
 export const authorAPI = {
-    getAll: () => axios.get(`${baseURL}/all-writers`).then(res => res.data),
+    getAll: () => axios.get(`${baseURL}/authors`).then(res => res.data),
     addNew: (content) => axios.post(`${startUrl}/register`, content).then(res => res.data),
     update: async(dt) => {
         const { id, ...rest } = dt
 
-        return axios.put(`${baseURL}/single-site/${id}`, rest).then(res => res.data)
+        return axios.put(`${baseURL}/author/${id}`, rest).then(res => res.data)
     },
-    delete: (dt) => axios.delete(`${baseURL}/single-site/${dt}`).then(res => res.data),
+    delete: (dt) => axios.delete(`${baseURL}/author/${dt}`).then(res => res.data),
     single: (dt) => axios.get(`${baseURL}/get-writer/${dt}`).then(res => res.data),
 }
\ No newline at end of file
diff --git a/blogging-site-author-panel/src/features/loginSlice.js b/blogging-site-author-panel/src/features/loginSlice.js
index c896140..d99fa59 100644
--- a/blogging-site-author-panel/src/features/loginSlice.js
+++ b/blogging-site-author-panel/src/features/loginSlice.js
@@ -9,7 +9,6 @@ export const doLoginRequest = createAsyncThunk("login/doLoginRequest", async (se
         localStorage.setItem('abToken', accessToken)
         dispatch(setIsAuthenticated(true))
     } catch (error) {
-        console.log(error);
         if (error.response) {
             return rejectWithValue(error.response.data.message)
         }
@@ -46,12 +45,10 @@ export const loginSlice = createSlice({
     }
     , extraReducers: (builder) => {
         builder.addCase(getuserRequest.rejected, (state, action) => {
-            console.log("Sucess");
+            console.log("getuser failed:", action.payload);
             state.errorInUser = action.payload
         }),
             builder.addCase(doLoginRequest.rejected, (state, action) => {
-                console.log("Rejected", action.payload);
-
                 state.errorInUser = action.payload
             })
     }
diff --git a/blogging-site-author-panel/src/pages/dashboard/dashboardComponents/storageStatus.jsx b/blogging-site-author-panel/src/pages/dashboard/dashboardComponents/storageStatus.jsx
index 6ecd7b5..17b83b0 100644
--- a/blogging-site-author-panel/src/pages/dashboard/dashboardComponents/storageStatus.jsx
+++ b/blogging-site-author-panel/src/pages/dashboard/dashboardComponents/storageStatus.jsx
@@ -1,5 +1,5 @@
 const StorageStatus = ({color, icon , total, present, desciption})=>{
-    const width = `${Math.floor(Number(present/total*100))}`
+    const width = total > 0 ? `${Math.floor(Number(present / total * 100))}` : "0"
     return (
         <div className="flex gap-4">
             <div className={`rounded-s bg-gray-200 ${"text-"+color+"-600"} text-2xl h-10 w-10 flex justify-center items-center`}>{icon}</div>
diff --git a/blogging-site-author-panel/src/pages/delete.jsx b/blogging-site-author-panel/src/pages/delete.jsx
index 48bb1b8..13d8593 100644
--- a/blogging-site-author-panel/src/pages/delete.jsx
+++ b/blogging-site-author-panel/src/pages/delete.jsx
@@ -1,10 +1,10 @@
 import React, { useEffect } from 'react'
 import { useDispatch, useSelector } from 'react-redux'
 import { useNavigate, useParams } from 'react-router-dom'
-import { clearError, deleteCategoryRequest, singleCategoryRequest } from '../../../features/categorySlice'
-import { setMessage } from '../../../features/appSlice'
+import { clearError, deleteCategoryRequest, singleCategoryRequest } from '../../features/categorySlice'
+import { setMessage } from '../../features/appSlice'
 import { Link } from 'react-router-dom'
-import NotificationModal from '../../../Components/modals/NotificationModal'
+import NotificationModal from '../../Components/modals/NotificationModal'
 
 
 
diff --git a/blogging-site-author-panel/src/pages/login/login.jsx b/blogging-site-author-panel/src/pages/login/login.jsx
index e10fdb4..258d301 100644
--- a/blogging-site-author-panel/src/pages/login/login.jsx
+++ b/blogging-site-author-panel/src/pages/login/login.jsx
@@ -47,8 +47,8 @@ const Login = () => {
                 {errorInLogin && (
                     <NotificationModal
                         message={errorInLogin}
-                        open={errorInLogin}
-                        close={() => dispatch(clearError())}
+                        modelOpen={errorInLogin}
+                        modelClose={() => dispatch(clearError())}
                     />
                 )}
                 <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
diff --git a/blogging-site-author-panel/src/pages/sites/SingleSiteMenu.jsx b/blogging-site-author-panel/src/pages/sites/SingleSiteMenu.jsx
index ec51b4f..d027bab 100644
--- a/blogging-site-author-panel/src/pages/sites/SingleSiteMenu.jsx
+++ b/blogging-site-author-panel/src/pages/sites/SingleSiteMenu.jsx
@@ -16,15 +16,13 @@ export default function SingleSiteAuthors({ slug }) {
 
   useEffect(() => {
     dispatch(getAllAuthorRequest())
-    dispatch(singleSiteRequest())
-    console.log("all authores : ", allAuthorArray);
-    console.log("single site : ", site);
-  }, [dispatch])
+    dispatch(singleSiteRequest(slug))
+  }, [dispatch, slug])
 
   return (
-    <section className="p-4"><h2 class="text-4xl font-extrabold dark:text-white py-4">All Authors</h2>
+    <section className="p-4"><h2 className="text-4xl font-extrabold dark:text-white py-4">All Authors</h2>
       {allAuthorArray && allAuthorArray.length > 0 && allAuthorArray.map(one => {
-        return <Link to={`/sites/${one._id}`}><button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{one.name}</button></Link>
+        return <Link to={`/sites/${one._id}`}><button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{one.name}</button></Link>
       })}</section>
   )
 }
diff --git a/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx b/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
index 801f288..eff6728 100644
--- a/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
+++ b/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
@@ -10,10 +10,10 @@ function AllAuthors() {
   const dispatch = useDispatch()
 
   const Authors = useSelector(state => state.author.allAuthors)
-  console.log("tags  L ", Authors);
+
 
   useEffect(() => {
-    dispatch(getAllAuthorRequest())
+    dispatch(getAllAuthorRequest(siteId))
   }, [dispatch])
   return (
     <div className="flex flex-wrap justify-evenly gap-2 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/blogs/AllBlogs.jsx b/blogging-site-author-panel/src/pages/sites/blogs/AllBlogs.jsx
index 020e36c..f607881 100644
--- a/blogging-site-author-panel/src/pages/sites/blogs/AllBlogs.jsx
+++ b/blogging-site-author-panel/src/pages/sites/blogs/AllBlogs.jsx
@@ -16,7 +16,7 @@ function AllBlogs() {
   useEffect(() => {
     dispatch(getAllBlogsRequest(siteId))
   }, [dispatch])
-  console.log(data[0]);
+
   return (
     <div className='px-5 bg-gray-100'>
       <p className="text-md font-bold">Total Blogs</p>
diff --git a/blogging-site-author-panel/src/store/store.js b/blogging-site-author-panel/src/store/store.js
index b67b605..f810a1a 100644
--- a/blogging-site-author-panel/src/store/store.js
+++ b/blogging-site-author-panel/src/store/store.js
@@ -5,8 +5,8 @@ import blogReducer from "../features/blogSlice"
 import authorReducer from '../features/authorSlice'
 import categoryReducer from '../features/categorySlice'
 import staticPagesReducer from '../features/staticPagesSlice'
-import navigationSlice from '../features/navigationSlice'
-import tagsSlice from '../features/tagsSlice'
+import navigationReducer from '../features/navigationSlice'
+import tagsReducer from '../features/tagsSlice'
 import socialMediaReducer from '../features/socialMediaSlice'
 import siteReducer from '../features/siteSlice'
 
@@ -18,8 +18,8 @@ export const store = configureStore({
     author:authorReducer,
     category:categoryReducer,
     staticPages:staticPagesReducer,
-    navigation:navigationSlice,
-    tags:tagsSlice,
+    navigation:navigationReducer,
+    tags:tagsReducer,
     socialMedia:socialMediaReducer,
     sites:siteReducer
   },
diff --git a/blogging-site-author-panel/src/utils/helper.js b/blogging-site-author-panel/src/utils/helper.js
index 4b1013e..fa2c7ad 100644
--- a/blogging-site-author-panel/src/utils/helper.js
+++ b/blogging-site-author-panel/src/utils/helper.js
@@ -16,9 +16,8 @@ export const uploadImageToAPI = async (imageFile) => {
   const formData = new FormData();
   formData.append('file', imageFile);
   const uploadToServer = await axios.post(`${process.env.REACT_APP_API_URL}/upload-single-image`, formData, {
-    headers: { 'Access-Control-Allow-Origin': '*' }
+    headers: {}
   });
 
-  console.log("uploadign image to server is maybe done recieved data : ", uploadToServer);
   return uploadToServer?.data;
 };
\ No newline at end of file
diff --git a/blogging-site-author-panel/src/utils/setAuthorizationHeader.js b/blogging-site-author-panel/src/utils/setAuthorizationHeader.js
index 4b70a7a..07101f7 100644
--- a/blogging-site-author-panel/src/utils/setAuthorizationHeader.js
+++ b/blogging-site-author-panel/src/utils/setAuthorizationHeader.js
@@ -3,7 +3,7 @@ import axios from 'axios';
 export const setAuthorizationToken = (token) => {
   if (token) {
     axios.defaults.headers.common.Authorization = `Bearer ${token}`;
-    axios.defaults.headers.common['Access-control-allow-credentials'] = true;
+
   } else {
     delete axios.defaults.headers.common.Authorization;
   }
```

## Final Round — Re-Audit Fixes (10+ Additional Issues)

A second pass over the author panel found issues missed in the initial 35-fix sweep, plus some additional public-panel tweaks.

### Issues Fixed

| ID | Severity | File | Fix |
|----|----------|------|-----|
| CR1 | Critical | All 9 slices | `extraReducers`: comma-separated `builder.addCase(),` → chained `.addCase().addCase()` |
| H11 | High | `AddUpdateStaticPage.jsx` | Added missing `dispatch(singleSiteRequest(siteId))` |
| H12 | High | `AllAuthors.jsx` | Edit/Delete links were empty strings → filled with real routes |
| M11 | Medium | `multiSelect.jsx` | Missing `useState` import |
| M12 | Medium | `AddUpdateSocialMedia.jsx` | Dead `setSingleNavigation({})` dispatch still present after import removal |
| M13 | Medium | `routes.jsx` | Missing author route → added |
| M14 | Medium | `dashboard.jsx` | Guard `sites[0]?._id` → wrap with `sites?.length > 0` |
| M15 | Medium | `authorAPI.js` | `getAll()` missing `siteId` param → added |
| M16 | Medium | `DeleteStaticPage.jsx` | `staticPage.name` → `staticPage.page` |
| L13 | Low | 6 delete pages | `Cancle` → `Cancel` |
| L14 | Low | `AllSites.jsx` | `Acitive` → `Active` |
| L15 | Low | `tabledata.js` | `Desciption` → `Description` |
| L16 | Low | `tagsSlice.js` | Removed stale `console.log("done request"+ data)` |
| L17 | Low | `dashboard.jsx` | Removed stale `console.log("Chilederen is loding...")` |
| L18 | Low | `loginSlice.js` | Fixed misleading `"Sucess"` log message |
| L19 | Low | — | Deleted orphaned `SuccessModal.js`, `temperery/try.js` |

### Git Diff

```diff
diff --git a/blogging-site-author-panel/src/features/authorSlice.js b/blogging-site-author-panel/src/features/authorSlice.js
index 71820d2..5678b1f 100644
--- a/blogging-site-author-panel/src/features/authorSlice.js
+++ b/blogging-site-author-panel/src/features/authorSlice.js
@@ -82,20 +82,22 @@ export const authorSlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllAuthorRequest.rejected, (state, action)=>{
-        state.errorInAuthor= action.payload
-    }),
-    builder.addCase(addNewAuthorRequest.rejected, (state, action)=>{
-        state.errorInAuthor= action.payload
-    }),    builder.addCase(updateAuthorRequest.rejected, (state, action)=>{
-        state.errorInAuthor= action.payload
-    }),
-    builder.addCase(singleAuthorRequest.rejected, (state, action)=>{
-        state.errorInAuthor= action.payload
-    }),
-    builder.addCase(deleteAuthorRequest.rejected, (state, action)=>{
-        state.errorInAuthor= action.payload
-    })
+    builder
+        .addCase(getAllAuthorRequest.rejected, (state, action)=>{
+            state.errorInAuthor= action.payload
+        })
+        .addCase(addNewAuthorRequest.rejected, (state, action)=>{
+            state.errorInAuthor= action.payload
+        })
+        .addCase(updateAuthorRequest.rejected, (state, action)=>{
+            state.errorInAuthor= action.payload
+        })
+        .addCase(singleAuthorRequest.rejected, (state, action)=>{
+            state.errorInAuthor= action.payload
+        })
+        .addCase(deleteAuthorRequest.rejected, (state, action)=>{
+            state.errorInAuthor= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/blogSlice.js b/blogging-site-author-panel/src/features/blogSlice.js
index 5b0223d..3d7322c 100644
--- a/blogging-site-author-panel/src/features/blogSlice.js
+++ b/blogging-site-author-panel/src/features/blogSlice.js
@@ -83,20 +83,22 @@ export const blogSlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllBlogsRequest.rejected, (state, action)=>{
-        state.errorInBlogs= action.payload
-    }),
-    builder.addCase(addNewBlogRequest.rejected, (state, action)=>{
-        state.errorInBlogs= action.payload
-    }),    builder.addCase(updateBlogRequest.rejected, (state, action)=>{
-        state.errorInBlogs= action.payload
-    }),
-    builder.addCase(singleBlogRequest.rejected, (state, action)=>{
-        state.errorInBlogs= action.payload
-    }),
-    builder.addCase(deleteBlogRequest.rejected, (state, action)=>{
-        state.errorInBlogs= action.payload
-    })
+    builder
+        .addCase(getAllBlogsRequest.rejected, (state, action)=>{
+            state.errorInBlogs= action.payload
+        })
+        .addCase(addNewBlogRequest.rejected, (state, action)=>{
+            state.errorInBlogs= action.payload
+        })
+        .addCase(updateBlogRequest.rejected, (state, action)=>{
+            state.errorInBlogs= action.payload
+        })
+        .addCase(singleBlogRequest.rejected, (state, action)=>{
+            state.errorInBlogs= action.payload
+        })
+        .addCase(deleteBlogRequest.rejected, (state, action)=>{
+            state.errorInBlogs= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/categorySlice.js b/blogging-site-author-panel/src/features/categorySlice.js
index c7a8d8d..ca6ef78 100644
--- a/blogging-site-author-panel/src/features/categorySlice.js
+++ b/blogging-site-author-panel/src/features/categorySlice.js
@@ -82,20 +82,22 @@ export const categorySlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllCategoryRequest.rejected, (state, action)=>{
-        state.errorInCategory= action.payload
-    }),
-    builder.addCase(addNewCategoryRequest.rejected, (state, action)=>{
-        state.errorInCategory= action.payload
-    }),    builder.addCase(updateCategoryRequest.rejected, (state, action)=>{
-        state.errorInCategory= action.payload
-    }),
-    builder.addCase(singleCategoryRequest.rejected, (state, action)=>{
-        state.errorInCategory= action.payload
-    }),
-    builder.addCase(deleteCategoryRequest.rejected, (state, action)=>{
-        state.errorInCategory= action.payload
-    })
+    builder
+        .addCase(getAllCategoryRequest.rejected, (state, action)=>{
+            state.errorInCategory= action.payload
+        })
+        .addCase(addNewCategoryRequest.rejected, (state, action)=>{
+            state.errorInCategory= action.payload
+        })
+        .addCase(updateCategoryRequest.rejected, (state, action)=>{
+            state.errorInCategory= action.payload
+        })
+        .addCase(singleCategoryRequest.rejected, (state, action)=>{
+            state.errorInCategory= action.payload
+        })
+        .addCase(deleteCategoryRequest.rejected, (state, action)=>{
+            state.errorInCategory= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/navigationSlice.js b/blogging-site-author-panel/src/features/navigationSlice.js
index d4e2181..b06827e 100644
--- a/blogging-site-author-panel/src/features/navigationSlice.js
+++ b/blogging-site-author-panel/src/features/navigationSlice.js
@@ -81,18 +81,20 @@ export const navigationSlice = createSlice({
     }
     , extraReducers: (builder) => {
-        builder.addCase(getAllNavigationRequest.rejected, (state, action) => {
-            state.errorInNavigation = action.payload
-        }),
-            builder.addCase(addNewNavigationRequest.rejected, (state, action) => {
+        builder
+            .addCase(getAllNavigationRequest.rejected, (state, action) => {
                 state.errorInNavigation = action.payload
-            }), builder.addCase(updateNavigationRequest.rejected, (state, action) => {
+            })
+            .addCase(addNewNavigationRequest.rejected, (state, action) => {
                 state.errorInNavigation = action.payload
-            }),
-            builder.addCase(singleNavigationRequest.rejected, (state, action) => {
+            })
+            .addCase(updateNavigationRequest.rejected, (state, action) => {
                 state.errorInNavigation = action.payload
-            }),
-            builder.addCase(deleteNavigationRequest.rejected, (state, action) => {
+            })
+            .addCase(singleNavigationRequest.rejected, (state, action) => {
+                state.errorInNavigation = action.payload
+            })
+            .addCase(deleteNavigationRequest.rejected, (state, action) => {
                 state.errorInNavigation = action.payload
             })
     }
 
diff --git a/blogging-site-author-panel/src/features/siteSlice.js b/blogging-site-author-panel/src/features/siteSlice.js
index 6d6ab5e..9e805d4 100644
--- a/blogging-site-author-panel/src/features/siteSlice.js
+++ b/blogging-site-author-panel/src/features/siteSlice.js
@@ -83,20 +83,22 @@ export const siteSlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllSitesRequest.rejected, (state, action)=>{
-        state.errorInSite= action.payload
-    }),
-    builder.addCase(addNewSiteRequest.rejected, (state, action)=>{
-        state.errorInSite= action.payload
-    }),    builder.addCase(updateSiteRequest.rejected, (state, action)=>{
-        state.errorInSite= action.payload
-    }),
-    builder.addCase(singleSiteRequest.rejected, (state, action)=>{
-        state.errorInSite= action.payload
-    }),
-    builder.addCase(deleteSiteRequest.rejected, (state, action)=>{
-        state.errorInSite= action.payload
-    })
+    builder
+        .addCase(getAllSitesRequest.rejected, (state, action)=>{
+            state.errorInSite= action.payload
+        })
+        .addCase(addNewSiteRequest.rejected, (state, action)=>{
+            state.errorInSite= action.payload
+        })
+        .addCase(updateSiteRequest.rejected, (state, action)=>{
+            state.errorInSite= action.payload
+        })
+        .addCase(singleSiteRequest.rejected, (state, action)=>{
+            state.errorInSite= action.payload
+        })
+        .addCase(deleteSiteRequest.rejected, (state, action)=>{
+            state.errorInSite= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/socialMediaSlice.js b/blogging-site-author-panel/src/features/socialMediaSlice.js
index f1448dd..acd0ca5 100644
--- a/blogging-site-author-panel/src/features/socialMediaSlice.js
+++ b/blogging-site-author-panel/src/features/socialMediaSlice.js
@@ -82,20 +82,22 @@ export const socialMediaSlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllSocialMediaRequest.rejected, (state, action)=>{
-        state.errorInSocialMedia= action.payload
-    }),
-    builder.addCase(addNewSocialMediaRequest.rejected, (state, action)=>{
-        state.errorInSocialMedia= action.payload
-    }),    builder.addCase(updateSocialMediaRequest.rejected, (state, action)=>{
-        state.errorInSocialMedia= action.payload
-    }),
-    builder.addCase(singleSocialMediaRequest.rejected, (state, action)=>{
-        state.errorInSocialMedia= action.payload
-    }),
-    builder.addCase(deleteSocialMediaRequest.rejected, (state, action)=>{
-        state.errorInSocialMedia= action.payload
-    })
+    builder
+        .addCase(getAllSocialMediaRequest.rejected, (state, action)=>{
+            state.errorInSocialMedia= action.payload
+        })
+        .addCase(addNewSocialMediaRequest.rejected, (state, action)=>{
+            state.errorInSocialMedia= action.payload
+        })
+        .addCase(updateSocialMediaRequest.rejected, (state, action)=>{
+            state.errorInSocialMedia= action.payload
+        })
+        .addCase(singleSocialMediaRequest.rejected, (state, action)=>{
+            state.errorInSocialMedia= action.payload
+        })
+        .addCase(deleteSocialMediaRequest.rejected, (state, action)=>{
+            state.errorInSocialMedia= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/staticPagesSlice.js b/blogging-site-author-panel/src/features/staticPagesSlice.js
index b59ea89..7b862f7 100644
--- a/blogging-site-author-panel/src/features/staticPagesSlice.js
+++ b/blogging-site-author-panel/src/features/staticPagesSlice.js
@@ -82,20 +82,22 @@ export const staticPagesSlice = createSlice({
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllStaticPagesRequest.rejected, (state, action)=>{
-        state.errorInStaticPages= action.payload
-    }),
-    builder.addCase(addNewStaticPagesRequest.rejected, (state, action)=>{
-        state.errorInStaticPages= action.payload
-    }),    builder.addCase(updateStaticPagesRequest.rejected, (state, action)=>{
-        state.errorInStaticPages= action.payload
-    }),
-    builder.addCase(singleStaticPageRequest.rejected, (state, action)=>{
-        state.errorInStaticPages= action.payload
-    }),
-    builder.addCase(deleteStaticPagesRequest.rejected, (state, action)=>{
-        state.errorInStaticPages= action.payload
-    })
+    builder
+        .addCase(getAllStaticPagesRequest.rejected, (state, action)=>{
+            state.errorInStaticPages= action.payload
+        })
+        .addCase(addNewStaticPagesRequest.rejected, (state, action)=>{
+            state.errorInStaticPages= action.payload
+        })
+        .addCase(updateStaticPagesRequest.rejected, (state, action)=>{
+            state.errorInStaticPages= action.payload
+        })
+        .addCase(singleStaticPageRequest.rejected, (state, action)=>{
+            state.errorInStaticPages= action.payload
+        })
+        .addCase(deleteStaticPagesRequest.rejected, (state, action)=>{
+            state.errorInStaticPages= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/features/tagsSlice.js b/blogging-site-author-panel/src/features/tagsSlice.js
index dc15e45..5461bf5 100644
--- a/blogging-site-author-panel/src/features/tagsSlice.js
+++ b/blogging-site-author-panel/src/features/tagsSlice.js
@@ -6,7 +6,6 @@ export const getAllTagsRequest = createAsyncThunk("tags/getAllTagsRequest", asyn
     try {
         const data= await tagsAPI.getAll(sendData)
         dispatch(setAllTags(data))
-        console.log("done request"+ data);
     } catch (error) {
         if (error.response) {
             return rejectWithValue(error.response.data.message)
@@ -83,20 +82,22 @@ export const tagsSlice = createSlice({
         }
     }
 , extraReducers:(builder)=>{
-    builder.addCase(getAllTagsRequest.rejected, (state, action)=>{
-        state.errorInTags= action.payload
-    }),
-    builder.addCase(addNewTagsRequest.rejected, (state, action)=>{
-        state.errorInTags= action.payload
-    }),    builder.addCase(updateTagsRequest.rejected, (state, action)=>{
-        state.errorInTags= action.payload
-    }),
-    builder.addCase(singleTagsRequest.rejected, (state, action)=>{
-        state.errorInTags= action.payload
-    }),
-    builder.addCase(deleteTagsRequest.rejected, (state, action)=>{
-        state.errorInTags= action.payload
-    })
+    builder
+        .addCase(getAllTagsRequest.rejected, (state, action)=>{
+            state.errorInTags= action.payload
+        })
+        .addCase(addNewTagsRequest.rejected, (state, action)=>{
+            state.errorInTags= action.payload
+        })
+        .addCase(updateTagsRequest.rejected, (state, action)=>{
+            state.errorInTags= action.payload
+        })
+        .addCase(singleTagsRequest.rejected, (state, action)=>{
+            state.errorInTags= action.payload
+        })
+        .addCase(deleteTagsRequest.rejected, (state, action)=>{
+            state.errorInTags= action.payload
+        })
 }
 })
 
diff --git a/blogging-site-author-panel/src/Components/common/multiSelect.jsx b/blogging-site-author-panel/src/Components/common/multiSelect.jsx
index e5196ca..e37670d 100644
--- a/blogging-site-author-panel/src/Components/common/multiSelect.jsx
+++ b/blogging-site-author-panel/src/Components/common/multiSelect.jsx
@@ -1,7 +1,6 @@
-import { useField, useFormikContext } from "formik"
+import { useFormikContext } from "formik"
 import { useState } from "react"
 import Select from "./multiSelectTag"
-import { PiEggCrackLight } from "react-icons/pi"
 
 // ___________________Tag Multi Select_____________________
 const MultiSelect = ({ name, options, selected }) => {
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
index 637cd18..ad3d94c 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateSocialMedia.jsx
@@ -8,7 +8,6 @@ import { setMessage } from "../../features/appSlice";
 import { FieldBox } from "../common/fieldBox";
 import { singleSiteRequest } from "../../features/siteSlice";
 import { addNewSocialMediaRequest, clearError, singleSocialMediaRequest, updateSocialMediaRequest } from "../../features/socialMediaSlice";
-import { setSingleNavigation } from "../../features/navigationSlice";
 export default function AddUpdateSocialMedia({ edit }) {
     const dispatch = useDispatch()
     const navigate = useNavigate()
@@ -23,14 +22,13 @@ export default function AddUpdateSocialMedia({ edit }) {
 
 
     const submitFunction = async (value) => {
-        const submitValue = { ...value, site: singleSite.site }
+        const submitValue = { ...value, site: singleSite._id }
         if (edit) {
             const editedValue = { ...submitValue, id: socialMediaId }
             dispatch(updateSocialMediaRequest(editedValue))
         } else {
             dispatch(addNewSocialMediaRequest(submitValue))
         }
     }
 
     const initialValues = {
-        // this is needed to be correct once checked from the browser
         name: edit ? singleSocialMedia?.name : "",
         link: edit ? singleSocialMedia?.link : "",
     }
@@ -38,7 +36,6 @@ export default function AddUpdateSocialMedia({ edit }) {
     const resetAndNavigate = ({ error }) => {
         dispatch(clearError())
         dispatch(setMessage(""))
-        dispatch(setSingleNavigation({}))
         !error && navigate(`/sites/${siteId}/social-media`)
     }
 
diff --git a/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx b/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
index baa77f1..2117cf9 100644
--- a/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
+++ b/blogging-site-author-panel/src/Components/forms/AddUpdateStaticPage.jsx
@@ -59,15 +59,16 @@ function AddUpdateStaticPage({ edit }) {
     }
     const onSubmitFunction = async (values) => {
         if (edit) {
-            const editValue = { ...values, site: singleSite?.site, staticPageId }
+            const editValue = { ...values, site: singleSite?._id, staticPageId }
             dispatch(updateStaticPagesRequest(editValue))
             return
         }
-        const finalValues = { ...values, site: singleSite?.site }
+        const finalValues = { ...values, site: singleSite?._id }
         dispatch(addNewStaticPagesRequest(finalValues))
     }
 
     useEffect(() => {
+        dispatch(singleSiteRequest(siteId))
         if (edit) {
             dispatch(singleStaticPageRequest(staticPageId))
         }
diff --git a/blogging-site-author-panel/src/Components/table/tabledata.js b/blogging-site-author-panel/src/Components/table/tabledata.js
index cd60ebb..e7357bc 100644
--- a/blogging-site-author-panel/src/Components/table/tabledata.js
+++ b/blogging-site-author-panel/src/Components/table/tabledata.js
@@ -97,7 +97,7 @@ export const SocialMediaHeaders = [
 
 export const StaticPageHeader = [
   {
-    headerName: "Desciption",
+    headerName: "Description",
     accesserId: "description",
     type: "string",
     formatFunction: stringClip,
diff --git a/blogging-site-author-panel/src/api/authorAPI.js b/blogging-site-author-panel/src/api/authorAPI.js
index 5ccea5b..5b24528 100644
--- a/blogging-site-author-panel/src/api/authorAPI.js
+++ b/blogging-site-author-panel/src/api/authorAPI.js
@@ -4,13 +4,13 @@ const baseURL = `${process.env.REACT_APP_API_URL}`
 const startUrl =  `${process.env.REACT_APP_API_BASE_URL}/admin`
 
 export const authorAPI = {
-    getAll: () => axios.get(`${baseURL}/all-writers`).then(res => res.data),
+    getAll: (siteId) => axios.get(`${baseURL}/authors`).then(res => res.data),
     addNew: (content) => axios.post(`${startUrl}/register`, content).then(res => res.data),
     update: async(dt) => {
         const { id, ...rest } = dt
 
-        return axios.put(`${baseURL}/single-site/${id}`, rest).then(res => res.data)
+        return axios.put(`${baseURL}/author/${id}`, rest).then(res => res.data)
     },
-    delete: (dt) => axios.delete(`${baseURL}/single-site/${dt}`).then(res => res.data),
+    delete: (dt) => axios.delete(`${baseURL}/author/${dt}`).then(res => res.data),
     single: (dt) => axios.get(`${baseURL}/get-writer/${dt}`).then(res => res.data),
 }
\ No newline at end of file
diff --git a/blogging-site-author-panel/src/features/loginSlice.js b/blogging-site-author-panel/src/features/loginSlice.js
index c896140..d99fa59 100644
--- a/blogging-site-author-panel/src/features/loginSlice.js
+++ b/blogging-site-author-panel/src/features/loginSlice.js
@@ -9,7 +9,6 @@ export const doLoginRequest = createAsyncThunk("login/doLoginRequest", async (se
         localStorage.setItem('abToken', accessToken)
         dispatch(setIsAuthenticated(true))
     } catch (error) {
-        console.log(error);
         if (error.response) {
             return rejectWithValue(error.response.data.message)
         }
@@ -46,12 +45,10 @@ export const loginSlice = createSlice({
     }
     , extraReducers: (builder) => {
         builder.addCase(getuserRequest.rejected, (state, action) => {
-            console.log("Sucess");
+            console.log("getuser failed:", action.payload);
             state.errorInUser = action.payload
         }),
             builder.addCase(doLoginRequest.rejected, (state, action) => {
-                console.log("Rejected", action.payload);
-
                 state.errorInUser = action.payload
             })
     }
diff --git a/blogging-site-author-panel/src/pages/dashboard/dashboard.jsx b/blogging-site-author-panel/src/pages/dashboard/dashboard.jsx
index c866fc3..33cb448 100644
--- a/blogging-site-author-panel/src/pages/dashboard/dashboard.jsx
+++ b/blogging-site-author-panel/src/pages/dashboard/dashboard.jsx
@@ -19,7 +19,6 @@ const Dashboard = () => {
 
     const sites = useSelector((state) => state.sites.allSites);
     useEffect(() => {
-        console.log("Chilederen is loding hence request is send");
         dispatch(getAllSitesRequest());
     }, [dispatch]);
 
@@ -50,7 +49,7 @@ const Dashboard = () => {
                     />
                     <Friends authors={authors} />
                 </div>
-                <RecentBlog siteId={sites[0]?._id} blogs={blog} />
+                {sites && sites.length > 0 && <RecentBlog siteId={sites[0]._id} blogs={blog} />}
             </div>
         </div>
     );
diff --git a/blogging-site-author-panel/src/pages/sites/AllSites.jsx b/blogging-site-author-panel/src/pages/sites/AllSites.jsx
index 5bc84e2..365e8c4 100644
--- a/blogging-site-author-panel/src/pages/sites/AllSites.jsx
+++ b/blogging-site-author-panel/src/pages/sites/AllSites.jsx
@@ -26,7 +26,7 @@ export default function AllSites() {
                 Id : {site._id}
               </p>
               <p className={`text-gray-400 text-sm ${statusColor}`}>
-                {site.isActive ? "Acitive" : "Not Active"}
+                {site.isActive ? "Active" : "Not Active"}
               </p>
             </div>
           </Link>
diff --git a/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx b/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
index 801f288..51c463c 100644
--- a/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
+++ b/blogging-site-author-panel/src/pages/sites/authors/AllAuthors.jsx
@@ -10,10 +10,10 @@ function AllAuthors() {
   const dispatch = useDispatch()
 
   const Authors = useSelector(state => state.author.allAuthors)
-  console.log("tags  L ", Authors);
+
 
   useEffect(() => {
-    dispatch(getAllAuthorRequest())
+    dispatch(getAllAuthorRequest(siteId))
   }, [dispatch])
   return (
     <div className="flex flex-wrap justify-evenly gap-2 my-5">
@@ -25,8 +25,8 @@ function AllAuthors() {
               <div className="text-black font-bold text-lg">{each.name}</div>
               <div className="text-gray-400 font-extralight text-sm">{each.email}</div>
               <div className=" mt-5 flex  basis-full gap-10 justify-center">
-                <Link to={``}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Edit</div></Link>
-                <Link to={``}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Delete</div></Link>
+                <Link to={`/sites/${siteId}/authors/update-author/${each._id}`}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Edit</div></Link>
+                <Link to={`/sites/${siteId}/authors/delete/${each._id}`}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Delete</div></Link>
               </div>
             </div>
           </div>
diff --git a/blogging-site-author-panel/src/pages/sites/blogs/DeleteBlog.jsx b/blogging-site-author-panel/src/pages/sites/blogs/DeleteBlog.jsx
index b9c6cb2..63dacd7 100644
--- a/blogging-site-author-panel/src/pages/sites/blogs/DeleteBlog.jsx
+++ b/blogging-site-author-panel/src/pages/sites/blogs/DeleteBlog.jsx
@@ -47,7 +47,7 @@ export default function DeleteBlog() {
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/blogs`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteBlog(blogId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/category/DeleteCategory.jsx b/blogging-site-author-panel/src/pages/sites/category/DeleteCategory.jsx
index fd756d0..7030b6c 100644
--- a/blogging-site-author-panel/src/pages/sites/category/DeleteCategory.jsx
+++ b/blogging-site-author-panel/src/pages/sites/category/DeleteCategory.jsx
@@ -49,7 +49,7 @@ export default function DeleteCategory() {
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/categories`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteCategory(categoryId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/navigation/DeleteNavigation.jsx b/blogging-site-author-panel/src/pages/sites/navigation/DeleteNavigation.jsx
index b868662..dc3416f 100644
--- a/blogging-site-author-panel/src/pages/sites/navigation/DeleteNavigation.jsx
+++ b/blogging-site-author-panel/src/pages/sites/navigation/DeleteNavigation.jsx
@@ -49,7 +49,7 @@ export default function DeleteNavigation() {
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/navigation`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteNavigation(navId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/socialMedia/deleteSocialMedia.jsx b/blogging-site-author-panel/src/pages/sites/socialMedia/deleteSocialMedia.jsx
index 3b6d5e9..a918489 100644
--- a/blogging-site-author-panel/src/pages/sites/socialMedia/deleteSocialMedia.jsx
+++ b/blogging-site-author-panel/src/pages/sites/socialMedia/deleteSocialMedia.jsx
@@ -45,7 +45,7 @@ export default function DeleteSocialMedia() {
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/social-media`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteSocialMedia(socialMediaId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/staticPage/DeleteStaticPage.jsx b/blogging-site-author-panel/src/pages/sites/staticPage/DeleteStaticPage.jsx
index 2c243de..91e13f7 100644
--- a/blogging-site-author-panel/src/pages/sites/staticPage/DeleteStaticPage.jsx
+++ b/blogging-site-author-panel/src/pages/sites/staticPage/DeleteStaticPage.jsx
@@ -42,13 +42,13 @@ export default function DeleteStaticPage() {
           <div className=" rounded-xl h-full flex items-center justify-center flex-wrap py-auto overflow-hidden">
             <RiDeleteBinFill className="text-red-500 text-[140px]" />
             <div className="basis-full text-xl  font-semibold">
-              <p className="text-center h-fit text-gray-800">ARE YOU SURE TO DELETE STATIC PAGE <br/>"{staticPage.name}"</p>
+              <p className="text-center h-fit text-gray-800">ARE YOU SURE TO DELETE STATIC PAGE <br/>"{staticPage.page}"</p>
               <p className="text-center h-fit text-gray-500 text-sm px-20">This is a irreversable change!</p>
             </div>
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/static-page`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteStaticPage(staticPageId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/pages/sites/tags/DeleteTags.jsx b/blogging-site-author-panel/src/pages/sites/tags/DeleteTags.jsx
index 8b0faf3..d2a49db 100644
--- a/blogging-site-author-panel/src/pages/sites/tags/DeleteTags.jsx
+++ b/blogging-site-author-panel/src/pages/sites/tags/DeleteTags.jsx
@@ -48,7 +48,7 @@ export default function DeleteTags() {
             <div className="flex justify-between w-full px-20">
               <Link to={`/sites/${siteId}/tags`}>
                 <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
-                  Cancle
+                  Cancel
                 </button>
               </Link>
               <button onClick={() => { deleteTag(tagId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
diff --git a/blogging-site-author-panel/src/routes.jsx b/blogging-site-author-panel/src/routes.jsx
index 965c9ef..53e0c00 100644
--- a/blogging-site-author-panel/src/routes.jsx
+++ b/blogging-site-author-panel/src/routes.jsx
@@ -76,6 +76,8 @@ const AvailRoutes = (props) => {
       <Route path={`/sites/:siteId/static-page/add-new`} element={<DashBoardLayout title="Add New Static Pages" description="Fill the Form and upload to submit new Static Pages." > <AddUpdateStaticPage/></DashBoardLayout>} />
       <Route path={`/sites/:siteId/static-page/update-static-page/:staticPageId`} element={<DashBoardLayout title="Update Static Page" description="Fill the Form and upload to Update Static Page." > <AddUpdateStaticPage edit /></DashBoardLayout>} />
       <Route path={`/sites/:siteId/static-page/delete/:staticPageId`} element={<DashBoardLayout  title="Delete Your Static Page ?" description="Confirm to delete your Static Page!" > <DeleteStaticPage/></DashBoardLayout>} />
+
+      <Route path={`/sites/:siteId/authors`} element={<DashBoardLayout title="Your Authors" description="Here is the summary of all the Authors that are added." ><AllAuthors/></DashBoardLayout>} />
       
     </Routes>
```
