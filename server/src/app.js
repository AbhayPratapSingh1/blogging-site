import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"
import { blogs, featuredBlog, pageMetaData, authors } from "./static.js";


const SOCIAL_MEDIA = [
  { name: "facebook", link: "/" },
  { name: "whatsapp", link: "/ws" },
  { name: "linkedin", link: "/in" },
  { name: "twitter", link: "/tw" },
  { name: "instagram", link: "/ig" },
]

const navigations = [{ link: "/", name: "Home" }, { link: "/", name: "About" },]

export const createApp = () => {
  const app = new Hono()

  app.use(logger())
  app.get("/logo", (c) => c.json({ url: "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" }))

  app.get("/get-navigation", (c) => c.json(navigations))
  app.get("/get-social-media", (c) => c.json(SOCIAL_MEDIA))

  app.get("/meta-data/home", (c) => c.json(pageMetaData.home))

  app.get("/single-fetaured", (c) => c.json(featuredBlog))

  app.get("/all-writers", (c) => c.json(authors))
  app.get("/categories", (c) => {
    const categories = [];
    for (const blog of blogs) {
      if (!(categories.includes(blog.category))) {
        categories.push({ categoryName: blog.category })
      }
    }
    console.log({ categories });

    return c.json(categories)
  })
  app.get("/blogs", (c) => c.json(blogs))

  app.get("/get-blogs-by-author-id/:id", (c) => {
    const { id } = c.req.param()
    const posts = blogs.filter(({ author }) => author.authorId === id)
    return c.json(posts)
  })

  app.get("*", serveStatic({ root: "./public" }))

  return app;
}