import { MongoClient } from "mongodb"
import { getConfig } from "./config.js"

let client = null
let db = null

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 2000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const connectDB = async (uri) => {
  const { MONGODB_URI } = getConfig()
  const connectionUri = uri || MONGODB_URI

  const dbName = connectionUri.split("/").pop().split("?")[0]

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      client = new MongoClient(connectionUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
        retryReads: true,
      })

      await client.connect()
      db = client.db(dbName)

      console.log(`Connected to MongoDB (db: ${dbName}, attempt: ${attempt})`)
      return { client, db }
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message)
      if (client) {
        try { await client.close() } catch { /* ignore */ }
        client = null
        db = null
      }
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`)
        await sleep(RETRY_DELAY_MS)
      } else {
        throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${err.message}`)
      }
    }
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.")
  }
  return db
}

export const disconnectDB = async () => {
  if (client) {
    try {
      await client.close()
    } catch { /* ignore */ }
    client = null
    db = null
  }
}

let reconnectTimer = null

export const setupReconnectOnFailure = (uri) => {
  const monitor = setInterval(async () => {
    if (!client || !db) return
    try {
      await client.db("admin").command({ ping: 1 })
    } catch {
      console.warn("MongoDB connection lost. Reconnecting...")
      clearInterval(monitor)
      if (reconnectTimer) clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(async () => {
        try {
          await disconnectDB()
          await connectDB(uri)
          console.log("MongoDB reconnected successfully.")
        } catch (err) {
          console.error("MongoDB reconnection failed:", err.message)
        }
      }, 1000)
    }
  }, 30000)
  return monitor
}
