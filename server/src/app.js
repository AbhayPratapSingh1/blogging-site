import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"
import { blogsDetails, featuredBlog, pageMetaData, authors, staticPageLinks, staticPages, blogs } from "./static.js";


const SOCIAL_MEDIA = [
  { name: "facebook", link: "/" },
  { name: "whatsapp", link: "/ws" },
  { name: "linkedin", link: "/in" },
  { name: "twitter", link: "/tw" },
  { name: "instagram", link: "/ig" },
]


export const createApp = () => {
  const app = new Hono()

  app.use(logger())
  app.get("/logo", (c) => c.json({ url: "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" }))

  app.get("/get-navigation", (c) => c.json(staticPageLinks))
  app.get("/static-page/:slug", (c) => {
    const { slug } = c.req.param();

    if (slug in staticPages) {
      return c.json(staticPages[slug])
    }

    return c.body("Not Found", 404);
  })
  app.get("/get-social-media", (c) => c.json(SOCIAL_MEDIA))

  app.get("/meta-data/:page", (c) => {
    const { page } = c.req.param();
    if (page in pageMetaData) {
      return c.json(pageMetaData[page])
    }
    return c.body("Not Fount", 404);
  })

  app.get("/single-fetaured", (c) => c.json(featuredBlog))

  app.get("/all-writers", (c) => c.json(authors))
  app.get("/categories", (c) => {
    const categories = [];
    for (const blog of blogsDetails) {
      if (!(categories.includes(blog.category))) {
        categories.push({ categoryName: blog.category })
      }
    }
    return c.json(categories)
  })
  app.get("/blogs", (c) => c.json(blogsDetails))

  app.get("/get-blogs-by-author-id/:id", (c) => {
    const { id } = c.req.param()
    const posts = blogsDetails.filter(({ author }) => author.authorId === id)
    return c.json(posts)
  })


  app.get("/blogs-by-category/:category", (c) => {
    const { category } = c.req.param()
    const selectedBlogs = blogsDetails.filter(({ category: cat }) => cat.toLowerCase() === category.toLowerCase());
    return c.json(selectedBlogs)
  })

  app.get("/page-by-slug/:slug", (c) => {
    const { slug } = c.req.param()

    if (slug in blogs) {
      return c.json(blogs[slug]);
    }
    return c.body("Not Found", 403);
  })
  app.get("*", serveStatic({ root: "./public" }))

  return app;
}