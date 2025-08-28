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

    const { avatar } = await request.json()

    if (!avatar) {
      return NextResponse.json({ error: "Vui lòng chọn avatar" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    await db.collection("users").updateOne({ userId: decoded.userId }, { $set: { avatar } })

    return NextResponse.json({ message: "Cập nhật avatar thành công" })
  } catch (error) {
    console.error("Update avatar error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
