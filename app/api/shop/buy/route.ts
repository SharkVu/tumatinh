import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 })
    }

    const { itemId } = await request.json()

    const client = await clientPromise
    const db = client.db("tutien")

    // Get item details
    const item = await db.collection("shopItems").findOne({ id: itemId })
    if (!item) {
      return NextResponse.json({ error: "Không tìm thấy vật phẩm" }, { status: 404 })
    }

    // Get user
    const user = await db.collection("users").findOne({ userId: decoded.userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    // Check if user has enough Linh Thạch
    if (user.linhthach < item.price) {
      return NextResponse.json({ error: "Không đủ Linh Thạch" }, { status: 400 })
    }

    // Update user's Linh Thạch
    await db.collection("users").updateOne({ userId: decoded.userId }, { $inc: { linhthach: -item.price } })

    // Add item to user's inventory
    await db.collection("inventory").updateOne(
      { userId: decoded.userId, itemId: item.id },
      {
        $inc: { quantity: 1 },
        $setOnInsert: {
          userId: decoded.userId,
          itemId: item.id,
          itemName: item.name,
          itemImage: item.image,
          rarity: item.rarity,
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      message: "Mua thành công",
      newBalance: user.linhthach - item.price,
    })
  } catch (error) {
    console.error("Buy item error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
