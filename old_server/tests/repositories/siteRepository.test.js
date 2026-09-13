import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as siteRepo from "../../src/repositories/siteRepository.js"

const sampleSite = {
  _id: "site-test-001",
  name: "Test Site",
  isActive: true,
  createdAt: Date.now(),
}

Deno.test({
  name: "siteRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await siteRepo.create(db, sampleSite)
      const found = await siteRepo.findById(db, "site-test-001")
      assertExists(found)
      assertEquals(found.name, "Test Site")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "siteRepository - findAll returns all sites",
  async fn() {
    const db = await setupTestDB()
    try {
      const site2 = { ...sampleSite, _id: "site-test-002", name: "Site Two" }
      await siteRepo.create(db, sampleSite)
      await siteRepo.create(db, site2)
      const all = await siteRepo.findAll(db)
      assertEquals(all.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "siteRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await siteRepo.create(db, sampleSite)
      await siteRepo.update(db, "site-test-001", { name: "Updated Site" })
      const updated = await siteRepo.findById(db, "site-test-001")
      assertEquals(updated.name, "Updated Site")
      await siteRepo.remove(db, "site-test-001")
      const gone = await siteRepo.findById(db, "site-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
