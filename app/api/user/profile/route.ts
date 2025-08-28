import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId: decoded.userId })

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    return NextResponse.json({
      userId: user.userId,
      username: user.username,
      monphai: user.monphai,
      linhthach: user.linhthach,
      tuvi: user.tuvi,
      lucchien: user.lucchien,
      HP: user.HP,
      phongthu: user.phongthu,
      capbac: user.capbac,
      currentTuvi: user.currentTuvi,
      avatar: user.avatar || "/martial-arts-avatar.png",
      bankInfo: user.bankInfo,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
