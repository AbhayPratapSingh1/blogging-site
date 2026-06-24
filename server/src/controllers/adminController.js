import { sign } from "hono/jwt"
import { getConfig } from "../config.js"
import {
  loginSchema, createSiteSchema, updateSiteSchema,
  createNavigationSchema, updateNavigationSchema,
  createBlogSchema, updateBlogSchema,
  createCategorySchema, updateCategorySchema,
  createTagSchema, updateTagSchema,
  registerAuthorSchema,
  createSocialSchema, updateSocialSchema,
  createStaticPageSchema, updateStaticPageSchema,
  validate,
} from "../validation.js"
import { uploadImage as cloudinaryUpload } from "../cloudinary.js"
import * as blogRepo from "../repositories/blogRepository.js"
import * as categoryRepo from "../repositories/categoryRepository.js"
import * as tagRepo from "../repositories/tagRepository.js"
import * as authorRepo from "../repositories/authorRepository.js"
import * as navRepo from "../repositories/navigationRepository.js"
import * as socialRepo from "../repositories/socialMediaRepository.js"
import * as staticPageRepo from "../repositories/staticPageRepository.js"
import * as siteRepo from "../repositories/siteRepository.js"

const { JWT_SECRET } = getConfig()

export const handleLogin = (db) => async (c) => {
  const { AUTH_EMAIL, AUTH_PASSWORD } = getConfig()
  const body = await c.req.json()
  const v = validate(loginSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const { email, password } = v.data
  if (email !== AUTH_EMAIL || password !== AUTH_PASSWORD) {
    return c.json({ error: "Invalid email or password" }, 400)
  }

  const payload = {
    sub: email,
    iss: "Me",
    exp: Math.floor(Date.now() / 1000) + 3600,
  }
  const token = await sign(payload, JWT_SECRET)
  return c.json({ accessToken: token })
}

export const handleGetUserDetail = (db) => (c) =>
  c.json({
    profilePic: { url: "https://www.w3schools.com/howto/img_avatar.png" },
    name: "Rajesh",
  })

export const handleSites = (db) => async (c) => {
  const sites = await siteRepo.findAll(db)
  return c.json(sites)
}

export const handleCreateSite = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createSiteSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await siteRepo.create(db, { ...v.data, isActive: true, createdAt: Date.now() })
  return c.json({ status: true, message: "Site created", id: result.insertedId })
}

export const handleSingleSite = (db) => async (c) => {
  const { id } = c.req.param()
  const site = await siteRepo.findById(db, id)
  if (!site) return c.json({ error: "Not Found" }, 404)
  return c.json(site)
}

export const handleUpdateSite = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateSiteSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await siteRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteSite = (db) => async (c) => {
  const { id } = c.req.param()
  await siteRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleGetUserDetailBySiteId = (db) => async (c) => {
  const { id } = c.req.param()
  const site = await siteRepo.findById(db, id)
  if (site) return c.json(site)
  const author = await authorRepo.findById(db, id)
  if (author) return c.json(author)
  return c.json({ error: "Not Found" }, 404)
}

export const handleUpdateBySiteId = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  if (Object.keys(body).length === 0) {
    return c.json({ error: "Request body is empty" }, 400)
  }

  if (body.name !== undefined && body.isActive === undefined) {
    await authorRepo.update(db, id, body)
  } else {
    await siteRepo.update(db, id, body)
  }
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteBySiteId = (db) => async (c) => {
  const { id } = c.req.param()
  const site = await siteRepo.findById(db, id)
  if (site) {
    await siteRepo.remove(db, id)
    return c.json({ message: "Deleted!" })
  }
  const author = await authorRepo.findById(db, id)
  if (author) {
    await authorRepo.remove(db, id)
    return c.json({ message: "Deleted!" })
  }
  return c.json({ error: "Not Found" }, 404)
}

export const handleBlogsBySiteId = (db) => async (c) => {
  const { siteId } = c.req.param()
  const blogs = await blogRepo.findBySiteId(db, siteId)
  return c.json(blogs)
}

export const handleCreateBlog = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createBlogSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const blog = { ...v.data, siteId: body.siteId || "site-id-1", createdAt: Date.now(), updatedAt: Date.now() }
  const result = await blogRepo.create(db, blog)
  return c.json({ status: true, message: "Blog created", id: result.insertedId })
}

export const handleSingleBlog = (db) => async (c) => {
  const { id } = c.req.param()
  const blog = await blogRepo.findById(db, id)
  if (!blog) return c.json({ error: "Not Found" }, 404)
  return c.json(blog)
}

