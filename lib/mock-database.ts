// Mock database system for when MongoDB is not available
export interface User {
  _id: string
  uid: string
  name: string
  avatar: string
  linhthach: number
  tuvi: number
  lucchien: number
  hp: number
  phongthu: number
  bankInfo?: {
    accountNumber: string
    bankName: string
    accountHolder: string
  }
  password?: string // For withdrawal only
}

export interface ShopItem {
  _id: string
  name: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary"
  description: string
  image: string
}

export interface Lesson {
  _id: string
  title: string
  question: string
  options: string[]
  correctAnswer: number
  reward: number
}

export interface InventoryItem {
  _id: string
  userId: string
  itemId: string
  quantity: number
}

// Mock data
const mockUsers: User[] = [
  {
    _id: "1",
    uid: "852613496000872489",
    name: "Tu Tiên Đại Sư",
    avatar: "/martial-arts-master.png",
    linhthach: 5000,
    tuvi: 85,
    lucchien: 92,
    hp: 100,
    phongthu: 78,
    password: "280393",
  },
]

const mockShops: ShopItem[] = [
  {
    _id: "1",
    name: "Thiên Thần Kiếm",
    price: 1000,
    rarity: "legendary",
    description: "Một thanh kiếm huyền thoại với sức mạnh thiên thần",
    image: "/legendary-sword.png",
  },
  {
    _id: "2",
    name: "Huyền Thiên Giáp",
    price: 800,
    rarity: "epic",
    description: "Bộ giáp bảo vệ với sức mạnh huyền bí",
    image: "/mystical-armor.png",
  },
  {
    _id: "3",
    name: "Tu Luyện Đan",
    price: 200,
    rarity: "rare",
    description: "Viên đan giúp tăng tu vi nhanh chóng",
    image: "/cultivation-pill.png",
  },
  {
    _id: "4",
    name: "Võ Học Bí Kíp",
    price: 500,
    rarity: "epic",
    description: "Cuốn sách chứa những bí kíp võ học cao cấp",
    image: "/martial-arts-scroll.png",
  },
]

const mockLessons: Lesson[] = [
  {
    _id: "1",
    title: "Cơ Bản Tu Luyện",
    question: "Bước đầu tiên trong tu luyện là gì?",
    options: ["Tĩnh tâm", "Luyện khí", "Đánh nhau", "Ngủ"],
    correctAnswer: 0,
    reward: 50,
  },
  {
    _id: "2",
    title: "Võ Học Cơ Bản",
    question: "Điều quan trọng nhất trong võ học là gì?",
    options: ["Sức mạnh", "Tốc độ", "Kỹ thuật", "May mắn"],
    correctAnswer: 2,
    reward: 75,
  },
]

const mockInventory: InventoryItem[] = []

// Mock database operations
export class MockDatabase {
  static async findUserByUID(uid: string): Promise<User | null> {
    return mockUsers.find((user) => user.uid === uid) || null
  }

  static async updateUser(uid: string, updates: Partial<User>): Promise<boolean> {
    const userIndex = mockUsers.findIndex((user) => user.uid === uid)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
      return true
    }
    return false
  }

  static async getShopItems(): Promise<ShopItem[]> {
    return mockShops
  }

  static async getLessons(): Promise<Lesson[]> {
    return mockLessons
  }

  static async getUserInventory(userId: string): Promise<InventoryItem[]> {
    return mockInventory.filter((item) => item.userId === userId)
  }

  static async addToInventory(userId: string, itemId: string, quantity = 1): Promise<boolean> {
    const existingItem = mockInventory.find((item) => item.userId === userId && item.itemId === itemId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      mockInventory.push({
        _id: Date.now().toString(),
        userId,
        itemId,
        quantity,
      })
    }
    return true
  }

  static async validateWithdrawalPassword(uid: string, password: string): Promise<boolean> {
    const user = await this.findUserByUID(uid)
    return user?.password === password
  }
}
