import { Hono } from "hono"
import { cors } from "hono/cors"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"
import { jwt } from "hono/jwt"
import { getConfig } from "./config.js"
import {
  handleLogo,
  handlePageMetaData,
  handleNav,
  handleSocialMedia,
  handleAllBlogs,
  handleFeatured,
  handleBlogByAuthorId,
  handleBlogByCategory,
  handleCategories,
  handleWriters,
  handleStaticPage,
  handlePageBySlug,
} from "./controllers/publicController.js"
import {
  handleLogin,
  handleGetUserDetail,
  handleSites,
  handleCreateSite,
  handleSingleSite,
  handleUpdateSite,
  handleDeleteSite,
  handleGetUserDetailBySiteId,
  handleUpdateBySiteId,
  handleDeleteBySiteId,
  handleBlogsBySiteId,
  handleCreateBlog,
  handleSingleBlog,
  handleUpdateBlog,
  handleDeleteBlog,
  handleCategoriesBySiteId,
  handleCreateCategory,
  handleSingleCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleTagsBySiteId,
  handleCreateTag,
  handleSingleTag,
  handleUpdateTag,
  handleDeleteTag,
  handleRegisterAuthor,
  handleSingleWriter,
  handleAllWriters,
  handleUpdateWriter,
  handleDeleteWriter,
  handleSocialBySiteId,
  handleCreateSocial,
  handleSingleSocial,
  handleUpdateSocial,
  handleDeleteSocial,
  handleStaticPagesBySiteId,
  handleCreateStaticPage,
  handleSingleStaticPage,
  handleUpdateStaticPage,
  handleDeleteStaticPage,
  handleUploadImage,
} from "./controllers/adminController.js"
import * as navRepo from "./repositories/navigationRepository.js"

