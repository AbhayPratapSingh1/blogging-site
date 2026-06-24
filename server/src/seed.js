import { connectDB, disconnectDB } from "./db.js"
import {
  authors as seedAuthors,
  featuredBlog,
  blogs,
  blogsDetails,
  staticPages,
} from "./seedData.js"

const seed = async () => {
  const { db, client } = await connectDB()
  console.log("Connected to MongoDB. Seeding...")

  const collections = [
    "blogs",
    "authors",
    "categories",
    "tags",
    "navigation",
    "socialMedia",
    "staticPages",
    "sites",
  ]

  for (const name of collections) {
    try {
      await db.collection(name).drop()
    } catch {
      // collection may not exist
    }
  }

  await db.collection("authors").insertMany(seedAuthors)
  console.log(`  authors: ${seedAuthors.length}`)

  const fullBlogs = Object.values(blogs).map((blog) => ({
    ...blog,
    featured: blog._id === featuredBlog._id,
    siteId: "site-id-1",
  }))
  await db.collection("blogs").insertMany(fullBlogs)
  console.log(`  blogs: ${fullBlogs.length}`)

  const categorySet = new Set(blogsDetails.map((b) => b.category))
  const categories = Array.from(categorySet).map((name, i) => ({
    _id: `cat-${String(i + 1).padStart(3, "0")}`,
    categoryName: name,
    siteId: "site-id-1",
    createdAt: Date.now(),
  }))
  await db.collection("categories").insertMany(categories)
  console.log(`  categories: ${categories.length}`)

  const tagSet = new Set()
  for (const blog of blogsDetails) {
    for (const tag of blog.tags.split(",").map((t) => t.trim())) {
      tagSet.add(tag)
    }
  }
  const tags = Array.from(tagSet).map((name, i) => ({
    _id: `tag-${String(i + 1).padStart(3, "0")}`,
    tagName: name,
    siteId: "site-id-1",
    createdAt: Date.now(),
  }))
  await db.collection("tags").insertMany(tags)
  console.log(`  tags: ${tags.length}`)

  const navigations = [
    { _id: "nav-001", name: "About", link: "/about", position: 1, siteId: "site-id-1", createdAt: Date.now() },
    { _id: "nav-002", name: "Privacy Policy", link: "/privacy", position: 2, siteId: "site-id-1", createdAt: Date.now() },
    { _id: "nav-003", name: "Contact Us", link: "/contact-us", position: 3, siteId: "site-id-1", createdAt: Date.now() },
  ]
  await db.collection("navigation").insertMany(navigations)
  console.log(`  navigation: ${navigations.length}`)

  const socialMedia = [
    { _id: "soc-001", name: "facebook", link: "/", siteId: "site-id-1", createdAt: Date.now() },
    { _id: "soc-002", name: "whatsapp", link: "/ws", siteId: "site-id-1", createdAt: Date.now() },
    { _id: "soc-003", name: "linkedin", link: "/in", siteId: "site-id-1", createdAt: Date.now() },
    { _id: "soc-004", name: "twitter", link: "/tw", siteId: "site-id-1", createdAt: Date.now() },
    { _id: "soc-005", name: "instagram", link: "/ig", siteId: "site-id-1", createdAt: Date.now() },
  ]
  await db.collection("socialMedia").insertMany(socialMedia)
  console.log(`  socialMedia: ${socialMedia.length}`)

  const staticPageDocs = Object.entries(staticPages).map(([slug, page]) => ({
    ...page,
    _id: `static-${slug}`,
    slug,
    siteId: "site-id-1",
    createdAt: Date.now(),
  }))
  await db.collection("staticPages").insertMany(staticPageDocs)
  console.log(`  staticPages: ${staticPageDocs.length}`)

  const site = {
    _id: "site-id-1",
    name: "My Site",
    isActive: true,
    createdAt: Date.now(),
  }
  await db.collection("sites").insertOne(site)
  console.log(`  sites: 1`)

  console.log("Seeding complete.")
  await disconnectDB()
}

seed()
