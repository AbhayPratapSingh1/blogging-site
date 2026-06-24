import { createApp } from "./src/app.js"
import { connectDB, setupReconnectOnFailure } from "./src/db.js"
import { getConfig } from "./src/config.js"

const main = async () => {
  const { PORT } = getConfig()

  const { db } = await connectDB()
  const app = createApp(db)

  setupReconnectOnFailure()

  Deno.serve({ port: PORT }, app.fetch)
}

main()
