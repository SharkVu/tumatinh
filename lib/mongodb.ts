import { MongoClient } from "mongodb"

let clientPromise: Promise<MongoClient> | null = null

const uri =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority&ssl=true"

const options = {
  ssl: true,
  sslValidate: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 0,
  connectTimeoutMS: 30000,
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  waitQueueTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
}

let client

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  if (!clientPromise) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect().catch((error) => {
      console.error("MongoDB connection failed:", error)
      clientPromise = null
      throw error
    })
  }
}

export async function connectToDatabase() {
  try {
    let retries = 3
    while (retries > 0) {
      try {
        const client = await clientPromise!
        const db = client.db("tutien")
        return { client, db }
      } catch (error) {
        retries--
        if (retries === 0) throw error
        console.log(`MongoDB connection retry, attempts left: ${retries}`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Reset clientPromise for retry
        if (process.env.NODE_ENV === "production") {
          client = new MongoClient(uri, options)
          clientPromise = client.connect()
        }
      }
    }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error("Failed to connect to MongoDB")
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
