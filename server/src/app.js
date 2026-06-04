import { Hono } from "hono"
import { cors } from "hono/cors"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"

import { sign, jwt } from "hono/jwt"
import { featuredBlog, authors } from "./static.js";
import { handleLogo, handlePageMetaData, SOCIAL_MEDIA, handleAllBlogs, handleBlogByAuthorId, handleBlogByCategory, handleCategories, handleStaticPageBySlug, handlePageBySlug } from "./handlers.js"
import { SiteHandler } from "./siteHandler.js";
import { NavigationsHandler } from "./navigationHandler.js";


export const createApp = () => {
  const sitesHandler = {}
  const mainSiteId = "site-id-1";
  const navigationsHandler = new NavigationsHandler({}, 1);
  const siteHandler = new SiteHandler(mainSiteId, "My Site")


  const aboutNavId = navigationsHandler.addNewNavigation("About", "/about", 1, mainSiteId)
  const policyNavId = navigationsHandler.addNewNavigation("Privacy Policy", "/privacy", 2, mainSiteId)
  const contactUsNavId = navigationsHandler.addNewNavigation("Contact Us", "/contact-us", 3, mainSiteId)

  siteHandler.addNavigation(aboutNavId, policyNavId, contactUsNavId)

  sitesHandler[mainSiteId] = siteHandler


  const secret = "12345678"
  const app = new Hono()

  app.use(logger())

  app.use("/api/*", cors());

  app.post("/api/login", async (c) => {
    const { email, password } = await c.req.json()

    if (!siteHandler.isValidUser(email, password)) {
      return c.body("Bad Request", 400)
    }

    const payload = {
      sub: email,
      iss: "Me",
      expiresIn: Date.now() + (60 * 60 * 1000)
    }

    const token = await sign(payload, secret)
    return c.json({ accessToken: token })
  })

  app.use("/api/admin/*", jwt({ secret, alg: 'HS256', }))

  app.get("/api/get-user-detail", (c) => c.json(siteHandler.getUserDetail()))

  app.get("/api/sites", (c) => {
    const sites = Object.values(sitesHandler).map(blogHandler => blogHandler.getSiteDetail())
    return c.json(sites)
  })

  app.get("/api/single-site/:id", (c) => {
    const { id } = c.req.param();
    const siteHandler = sitesHandler[id]

    return c.json(siteHandler.getSiteDetail())
  })

  app.get("/api/navigation-by-site-id/:siteId", (c) => {
    const { siteId } = c.req.param();
    return c.json(navigationsHandler.getNavigationBySiteId(siteId))
  })

  app.get("/api/navigation/:id", (c) => {
    const { id } = c.req.param();
    return c.json(navigationsHandler.getNavigationByNavId(id))
  })

  app.post("/api/add-navigation", async (c) => {
    console.log("THIS IS HERE \n\n");

    const { name, position, link, site } = await c.req.json();
    navigationsHandler.addNewNavigation(name, link, +position, site);
    return c.json({ status: true, message: "Done adding new Navigation" })
  })


  app.delete("/api/navigation/:id", (c) => {
    const { id } = c.req.param();
    navigationsHandler.deleteNavigationByNavId(id);
    return c.json({ message: "Deleted!" })
  })






  app.get("/logo", handleLogo)
  app.get("/meta-data/:page", handlePageMetaData)

  app.get("/get-navigation", (c) => c.json(navigationsHandler.getNavigationBySiteId(mainSiteId)))
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
