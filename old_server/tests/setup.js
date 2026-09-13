import { MongoClient } from "mongodb"

const TEST_DB_URI = Deno.env.get("TEST_MONGODB_URI") || "mongodb://localhost:27017/blogging-platform-test"

let testClient = null
let testDB = null

export const getTestURI = () => TEST_DB_URI

export const setupTestDB = async () => {
  testClient = new MongoClient(TEST_DB_URI)
  await testClient.connect()
  testDB = testClient.db()
  return testDB
}

export const teardownTestDB = async () => {
  if (testDB) {
    const collections = await testDB.listCollections().toArray()
    for (const col of collections) {
      await testDB.collection(col.name).drop()
    }
  }
  if (testClient) {
    await testClient.close()
    testClient = null
    testDB = null
  }
}

export const getTestDB = () => {
  if (!testDB) {
    throw new Error("Test DB not set up. Call setupTestDB() first.")
  }
  return testDB
}
