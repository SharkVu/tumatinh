const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority"

async function setupShops() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("tutien")
    const shopsCollection = db.collection("shops")

    // Clear existing shops
    await shopsCollection.deleteMany({})

    // Add sample shop items
    const shopItems = [
      {
        name: "Thiên Linh Đan",
        description: "Tăng 100 Tu Vi khi sử dụng",
        price: 500,
        rarity: "legendary",
        image: "/legendary-sword.png",
        effect: "tuvi",
        effectValue: 100,
        category: "dan_duoc",
      },
      {
        name: "Huyền Thiết Kiếm",
        description: "Vũ khí thần thoại tăng sức mạnh",
        price: 1000,
        rarity: "legendary",
        image: "/martial-arts-master.png",
        effect: "lucchien",
        effectValue: 200,
        category: "vu_khi",
      },
    ]

    await shopsCollection.insertMany(shopItems)
    console.log("Shop items added successfully")
  } catch (error) {
    console.error("Error setting up shops:", error)
  } finally {
    await client.close()
  }
}

setupShops()
