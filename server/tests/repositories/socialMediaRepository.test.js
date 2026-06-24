import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as socialRepo from "../../src/repositories/socialMediaRepository.js"

const sampleSocial = {
  _id: "soc-test-001",
  name: "twitter",
  link: "https://twitter.com/test",
  siteId: "site-test-001",
  createdAt: Date.now(),
}

Deno.test({
  name: "socialMediaRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await socialRepo.create(db, sampleSocial)
      const found = await socialRepo.findById(db, "soc-test-001")
      assertExists(found)
      assertEquals(found.name, "twitter")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "socialMediaRepository - findBySiteId",
  async fn() {
    const db = await setupTestDB()
    try {
      const other = { ...sampleSocial, _id: "soc-test-002", name: "github", siteId: "site-other" }
      await socialRepo.create(db, sampleSocial)
      await socialRepo.create(db, other)
      const siteSocial = await socialRepo.findBySiteId(db, "site-test-001")
      assertEquals(siteSocial.length, 1)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "socialMediaRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await socialRepo.create(db, sampleSocial)
      await socialRepo.update(db, "soc-test-001", { link: "https://updated.com" })
      const updated = await socialRepo.findById(db, "soc-test-001")
      assertEquals(updated.link, "https://updated.com")
      await socialRepo.remove(db, "soc-test-001")
      const gone = await socialRepo.findById(db, "soc-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
