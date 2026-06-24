import * as blogRepo from "../repositories/blogRepository.js"
import * as categoryRepo from "../repositories/categoryRepository.js"
import * as authorRepo from "../repositories/authorRepository.js"
import * as navRepo from "../repositories/navigationRepository.js"
import * as socialRepo from "../repositories/socialMediaRepository.js"
import * as staticPageRepo from "../repositories/staticPageRepository.js"

export const handleLogo = (db) => (c) =>
  c.json({ url: "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" })

export const handlePageMetaData = (db) => async (c) => {
  const { page } = c.req.param()
  const blogs = await blogRepo.findAll(db)
  const categories = await categoryRepo.findAll(db)
  const authorsList = await authorRepo.findAll(db)

  const metaMap = {
    home: {
      metaTitle: "Gotta Catch 'Em All | Ultimate Pokémon Strategy & News",
      metaKeywords: "Pokémon, Pokedex, Gaming News, Nintendo Switch, Strategy Guide",
      metaDescription: "Your premier destination for the latest Pokémon battle strategies, regional guides, and breaking news from the world of Nintendo gaming.",
    },
    blog: {
      title: "The Trainer's Journal | Latest Articles & Tips",
      excerpt: "Deep dives into game mechanics, hidden secrets, and community stories from across the Pokémon universe.",
      publishedAt: new Date().toISOString(),
      coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    },
  }

  if (page === "home" || page === "blog") {
    return c.json(metaMap[page])
  }

  const staticPage = await staticPageRepo.findBySlug(db, page)
  if (staticPage) {
    return c.json({
      title: staticPage.title,
      excerpt: staticPage.description.replace(/<[^>]*>/g, "").slice(0, 160),
      publishedAt: staticPage.createdAt || new Date().toISOString(),
      coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    })
  }

  return c.body("Not Found", 404)
}

export const handleNav = (db) => async (c) => {
  const navs = await navRepo.findBySiteId(db, "site-id-1")
  return c.json(navs)
}

export const handleSocialMedia = (db) => async (c) => {
  const social = await socialRepo.findAll(db)
  if (social.length > 0) {
    return c.json(social)
  }
  return c.json([
    { name: "facebook", link: "/" },
    { name: "whatsapp", link: "/ws" },
    { name: "linkedin", link: "/in" },
    { name: "twitter", link: "/tw" },
    { name: "instagram", link: "/ig" },
  ])
}

export const handleAllBlogs = (db) => async (c) => {
  const blogs = await blogRepo.findAll(db)
  return c.json(blogs)
}

export const handleFeatured = (db) => async (c) => {
  const featured = await blogRepo.findFeatured(db)
  if (featured) {
    return c.json(featured)
  }
  const blogs = await blogRepo.findAll(db)
  return c.json(blogs[0] || null)
}

export const handleBlogByAuthorId = (db) => async (c) => {
  const { id } = c.req.param()
  const posts = await blogRepo.findByAuthorId(db, id)
  return c.json(posts)
}

export const handleBlogByCategory = (db) => async (c) => {
  const { category } = c.req.param()
  const posts = await blogRepo.findByCategory(db, category)
  return c.json(posts)
}

export const handleCategories = (db) => async (c) => {
  const blogs = await blogRepo.findAll(db)
  const seen = new Set()
  const categories = []
  for (const blog of blogs) {
    if (!seen.has(blog.category)) {
      seen.add(blog.category)
      categories.push({ categoryName: blog.category })
    }
  }
  return c.json(categories)
}

export const handleWriters = (db) => async (c) => {
  const authorsList = await authorRepo.findAll(db)
  return c.json(authorsList)
}

export const handleStaticPage = (db) => async (c) => {
  const { slug } = c.req.param()
  const page = await staticPageRepo.findBySlug(db, slug)
  if (page) {
    return c.json(page)
  }
  return c.body("Not Found", 404)
}

export const handlePageBySlug = (db) => async (c) => {
  const { slug } = c.req.param()
  const blog = await blogRepo.findBySlug(db, slug)
  if (blog) {
    return c.json(blog)
  }
  return c.body("Not Found", 404)
}
