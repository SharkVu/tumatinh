const { MongoClient } = require("mongodb")

const MONGODB_URI =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority"

async function checkDatabaseStructure() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("tutien")

    // List all collections
    const collections = await db.listCollections().toArray()
    console.log(
      "Available collections:",
      collections.map((c) => c.name),
    )

    // Check Users collection
    if (collections.find((c) => c.name === "Users")) {
      const usersCollection = db.collection("Users")
      const userCount = await usersCollection.countDocuments()
      console.log("\n--- Users Collection ---")
      console.log("Total users:", userCount)

      if (userCount > 0) {
        const sampleUser = await usersCollection.findOne({})
        console.log("Sample user structure:", JSON.stringify(sampleUser, null, 2))
      }
    }

    // Check shops collection
    if (collections.find((c) => c.name === "shops")) {
      const shopsCollection = db.collection("shops")
      const shopCount = await shopsCollection.countDocuments()
      console.log("\n--- Shops Collection ---")
      console.log("Total shop items:", shopCount)

      if (shopCount > 0) {
        const sampleShop = await shopsCollection.findOne({})
        console.log("Sample shop item:", JSON.stringify(sampleShop, null, 2))
      }
    }

    // Check lessons collection
    if (collections.find((c) => c.name === "lessons")) {
      const lessonsCollection = db.collection("lessons")
      const lessonCount = await lessonsCollection.countDocuments()
      console.log("\n--- Lessons Collection ---")
      console.log("Total lessons:", lessonCount)

      if (lessonCount > 0) {
        const sampleLesson = await lessonsCollection.findOne({})
        console.log("Sample lesson:", JSON.stringify(sampleLesson, null, 2))
      }
    }

    // Check khos collection
    if (collections.find((c) => c.name === "khos")) {
      const khosCollection = db.collection("khos")
      const khoCount = await khosCollection.countDocuments()
      console.log("\n--- Khos Collection ---")
      console.log("Total kho items:", khoCount)

      if (khoCount > 0) {
        const sampleKho = await khosCollection.findOne({})
        console.log("Sample kho item:", JSON.stringify(sampleKho, null, 2))
      }
    }
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

checkDatabaseStructure()
