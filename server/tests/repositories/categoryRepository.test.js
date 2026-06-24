import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as categoryRepo from "../../src/repositories/categoryRepository.js"

const sampleCategory = {
  _id: "cat-test-001",
  categoryName: "Testing",
  siteId: "site-test-001",
  createdAt: Date.now(),
}

Deno.test({
  name: "categoryRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await categoryRepo.create(db, sampleCategory)
      const found = await categoryRepo.findById(db, "cat-test-001")
      assertExists(found)
      assertEquals(found.categoryName, "Testing")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "categoryRepository - findAll returns all categories",
  async fn() {
    const db = await setupTestDB()
    try {
      const cat2 = { ...sampleCategory, _id: "cat-test-002", categoryName: "Development" }
      await categoryRepo.create(db, sampleCategory)
      await categoryRepo.create(db, cat2)
      const all = await categoryRepo.findAll(db)
      assertEquals(all.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "categoryRepository - findBySiteId filters by site",
  async fn() {
    const db = await setupTestDB()
    try {
      const other = { ...sampleCategory, _id: "cat-test-003", categoryName: "Other", siteId: "site-other" }
      await categoryRepo.create(db, sampleCategory)
      await categoryRepo.create(db, other)
      const siteCats = await categoryRepo.findBySiteId(db, "site-test-001")
      assertEquals(siteCats.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "categoryRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await categoryRepo.create(db, sampleCategory)
      await categoryRepo.update(db, "cat-test-001", { categoryName: "Updated" })
      const updated = await categoryRepo.findById(db, "cat-test-001")
      assertEquals(updated.categoryName, "Updated")
      await categoryRepo.remove(db, "cat-test-001")
      const gone = await categoryRepo.findById(db, "cat-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
