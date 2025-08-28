interface User {
  uid: string
  password: string
  name: string
  avatar: string
  stats: {
    tuvi: number
    lucchien: number
    hp: number
    phongthu: number
  }
  wallet: {
    linhthach: number
  }
  bankInfo?: {
    accountNumber: string
    bankName: string
    accountHolder: string
  }
  inventory: Array<{
    itemId: string
    quantity: number
  }>
}

interface ShopItem {
  id: string
  name: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary"
  description: string
  image: string
}

interface CultivationLesson {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  reward: number
  explanation: string
}

// Initialize default data
const defaultUser: User = {
  uid: "852613496000872489",
  password: "280393", // In real app, this would be hashed
  name: "Tu Tiên Đại Sư",
  avatar: "/martial-arts-avatar.png",
  stats: {
    tuvi: 75,
    lucchien: 8500,
    hp: 1200,
    phongthu: 650,
  },
  wallet: {
    linhthach: 50000,
  },
  inventory: [],
}

const defaultShopItems: ShopItem[] = [
  {
    id: "sword_legendary",
    name: "Thiên Long Kiếm",
    price: 25000,
    rarity: "legendary",
    description: "Kiếm huyền thoại của rồng thiêng",
    image: "/legendary-sword.png",
  },
  {
    id: "armor_epic",
    name: "Huyền Thiên Giáp",
    price: 15000,
    rarity: "epic",
    description: "Giáp phòng thủ cực mạnh",
    image: "/mystical-armor.png",
  },
  {
    id: "pill_rare",
    name: "Thiên Linh Đan",
    price: 8000,
    rarity: "rare",
    description: "Đan dược tăng tu vi",
    image: "/cultivation-pill.png",
  },
  {
    id: "scroll_common",
    name: "Võ Học Bí Kíp",
    price: 3000,
    rarity: "common",
    description: "Bí kíp võ thuật cơ bản",
    image: "/martial-arts-scroll.png",
  },
]

const defaultLessons: CultivationLesson[] = [
  {
    id: "lesson_1",
    question: "Trong tu tiên, 'Tu Vi' đại diện cho điều gì?",
    options: ["Sức mạnh vật lý", "Trình độ tu luyện tâm linh", "Số lượng vàng", "Kỹ năng chiến đấu"],
    correctAnswer: 1,
    reward: 1000,
    explanation: "Tu Vi là trình độ tu luyện tâm linh, thể hiện sự tiến bộ trong con đường tu tiên.",
  },
  {
    id: "lesson_2",
    question: "Linh Thạch được sử dụng để làm gì?",
    options: ["Trang trí", "Mua sắm và tu luyện", "Chỉ để ngắm", "Không có tác dụng"],
    correctAnswer: 1,
    reward: 1200,
    explanation: "Linh Thạch là tiền tệ quan trọng dùng để mua vật phẩm và hỗ trợ tu luyện.",
  },
]

export class GameStorage {
  private static instance: GameStorage

  static getInstance(): GameStorage {
    if (!GameStorage.instance) {
      GameStorage.instance = new GameStorage()
    }
    return GameStorage.instance
  }

  private constructor() {
    this.initializeData()
  }

  private initializeData() {
    if (typeof window === "undefined") return

    if (!localStorage.getItem("game_user")) {
      localStorage.setItem("game_user", JSON.stringify(defaultUser))
    }
    if (!localStorage.getItem("game_shop_items")) {
      localStorage.setItem("game_shop_items", JSON.stringify(defaultShopItems))
    }
    if (!localStorage.getItem("game_lessons")) {
      localStorage.setItem("game_lessons", JSON.stringify(defaultLessons))
    }
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("game_user")
    return userData ? JSON.parse(userData) : null
  }

  updateUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem("game_user", JSON.stringify(user))
  }

  validateLogin(uid: string, password: string): boolean {
    const user = this.getUser()
    return user ? user.uid === uid && user.password === password : false
  }

  validateLoginByUID(uid: string): boolean {
    const user = this.getUser()
    return user ? user.uid === uid : false
  }

  getShopItems(): ShopItem[] {
    if (typeof window === "undefined") return []
    const items = localStorage.getItem("game_shop_items")
    return items ? JSON.parse(items) : []
  }

  getLessons(): CultivationLesson[] {
    if (typeof window === "undefined") return []
    const lessons = localStorage.getItem("game_lessons")
    return lessons ? JSON.parse(lessons) : []
  }

  buyItem(itemId: string): boolean {
    const user = this.getUser()
    const items = this.getShopItems()

    if (!user) return false

    const item = items.find((i) => i.id === itemId)
    if (!item || user.wallet.linhthach < item.price) return false

    user.wallet.linhthach -= item.price

    const existingItem = user.inventory.find((i) => i.itemId === itemId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      user.inventory.push({ itemId, quantity: 1 })
    }

    this.updateUser(user)
    return true
  }

  answerLesson(lessonId: string, answer: number): { correct: boolean; reward: number; explanation: string } {
    const lessons = this.getLessons()
    const lesson = lessons.find((l) => l.id === lessonId)

    if (!lesson) return { correct: false, reward: 0, explanation: "" }

    const correct = answer === lesson.correctAnswer

    if (correct) {
      const user = this.getUser()
      if (user) {
        user.wallet.linhthach += lesson.reward
        this.updateUser(user)
      }
    }

    return {
      correct,
      reward: correct ? lesson.reward : 0,
      explanation: lesson.explanation,
    }
  }
}
