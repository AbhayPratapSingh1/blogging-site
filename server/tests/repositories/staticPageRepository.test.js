import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as staticPageRepo from "../../src/repositories/staticPageRepository.js"

const samplePage = {
  _id: "static-test-001",
  slug: "about",
  title: "About Us",
  description: "<p>Test page content</p>",
  siteId: "site-test-001",
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

Deno.test({
  name: "staticPageRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await staticPageRepo.create(db, samplePage)
      const found = await staticPageRepo.findById(db, "static-test-001")
      assertExists(found)
      assertEquals(found.title, "About Us")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "staticPageRepository - findBySlug",
  async fn() {
    const db = await setupTestDB()
    try {
      await staticPageRepo.create(db, samplePage)
      const found = await staticPageRepo.findBySlug(db, "about")
      assertExists(found)
      assertEquals(found._id, "static-test-001")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "staticPageRepository - findBySiteId",
  async fn() {
    const db = await setupTestDB()
    try {
      const other = { ...samplePage, _id: "static-test-002", slug: "privacy", siteId: "site-other" }
      await staticPageRepo.create(db, samplePage)
      await staticPageRepo.create(db, other)
      const pages = await staticPageRepo.findBySiteId(db, "site-test-001")
      assertEquals(pages.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "staticPageRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await staticPageRepo.create(db, samplePage)
      await staticPageRepo.update(db, "static-test-001", { title: "Updated Title" })
      const updated = await staticPageRepo.findById(db, "static-test-001")
      assertEquals(updated.title, "Updated Title")
      await staticPageRepo.remove(db, "static-test-001")
      const gone = await staticPageRepo.findById(db, "static-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
