import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const createSiteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
})

export const updateSiteSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
})

export const createNavigationSchema = z.object({
  name: z.string().min(1, "Navigation name is required"),
  position: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  link: z.string().min(1, "Navigation link is required"),
  site: z.string().min(1, "Site ID is required"),
})

export const updateNavigationSchema = z.object({
  name: z.string().min(1).optional(),
  position: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),
  link: z.string().min(1).optional(),
  siteId: z.string().min(1).optional(),
})

const blogAuthorSchema = z.object({
  authorId: z.string().optional(),
  name: z.string().optional(),
  url: z.string().optional(),
}).optional()

const blogImagesSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
}).optional()

const blogFaqSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
})

export const createBlogSchema = z.object({
  title: z.string().min(1, "Blog title is required"),
  description: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  author: blogAuthorSchema,
  images: blogImagesSchema,
  coverAlt: z.string().optional(),
  faqHeading: z.string().optional(),
  faqs: z.array(blogFaqSchema).optional(),
  redirectUrl: z.string().optional(),
  siteId: z.string().optional(),
})

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  author: blogAuthorSchema,
  images: blogImagesSchema,
  coverAlt: z.string().optional(),
  faqHeading: z.string().optional(),
  faqs: z.array(blogFaqSchema).optional(),
  redirectUrl: z.string().optional(),
})

export const createCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
})

export const updateCategorySchema = z.object({
  categoryName: z.string().min(1).optional(),
})

export const createTagSchema = z.object({
  tagName: z.string().min(1, "Tag name is required"),
})

export const updateTagSchema = z.object({
  tagName: z.string().min(1).optional(),
})

export const registerAuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  email: z.string().email("Invalid email format"),
})

export const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  profilePic: z.object({ url: z.string() }).optional(),
})

export const createSocialSchema = z.object({
  name: z.string().min(1, "Social media name is required"),
  link: z.string().min(1, "Social media link is required"),
})

export const updateSocialSchema = z.object({
  name: z.string().min(1).optional(),
  link: z.string().min(1).optional(),
})

export const createStaticPageSchema = z.object({
  title: z.string().min(1, "Static page title is required"),
  slug: z.string().min(1, "Static page slug is required"),
  description: z.string().min(1, "Static page description is required"),
})

export const updateStaticPageSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
})

export const validate = (schema, data) => {
  const result = schema.safeParse(data)
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ")
    return { valid: false, message }
  }
  return { valid: true, data: result.data }
}