export const handleUpdateBlog = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateBlogSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await blogRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteBlog = (db) => async (c) => {
  const { id } = c.req.param()
  await blogRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleCategoriesBySiteId = (db) => async (c) => {
  const { siteId } = c.req.param()
  const categories = await categoryRepo.findBySiteId(db, siteId)
  return c.json(categories)
}

export const handleCreateCategory = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createCategorySchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await categoryRepo.create(db, { ...v.data, createdAt: Date.now() })
  return c.json({ status: true, message: "Category created", id: result.insertedId })
}

export const handleSingleCategory = (db) => async (c) => {
  const { id } = c.req.param()
  const category = await categoryRepo.findById(db, id)
  if (!category) return c.json({ error: "Not Found" }, 404)
  return c.json(category)
}

export const handleUpdateCategory = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateCategorySchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await categoryRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteCategory = (db) => async (c) => {
  const { id } = c.req.param()
  await categoryRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleTagsBySiteId = (db) => async (c) => {
  const { siteId } = c.req.param()
  const tags = await tagRepo.findBySiteId(db, siteId)
  return c.json(tags)
}

export const handleCreateTag = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createTagSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await tagRepo.create(db, { ...v.data, createdAt: Date.now() })
  return c.json({ status: true, message: "Tag created", id: result.insertedId })
}

export const handleSingleTag = (db) => async (c) => {
  const { id } = c.req.param()
  const tag = await tagRepo.findById(db, id)
  if (!tag) return c.json({ error: "Not Found" }, 404)
  return c.json(tag)
}

export const handleUpdateTag = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateTagSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await tagRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteTag = (db) => async (c) => {
  const { id } = c.req.param()
  await tagRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleRegisterAuthor = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(registerAuthorSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await authorRepo.create(db, { ...v.data, createdAt: Date.now(), updatedAt: Date.now() })
  return c.json({ status: true, message: "Author registered", id: result.insertedId })
}

export const handleSingleWriter = (db) => async (c) => {
  const { id } = c.req.param()
  const author = await authorRepo.findById(db, id)
  if (!author) return c.json({ error: "Not Found" }, 404)
  return c.json(author)
}

export const handleSocialBySiteId = (db) => async (c) => {
  const { siteId } = c.req.param()
  const social = await socialRepo.findBySiteId(db, siteId)
  return c.json(social)
}

export const handleCreateSocial = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createSocialSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await socialRepo.create(db, { ...v.data, createdAt: Date.now() })
  return c.json({ status: true, message: "Social media created", id: result.insertedId })
}

export const handleSingleSocial = (db) => async (c) => {
  const { id } = c.req.param()
  const social = await socialRepo.findById(db, id)
  if (!social) return c.json({ error: "Not Found" }, 404)
  return c.json(social)
}

export const handleUpdateSocial = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateSocialSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await socialRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteSocial = (db) => async (c) => {
  const { id } = c.req.param()
  await socialRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleStaticPagesBySiteId = (db) => async (c) => {
  const { siteId } = c.req.param()
  const pages = await staticPageRepo.findBySiteId(db, siteId)
  return c.json(pages)
}

export const handleCreateStaticPage = (db) => async (c) => {
  const body = await c.req.json()
  const v = validate(createStaticPageSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  const result = await staticPageRepo.create(db, { ...v.data, createdAt: Date.now(), updatedAt: Date.now() })
  return c.json({ status: true, message: "Static page created", id: result.insertedId })
}

export const handleSingleStaticPage = (db) => async (c) => {
  const { id } = c.req.param()
  const page = await staticPageRepo.findById(db, id)
  if (!page) return c.json({ error: "Not Found" }, 404)
  return c.json(page)
}

export const handleUpdateStaticPage = (db) => async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const v = validate(updateStaticPageSchema, body)
  if (!v.valid) return c.json({ error: v.message }, 400)

  await staticPageRepo.update(db, id, v.data)
  return c.json({ status: true, message: "Updated" })
}

export const handleDeleteStaticPage = (db) => async (c) => {
  const { id } = c.req.param()
  await staticPageRepo.remove(db, id)
  return c.json({ message: "Deleted!" })
}

export const handleUploadImage = (db) => async (c) => {
  try {
    const contentType = c.req.header("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await c.req.parseBody()
      const file = formData.file || formData.image
      if (file instanceof File) {
        const buf = await file.arrayBuffer()
        const result = await cloudinaryUpload(new Uint8Array(buf), file.name)
        return c.json(result)
      }
    }

    const body = await c.req.json().catch(() => ({}))
    if (body.file) {
      const base64Data = body.file.replace(/^data:image\/\w+;base64,/, "")
      const buf = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))
      const result = await cloudinaryUpload(buf, "upload.png")
      return c.json(result)
    }

    const result = await cloudinaryUpload(new Uint8Array(0), "upload.jpg")
    return c.json(result)
  } catch (err) {
    console.error("Image upload error:", err.message)
    return c.json({ error: "Upload failed" }, 500)
  }
}
