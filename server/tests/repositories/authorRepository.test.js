import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { setupTestDB, teardownTestDB, getTestDB } from "../setup.js"
import * as authorRepo from "../../src/repositories/authorRepository.js"

const sampleAuthor = {
  _id: "auth-test-001",
  name: "Test Author",
  email: "test@example.com",
  profilePic: { url: "https://example.com/avatar.png" },
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

Deno.test({
  name: "authorRepository - create and findById",
  async fn() {
    const db = await setupTestDB()
    try {
      await authorRepo.create(db, sampleAuthor)
      const found = await authorRepo.findById(db, "auth-test-001")
      assertExists(found)
      assertEquals(found.name, "Test Author")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "authorRepository - findByEmail",
  async fn() {
    const db = await setupTestDB()
    try {
      await authorRepo.create(db, sampleAuthor)
      const found = await authorRepo.findByEmail(db, "test@example.com")
      assertExists(found)
      assertEquals(found.name, "Test Author")
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "authorRepository - findAll",
  async fn() {
    const db = await setupTestDB()
    try {
      const auth2 = { ...sampleAuthor, _id: "auth-test-002", name: "Author Two", email: "two@example.com" }
      await authorRepo.create(db, sampleAuthor)
      await authorRepo.create(db, auth2)
      const all = await authorRepo.findAll(db)
      assertEquals(all.length, 2)
    } finally {
      await teardownTestDB()
    }
  },
})

Deno.test({
  name: "authorRepository - update and remove",
  async fn() {
    const db = await setupTestDB()
    try {
      await authorRepo.create(db, sampleAuthor)
      await authorRepo.update(db, "auth-test-001", { name: "Updated Author" })
      const updated = await authorRepo.findById(db, "auth-test-001")
      assertEquals(updated.name, "Updated Author")
      await authorRepo.remove(db, "auth-test-001")
      const gone = await authorRepo.findById(db, "auth-test-001")
      assertEquals(gone, null)
    } finally {
      await teardownTestDB()
    }
  },
})
