// Script to setup initial database with the provided user data
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI =
  "mongodb+srv://hocvienphs:kienhd1231%40@cluster0.8ca8jsd.mongodb.net/tutien?retryWrites=true&w=majority"

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("tutien")

    // Create users collection with the provided user data
    const hashedPassword = bcrypt.hashSync("280393", 12)

    const userData = {
      userId: "852613496000872489",
      username: "sharkvu.",
      password: hashedPassword,
      monphai: "Toán Đạo Môn",
      linhthach: 10,
      tuvi: 80,
      lucchien: 50,
      HP: 50,
      phongthu: 50,
      capbac: "Phàm nhân",
      currentTuvi: 150,
      avatar: "/martial-arts-master.png",
      bankInfo: {
        accountNumber: "",
        bankName: "",
        accountHolder: "",
      },
    }

    // Insert or update user
    await db.collection("users").updateOne({ userId: userData.userId }, { $set: userData }, { upsert: true })

    // Create shop items collection
    const shopItems = [
      {
        id: 1,
        name: "Thiên Kiếm",
        price: 100,
        rarity: "legendary",
        description: "Kiếm thần thoại với sức mạnh thiên đình",
        image: "/legendary-sword.png",
      },
      {
        id: 2,
        name: "Hồi Linh Đan",
        price: 50,
        rarity: "rare",
        description: "Đan dược hồi phục sinh lực",
        image: "/healing-pill.png",
      },
      {
        id: 3,
        name: "Long Lân Giáp",
        price: 200,
        rarity: "epic",
        description: "Giáp rồng với sức mạnh bảo vệ tuyệt đối",
        image: "/dragon-armor.png",
      },
      {
        id: 4,
        name: "Phượng Hoàng Thần Châu",
        price: 300,
        rarity: "legendary",
        description: "Châu báu chứa linh lực phượng hoàng",
        image: "/phoenix-orb.png",
      },
      {
        id: 5,
        name: "Băng Tinh Thạch",
        price: 75,
        rarity: "rare",
        description: "Tinh thạch băng giá với năng lượng lạnh lẽo",
        image: "/ice-crystal.png",
      },
      {
        id: 6,
        name: "Lôi Điện Phù",
        price: 25,
        rarity: "common",
        description: "Phù chú sấm sét cơ bản",
        image: "/lightning-talisman.png",
      },
    ]

    await db.collection("shopItems").deleteMany({})
    await db.collection("shopItems").insertMany(shopItems)

    // Create lessons collection for cultivation system
    const lessons = [
      {
        id: 1,
        title: "Cơ Bản Tu Luyện",
        question: "Bước đầu tiên trong tu luyện là gì?",
        options: ["Tĩnh tâm", "Luyện khí", "Đọc sách", "Ngủ"],
        correct: 0,
        reward: 10,
      },
      {
        id: 2,
        title: "Thiên Địa Linh Khí",
        question: "Linh khí mạnh nhất xuất hiện vào lúc nào?",
        options: ["Sáng sớm", "Trưa", "Hoàng hôn", "Nửa đêm"],
        correct: 0,
        reward: 15,
      },
      {
        id: 3,
        title: "Đan Dược Học",
        question: "Nguyên liệu chính để luyện Hồi Linh Đan là gì?",
        options: ["Linh chi", "Nhân sâm", "Hà thủ ô", "Tất cả đều đúng"],
        correct: 3,
        reward: 20,
      },
    ]

    await db.collection("lessons").deleteMany({})
    await db.collection("lessons").insertMany(lessons)

    console.log("Database setup completed successfully!")
    console.log("User created with UID: 852613496000872489, Password: 280393")
  } catch (error) {
    console.error("Database setup error:", error)
  } finally {
    await client.close()
  }
}

setupDatabase()
