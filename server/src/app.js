import { Hono } from "hono"
import { cors } from "hono/cors"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"

import { sign } from "hono/jwt"
import { featuredBlog, authors, staticPageLinks } from "./static.js";
import { handleLogo, handlePageMetaData, SOCIAL_MEDIA, handleAllBlogs, handleBlogByAuthorId, handleBlogByCategory, handleCategories, handleStaticPageBySlug, handlePageBySlug } from "./handlers.js"


export const createApp = () => {
  const secret = "123456789"
  const app = new Hono()

  app.use(logger())

  app.use("/api/*", cors());

  app.post("/api/login", async (c) => {
    const { email, password } = await c.req.json()

    const payload = {
      sub: email,
      iss: "Me",
      expiresIn: Date.now() + (5 * 1000)
    }
    const token = await sign(payload, secret)
    return c.json({ accessToken: token })
  })


  app.get("/logo", handleLogo)
  app.get("/meta-data/:page", handlePageMetaData)

  app.get("/get-navigation", (c) => c.json(staticPageLinks))
  app.get("/get-social-media", (c) => c.json(SOCIAL_MEDIA))

  app.get("/blogs", handleAllBlogs)
  app.get("/single-fetaured", (c) => c.json(featuredBlog))
  app.get("/get-blogs-by-author-id/:id", handleBlogByAuthorId)
  app.get("/blogs-by-category/:category", handleBlogByCategory)


  app.get("/categories", handleCategories)
  app.get("/all-writers", (c) => c.json(authors))


  app.get("/static-page/:slug", handleStaticPageBySlug)
  app.get("/page-by-slug/:slug", handlePageBySlug)


  app.get("*", serveStatic({ root: "./public" }))

  return app;
}
