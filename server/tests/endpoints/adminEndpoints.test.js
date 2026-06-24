import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import { createApp } from "../../src/app.js"
import * as siteRepo from "../../src/repositories/siteRepository.js"
import * as blogRepo from "../../src/repositories/blogRepository.js"
import * as categoryRepo from "../../src/repositories/categoryRepository.js"
import * as tagRepo from "../../src/repositories/tagRepository.js"
import * as authorRepo from "../../src/repositories/authorRepository.js"
import * as navRepo from "../../src/repositories/navigationRepository.js"
import * as socialRepo from "../../src/repositories/socialMediaRepository.js"

const JWT_TOKEN = "test-jwt-token"

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
  const token = options.token || JWT_TOKEN
  const headers = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    ...options.headers,
  }
  return app.request(path, { ...options, headers })
}

Deno.test({
  name: "POST /api/login with valid credentials returns token",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: "user@gmail.com", password: "12345" }),
        headers: { "content-type": "application/json" },
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.accessToken)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "POST /api/login with invalid credentials returns 400",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const res = await app.request("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: "wrong@email.com", password: "wrong" }),
        headers: { "content-type": "application/json" },
      })
      assertEquals(res.status, 400)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/sites returns empty array initially",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/sites", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertEquals(body.length, 0)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "POST /api/sites creates a new site",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/sites", {
        method: "POST",
        body: JSON.stringify({ name: "New Site" }),
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
  name: "GET /api/get-user-detail returns user info",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/get-user-detail", { token })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.name)
      assertExists(body.profilePic)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "GET /api/single-site/:id returns 404 for missing site",
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
  name: "POST /api/add-new-page creates a blog post",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/add-new-page", {
        method: "POST",
        body: JSON.stringify({ title: "New Blog", slug: "new-blog", category: "Tech" }),
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
  name: "POST /api/category creates a new category",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/category", {
        method: "POST",
        body: JSON.stringify({ categoryName: "New Cat", siteId: "site-1" }),
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
  name: "POST /api/tags creates a new tag",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/tags", {
        method: "POST",
        body: JSON.stringify({ tagName: "deno", siteId: "site-1" }),
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
  name: "POST /api/add-social-media creates social media entry",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/add-social-media", {
        method: "POST",
        body: JSON.stringify({ name: "github", link: "https://github.com", siteId: "site-1" }),
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
  name: "POST /api/add-new-static-page creates static page",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/add-new-static-page", {
        method: "POST",
        body: JSON.stringify({ title: "New Page", slug: "new-page", description: "<p>Content</p>", siteId: "site-1" }),
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
  name: "POST /api/admin/register creates a new author",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/admin/register", {
        method: "POST",
        body: JSON.stringify({ name: "New Author", email: "new@author.com" }),
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
  name: "POST /api/upload-single-image returns a URL",
  async fn() {
    const db = await setupTestDB()
    try {
      const app = createApp(db)
      const token = await loginAndGetToken(app)
      const res = await authedRequest(app, "/api/upload-single-image", {
        method: "POST",
        token,
      })
      assertEquals(res.status, 200)
      const body = await res.json()
      assertExists(body.url)
    } finally {
      await teardownTestDB()
    }
  },
})
