import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as navRepo from "../../src/repositories/navigationRepository.js"

const sampleNav = {
  _id: "nav-test-001",
  name: "Home",
  link: "/",
  position: 1,
  siteId: "site-test-001",
  createdAt: Date.now(),
}

Deno.test({
  name: "navigationRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await navRepo.create(db, sampleNav)
      const found = await navRepo.findById(db, "nav-test-001")
      assertExists(found)
      assertEquals(found.name, "Home")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "navigationRepository - findBySiteId returns sorted by position",
  async fn() {
    const db = await setupTestDB()
    try {
      const nav2 = { ...sampleNav, _id: "nav-test-002", name: "About", link: "/about", position: 3 }
      const nav3 = { ...sampleNav, _id: "nav-test-003", name: "Contact", link: "/contact", position: 2 }
      await navRepo.create(db, nav2)
      await navRepo.create(db, nav3)
      await navRepo.create(db, sampleNav)
      const navs = await navRepo.findBySiteId(db, "site-test-001")
      assertEquals(navs.length, 3)
      assertEquals(navs[0].position, 1)
      assertEquals(navs[1].position, 2)
      assertEquals(navs[2].position, 3)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "navigationRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await navRepo.create(db, sampleNav)
      await navRepo.update(db, "nav-test-001", { name: "Updated" })
      const updated = await navRepo.findById(db, "nav-test-001")
      assertEquals(updated.name, "Updated")
      await navRepo.remove(db, "nav-test-001")
      const gone = await navRepo.findById(db, "nav-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
