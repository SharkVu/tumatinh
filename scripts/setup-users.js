const { MongoClient } = require("mongodb")

const MONGODB_URI =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority"

async function setupUsers() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("[v0] Connecting to MongoDB...")
    await client.connect()
    console.log("[v0] Connected successfully")

    const db = client.db("tutien")
    const usersCollection = db.collection("Users")

    // Check existing users
    console.log("[v0] Checking existing users...")
    const existingUsers = await usersCollection.find({}).toArray()
    console.log("[v0] Existing users:", existingUsers.length)

    if (existingUsers.length > 0) {
      console.log("[v0] Sample user:", existingUsers[0])
    }

    // Check if test user exists
    const testUser = await usersCollection.findOne({ uid: "852613496000872489" })

    if (!testUser) {
      console.log("[v0] Test user not found, creating...")

      const newUser = {
        uid: "852613496000872489",
        username: "TestPlayer",
        avatar: "/martial-arts-avatar.png",
        stats: {
          tuvi: 1250,
          lucchien: 8500,
          hp: 2800,
          phongthu: 1900,
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

      await usersCollection.insertOne(newUser)
      console.log("[v0] Test user created successfully")
    } else {
      console.log("[v0] Test user already exists")
    }

    // Verify the user exists now
    const verifyUser = await usersCollection.findOne({ uid: "852613496000872489" })
    console.log("[v0] User verification:", verifyUser ? "Found" : "Not found")
  } catch (error) {
    console.error("[v0] Error:", error)
  } finally {
    await client.close()
    console.log("[v0] Connection closed")
  }
}

setupUsers()
