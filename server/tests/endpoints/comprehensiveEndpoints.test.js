import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB } from "../setup.js"
import { createApp } from "../../src/app.js"
import * as navRepo from "../../src/repositories/navigationRepository.js"
import * as siteRepo from "../../src/repositories/siteRepository.js"
import * as blogRepo from "../../src/repositories/blogRepository.js"
import * as categoryRepo from "../../src/repositories/categoryRepository.js"
import * as tagRepo from "../../src/repositories/tagRepository.js"
import * as authorRepo from "../../src/repositories/authorRepository.js"
import * as socialRepo from "../../src/repositories/socialMediaRepository.js"
import * as staticPageRepo from "../../src/repositories/staticPageRepository.js"

const loginAndGetToken = async (app) => {
  const res = await app.request("/api/login", {
    method: "POST",
    body: JSON.stringify({ email: "user@gmail.com", password: "12345" }),
    headers: { "content-type": "application/json" },
  })
  if (res.status === 200) {
    const body = await res.json()
    return body.accessToken
  }
  return null
}

const authedRequest = (app, path, options = {}) => {
  const token = options.token
  const headers = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    ...options.headers,
  }
  return app.request(path, { ...options, headers })
}

const seedData = async (db) => {
  await blogRepo.create(db, {
    _id: "blog-cmp-001",
    slug: "comp-post",
    title: "Comprehensive Post",
    description: "<p>Content</p>",
    category: "Tech",
    tags: "test",
    author: { authorId: "auth-cmp-001", name: "Comprehensive Tester", url: "" },
    images: { name: "", url: "" },
    metadata: { title: "Comp", keywords: "test", description: "desc" },
    featured: true,
    siteId: "site-id-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await navRepo.create(db, {
    _id: "nav-cmp-001",
    name: "Home",
    link: "/",
    position: 1,
    siteId: "site-id-1",
    createdAt: Date.now(),
  })

  await siteRepo.create(db, {
    _id: "site-cmp-001",
    name: "Test Site",
    isActive: true,
    createdAt: Date.now(),
  })

  await categoryRepo.create(db, {
    _id: "cat-cmp-001",
    categoryName: "Test Category",
    siteId: "site-id-1",
    createdAt: Date.now(),
  })

  await tagRepo.create(db, {
    _id: "tag-cmp-001",
    tagName: "test-tag",
    siteId: "site-id-1",
    createdAt: Date.now(),
  })

  await authorRepo.create(db, {
    _id: "auth-cmp-001",
    name: "Comprehensive Tester",
    email: "comp@tester.com",
    profilePic: { url: "" },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await socialRepo.create(db, {
    _id: "soc-cmp-001",
    name: "twitter",
    link: "https://twitter.com",
    siteId: "site-id-1",
    createdAt: Date.now(),
  })

  await staticPageRepo.create(db, {
    _id: "static-cmp-001",
    slug: "privacy",
    title: "Privacy Policy",
    description: "<p>Privacy content</p>",
    siteId: "site-id-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

Deno.test({
  name: "GET /meta-data/home returns home metadata",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/meta-data/home")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.metaTitle)
      assertExists(body.metaDescription)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /meta-data/blog returns blog metadata",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/meta-data/blog")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.title)
      assertExists(body.excerpt)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /meta-data/:page for static page returns metadata",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/meta-data/privacy")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.title, "Privacy Policy")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /meta-data/:page returns 404 for unknown page",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/meta-data/non-existent")
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /get-navigation returns navigation items",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/get-navigation")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
      assertEquals(body[0].name, "Home")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /get-social-media returns social media entries",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const res = await app.request("/get-social-media")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
      assertEquals(body[0].name, "twitter")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /get-social-media returns defaults when empty",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/get-social-media")
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 5)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/navigation-by-site-id/:siteId returns navigation",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/navigation-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/navigation/:id returns single navigation item",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/navigation/nav-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.name, "Home")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/navigation/:id returns 404 for missing nav",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/navigation/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "POST /api/add-navigation creates navigation",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/add-navigation", {
        method: "POST",
        body: JSON.stringify({ name: "About", position: 1, link: "/about", site: "site-id-1" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/navigation/:id updates navigation",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/navigation/nav-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ name: "Updated Home" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/navigation/:id deletes navigation",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/navigation/nav-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-site/:id returns site",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/site-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.name, "Test Site")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-site/:id returns 404 for non-existent",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/single-site/:id updates site",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/site-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ name: "Updated Site", isActive: false }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/single-site/:id updates author when body has no isActive",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/auth-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ name: "Updated Author" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/single-site/:id deletes site",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/site-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/single-site/:id deletes author when site not found",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/auth-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/single-site/:id returns 404 for non-existent",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-site/non-existent", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/pages-by-site-id/:siteId returns blogs",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/pages-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-page/:id returns blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-page/blog-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.title, "Comprehensive Post")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-page/:id returns 404 for missing blog",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-page/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/single-page/:id updates blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-page/blog-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/single-page/:id deletes blog",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-page/blog-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/categories-by-site-id/:siteId returns categories",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/categories-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/category/:id returns single category",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/category/cat-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.categoryName, "Test Category")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/category/:id returns 404 for missing category",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/category/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/category/:id updates category",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/category/cat-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ categoryName: "Updated Category" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/category/:id deletes category",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/category/cat-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/tags-by-site-id/:siteId returns tags",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/tags/:id returns single tag",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags/tag-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.tagName, "test-tag")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/tags/:id returns 404 for missing tag",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/tags/:id updates tag",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags/tag-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ tagName: "updated-tag" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/tags/:id deletes tag",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags/tag-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/get-writer/:id returns author",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/get-writer/auth-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.name, "Comprehensive Tester")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/get-writer/:id returns 404 for missing author",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/get-writer/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/social-media-by-site-id/:siteId returns social media",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/social-media-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/social-media/:id returns single social media",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/social-media/soc-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.name, "twitter")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/social-media/:id returns 404 for missing social",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/social-media/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/social-media/:id updates social media",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/social-media/soc-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ name: "github", link: "https://github.com" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/social-media/:id deletes social media",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/social-media/soc-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/static-pages-by-site-id/:siteId returns static pages",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/static-pages-by-site-id/site-id-1", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-static-page/:id returns static page",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-static-page/static-cmp-001", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.title, "Privacy Policy")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-static-page/:id returns 404 for missing static page",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-static-page/non-existent", { token })
      assertEquals(res.status, 404)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "PUT /api/single-static-page/:id updates static page",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-static-page/static-cmp-001", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Privacy" }),
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.status, true)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "DELETE /api/single-static-page/:id deletes static page",
  async fn() {
    const db = await setupTestDB()
    try {
      await seedData(db)
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/single-static-page/static-cmp-001", {
        method: "DELETE",
        token,
      })
      assertEquals(res.status, 200)
    } finally {
      await teardownTestDB()
    }
  },
})