export const createApp = (db) => {
  const { JWT_SECRET } = getConfig()
  const app = new Hono()

  app.use(logger())
  app.use("/api/*", cors())

  const nav = (fn) => fn(db)
  const NAV = {
    login: nav(handleLogin),
    getUserDetail: nav(handleGetUserDetail),
    sites: nav(handleSites),
    createSite: nav(handleCreateSite),
    singleSite: nav(handleSingleSite),
    updateSite: nav(handleUpdateSite),
    deleteSite: nav(handleDeleteSite),
    getUserDetailBySiteId: nav(handleGetUserDetailBySiteId),
    updateBySiteId: nav(handleUpdateBySiteId),
    deleteBySiteId: nav(handleDeleteBySiteId),
    blogsBySiteId: nav(handleBlogsBySiteId),
    createBlog: nav(handleCreateBlog),
    singleBlog: nav(handleSingleBlog),
    updateBlog: nav(handleUpdateBlog),
    deleteBlog: nav(handleDeleteBlog),
    categoriesBySiteId: nav(handleCategoriesBySiteId),
    createCategory: nav(handleCreateCategory),
    singleCategory: nav(handleSingleCategory),
    updateCategory: nav(handleUpdateCategory),
    deleteCategory: nav(handleDeleteCategory),
    tagsBySiteId: nav(handleTagsBySiteId),
    createTag: nav(handleCreateTag),
    singleTag: nav(handleSingleTag),
    updateTag: nav(handleUpdateTag),
    deleteTag: nav(handleDeleteTag),
    registerAuthor: nav(handleRegisterAuthor),
    singleWriter: nav(handleSingleWriter),
    allWriters: nav(handleAllWriters),
    updateWriter: nav(handleUpdateWriter),
    deleteWriter: nav(handleDeleteWriter),
    socialBySiteId: nav(handleSocialBySiteId),
    createSocial: nav(handleCreateSocial),
    singleSocial: nav(handleSingleSocial),
    updateSocial: nav(handleUpdateSocial),
    deleteSocial: nav(handleDeleteSocial),
    staticPagesBySiteId: nav(handleStaticPagesBySiteId),
    createStaticPage: nav(handleCreateStaticPage),
    singleStaticPage: nav(handleSingleStaticPage),
    updateStaticPage: nav(handleUpdateStaticPage),
    deleteStaticPage: nav(handleDeleteStaticPage),
    uploadImage: nav(handleUploadImage),
    logo: nav(handleLogo),
    nav: nav(handleNav),
    social: nav(handleSocialMedia),
    metaData: nav(handlePageMetaData),
    allBlogs: nav(handleAllBlogs),
    featured: nav(handleFeatured),
    blogByAuthor: nav(handleBlogByAuthorId),
    blogByCategory: nav(handleBlogByCategory),
    categories: nav(handleCategories),
    writers: nav(handleWriters),
    staticPage: nav(handleStaticPage),
    pageBySlug: nav(handlePageBySlug),
  }

  app.post("/api/login", NAV.login)

  const noAuthPaths = ["/api/login"]

  app.use("/api/*", async (c, next) => {
    if (noAuthPaths.includes(c.req.path)) {
      await next()
      return
    }
    return jwt({ secret: JWT_SECRET, alg: "HS256" })(c, next)
  })

  app.get("/api/get-user-detail", NAV.getUserDetail)

  app.get("/api/sites", NAV.sites)
  app.post("/api/sites", NAV.createSite)
  app.get("/api/single-site/:id", NAV.singleSite)
  app.put("/api/single-site/:id", NAV.updateBySiteId)
  app.delete("/api/single-site/:id", NAV.deleteBySiteId)

  app.get("/api/navigation-by-site-id/:siteId", async (c) => {
    const { siteId } = c.req.param()
    const result = await navRepo.findBySiteId(db, siteId)
    return c.json(result)
  })
  app.get("/api/navigation/:id", async (c) => {
    const { id } = c.req.param()
    const result = await navRepo.findById(db, id)
    if (!result) return c.body("Not Found", 404)
    return c.json(result)
  })
  app.post("/api/add-navigation", async (c) => {
    const { name, position, link, site } = await c.req.json()
    await navRepo.create(db, { name, link, position: +position, siteId: site, createdAt: Date.now() })
    return c.json({ status: true, message: "Done adding new Navigation" })
  })
  app.put("/api/navigation/:id", async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()
    await navRepo.update(db, id, body)
    return c.json({ status: true, message: "Updated" })
  })
  app.delete("/api/navigation/:id", async (c) => {
    const { id } = c.req.param()
    await navRepo.remove(db, id)
    return c.json({ message: "Deleted!" })
  })

  app.get("/api/pages-by-site-id/:siteId", NAV.blogsBySiteId)
  app.post("/api/add-new-page", NAV.createBlog)
  app.get("/api/single-page/:id", NAV.singleBlog)
  app.put("/api/single-page/:id", NAV.updateBlog)
  app.delete("/api/single-page/:id", NAV.deleteBlog)

  app.get("/api/categories-by-site-id/:siteId", NAV.categoriesBySiteId)
  app.post("/api/category", NAV.createCategory)
  app.get("/api/category/:id", NAV.singleCategory)
  app.put("/api/category/:id", NAV.updateCategory)
  app.delete("/api/category/:id", NAV.deleteCategory)

  app.get("/api/tags-by-site-id/:siteId", NAV.tagsBySiteId)
  app.post("/api/tags", NAV.createTag)
  app.get("/api/tags/:id", NAV.singleTag)
  app.put("/api/tags/:id", NAV.updateTag)
  app.delete("/api/tags/:id", NAV.deleteTag)

  app.post("/api/admin/register", NAV.registerAuthor)
  app.get("/api/get-writer/:id", NAV.singleWriter)

  app.get("/api/authors", NAV.allWriters)
  app.put("/api/author/:id", NAV.updateWriter)
  app.delete("/api/author/:id", NAV.deleteWriter)

  app.get("/api/social-media-by-site-id/:siteId", NAV.socialBySiteId)
  app.post("/api/add-social-media", NAV.createSocial)
  app.get("/api/social-media/:id", NAV.singleSocial)
  app.put("/api/social-media/:id", NAV.updateSocial)
  app.delete("/api/social-media/:id", NAV.deleteSocial)

  app.get("/api/static-pages-by-site-id/:siteId", NAV.staticPagesBySiteId)
  app.post("/api/add-new-static-page", NAV.createStaticPage)
  app.get("/api/single-static-page/:id", NAV.singleStaticPage)
  app.put("/api/single-static-page/:id", NAV.updateStaticPage)
  app.delete("/api/single-static-page/:id", NAV.deleteStaticPage)

  app.post("/api/upload-single-image", NAV.uploadImage)

  app.get("/api/user-detail/:id", NAV.getUserDetailBySiteId)
  app.put("/api/site/:id", NAV.updateSite)
  app.delete("/api/site/:id", NAV.deleteSite)

  app.get("/logo", NAV.logo)
  app.get("/meta-data/:page", NAV.metaData)

  app.get("/get-navigation", NAV.nav)
  app.get("/get-social-media", NAV.social)

  app.get("/blogs", NAV.allBlogs)
  app.get("/single-fetaured", NAV.featured)
  app.get("/get-blogs-by-author-id/:id", NAV.blogByAuthor)
  app.get("/blogs-by-category/:category", NAV.blogByCategory)

  app.get("/categories", NAV.categories)
  app.get("/all-writers", NAV.writers)

  app.get("/static-page/:slug", NAV.staticPage)
  app.get("/page-by-slug/:slug", NAV.pageBySlug)

  app.get("/category", NAV.categories)
  app.get("/get-meta-by-page/:page", NAV.metaData)
  app.get("/pages-by-category/:category", NAV.blogByCategory)
  app.get("/static-page-by-slug/:slug", NAV.staticPage)

  app.get("*", serveStatic({ root: "./public" }))

  return app
}
