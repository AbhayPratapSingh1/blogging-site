import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import { createApp } from "../../src/app.js"
import * as blogRepo from "../../src/repositories/blogRepository.js"
import * as authorRepo from "../../src/repositories/authorRepository.js"
import * as navRepo from "../../src/repositories/navigationRepository.js"
import * as staticPageRepo from "../../src/repositories/staticPageRepository.js"

const seedData = async (db) => {
  await blogRepo.create(db, {
    _id: "blog-pub-001",
    slug: "test-post",
    title: "Test Post",
    description: "<p>Hello</p>",
    category: "Tech",
    tags: "test",
    author: { authorId: "auth-pub-001", name: "Tester", url: "" },
    images: { name: "", url: "" },
    metadata: { title: "Test", keywords: "test", description: "desc" },
    featured: true,
    siteId: "site-id-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await blogRepo.create(db, {
    _id: "blog-pub-002",
    slug: "other-post",
    title: "Other Post",
    description: "<p>World</p>",
    category: "Science",
    tags: "science",
    author: { authorId: "auth-pub-001", name: "Tester", url: "" },
    images: { name: "", url: "" },
    metadata: { title: "Other", keywords: "other", description: "desc" },
    featured: false,
    siteId: "site-id-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await authorRepo.create(db, {
    _id: "auth-pub-001",
    name: "Tester",
    email: "tester@test.com",
    profilePic: { url: "" },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await navRepo.create(db, {
    _id: "nav-pub-001",
    name: "About",
    link: "/about",
    position: 1,
    siteId: "site-id-1",
    createdAt: Date.now(),
  })

  await staticPageRepo.create(db, {
    _id: "static-pub-001",
    slug: "about",
    title: "About Us",
    description: "<p>About page</p>",
    siteId: "site-id-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

Deno.test({
  name: "GET /logo returns logo URL",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/logo")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.url)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /blogs returns all blogs",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/blogs")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /single-fetaured returns featured blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/single-fetaured")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.slug, "test-post")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /page-by-slug/:slug returns blog by slug",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/page-by-slug/test-post")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.title, "Test Post")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /page-by-slug/:slug returns 404 for missing slug",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/page-by-slug/non-existent")
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /get-blogs-by-author-id/:id returns blogs by author",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/get-blogs-by-author-id/auth-pub-001")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /blogs-by-category/:category filters case-insensitive",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/blogs-by-category/tech")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
      assertEquals(body[0].slug, "test-post")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /categories returns unique categories",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/categories")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /all-writers returns all authors",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/all-writers")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /static-page/:slug returns static page",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/static-page/about")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.title, "About Us")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /static-page/:slug returns 404 for missing page",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/static-page/non-existent")
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})
