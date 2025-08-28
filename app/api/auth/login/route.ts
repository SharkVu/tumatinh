import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ error: "UID và mật khẩu là bắt buộc" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId })

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 401 })
    }

    const isValidPassword = verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 })
    }

    const token = generateToken(user.userId)

    const response = NextResponse.json({
      message: "Đăng nhập thành công",
      user: {
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
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
