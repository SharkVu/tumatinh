const { MongoClient } = require("mongodb")

const MONGODB_URI =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority"

async function addTestUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("tutien")
    const usersCollection = db.collection("Users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ uid: "852613496000872489" })
    if (existingUser) {
      console.log("User already exists:", existingUser)
      return
    }

    // Add test user
    const testUser = {
      uid: "852613496000872489",
      username: "TestPlayer",
      avatar: "martial-arts-master.png",
      stats: {
        tuvi: 1250,
        lucchien: 890,
        hp: 2100,
        phongthu: 750,
      },
      wallet: {
        linhthach: 15000,
      },
      bankInfo: {
        accountNumber: "",
        bankName: "",
        accountHolder: "",
      },
      withdrawPassword: "280393",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    const result = await usersCollection.insertOne(testUser)
    console.log("Test user added successfully:", result.insertedId)

    // Also check existing collections structure
    const collections = await db.listCollections().toArray()
    console.log(
      "Available collections:",
      collections.map((c) => c.name),
    )

    // Check if there are any existing users
    const userCount = await usersCollection.countDocuments()
    console.log("Total users in database:", userCount)

    if (userCount > 1) {
      const sampleUsers = await usersCollection.find({}).limit(3).toArray()
      console.log(
        "Sample users:",
        sampleUsers.map((u) => ({ uid: u.uid, username: u.username })),
      )
    }
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

addTestUser()
