// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority&ssl=true";

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
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Development: giữ clientPromise global để HMR
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: mỗi serverless instance có riêng client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Optional helper function nếu bạn muốn kết nối và lấy DB
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tutien");
  return { client, db };
}
