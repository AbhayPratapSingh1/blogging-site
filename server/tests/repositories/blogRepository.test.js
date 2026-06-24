import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as blogRepo from "../../src/repositories/blogRepository.js"

const sampleBlog = {
  _id: "blog-test-001",
  slug: "test-blog-post",
  title: "Test Blog Post",
  description: "<p>Test content</p>",
  category: "Testing",
  tags: "test, jest, deno",
  author: { authorId: "auth-test-001", name: "Test Author", url: "https://example.com/avatar.png" },
  images: { name: "Test Image", url: "https://example.com/image.png" },
  metadata: { title: "Test Blog", keywords: "test", description: "A test blog" },
  featured: true,
  siteId: "site-test-001",
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

Deno.test({
  name: "blogRepository - findAll returns empty array when no blogs",
  async fn() {
    const db = await setupTestDB()
    try {
      const blogs = await blogRepo.findAll(db)
      assertEquals(blogs.length, 0)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      const found = await blogRepo.findById(db, "blog-test-001")
      assertExists(found)
      assertEquals(found.title, "Test Blog Post")
      assertEquals(found.slug, "test-blog-post")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - findBySlug returns correct blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      const found = await blogRepo.findBySlug(db, "test-blog-post")
      assertExists(found)
      assertEquals(found._id, "blog-test-001")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - findFeatured returns featured blog",
  async fn() {
    const db = await setupTestDB()
    try {
      const nonFeatured = { ...sampleBlog, _id: "blog-test-002", featured: false }
      await blogRepo.create(db, nonFeatured)
      await blogRepo.create(db, sampleBlog)
      const featured = await blogRepo.findFeatured(db)
      assertExists(featured)
      assertEquals(featured._id, "blog-test-001")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - findByAuthorId returns all blogs by author",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      const blog1 = { ...sampleBlog, _id: "blog-test-002", slug: "blog-2" }
      const blog2 = {
        ...sampleBlog,
        _id: "blog-test-003",
        slug: "blog-3",
        author: { authorId: "auth-test-002", name: "Other Author", url: "" },
      }
      await blogRepo.create(db, blog1)
      await blogRepo.create(db, blog2)
      const byAuth1 = await blogRepo.findByAuthorId(db, "auth-test-001")
      const byAuth2 = await blogRepo.findByAuthorId(db, "auth-test-002")
      assertEquals(byAuth1.length, 2)
      assertEquals(byAuth2.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - findByCategory uses case-insensitive match",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      const upper = await blogRepo.findByCategory(db, "TESTING")
      const lower = await blogRepo.findByCategory(db, "testing")
      assertEquals(upper.length, 1)
      assertEquals(lower.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - findBySiteId returns blogs for site",
  async fn() {
    const db = await setupTestDB()
    try {
      const blogOther = { ...sampleBlog, _id: "blog-test-004", slug: "other-site", siteId: "site-other" }
      await blogRepo.create(db, sampleBlog)
      await blogRepo.create(db, blogOther)
      const site1 = await blogRepo.findBySiteId(db, "site-test-001")
      const site2 = await blogRepo.findBySiteId(db, "site-other")
      assertEquals(site1.length, 1)
      assertEquals(site2.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - update modifies blog fields",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      await blogRepo.update(db, "blog-test-001", { title: "Updated Title" })
      const updated = await blogRepo.findById(db, "blog-test-001")
      assertEquals(updated.title, "Updated Title")
      assertExists(updated.updatedAt)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "blogRepository - remove deletes blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await blogRepo.create(db, sampleBlog)
      await blogRepo.remove(db, "blog-test-001")
      const found = await blogRepo.findById(db, "blog-test-001")
      assertEquals(found, null)
    } finally {
      await teardownTestDB()
    }
  },
})
