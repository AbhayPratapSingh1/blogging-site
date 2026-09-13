import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as tagRepo from "../../src/repositories/tagRepository.js"

const sampleTag = {
  _id: "tag-test-001",
  tagName: "deno",
  siteId: "site-test-001",
  createdAt: Date.now(),
}

Deno.test({
  name: "tagRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await tagRepo.create(db, sampleTag)
      const found = await tagRepo.findById(db, "tag-test-001")
      assertExists(found)
      assertEquals(found.tagName, "deno")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "tagRepository - findBySiteId",
  async fn() {
    const db = await setupTestDB()
    try {
      const other = { ...sampleTag, _id: "tag-test-002", tagName: "test", siteId: "site-other" }
      await tagRepo.create(db, sampleTag)
      await tagRepo.create(db, other)
      const siteTags = await tagRepo.findBySiteId(db, "site-test-001")
      assertEquals(siteTags.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "tagRepository - remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await tagRepo.create(db, sampleTag)
      await tagRepo.remove(db, "tag-test-001")
      const gone = await tagRepo.findById(db, "tag-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
