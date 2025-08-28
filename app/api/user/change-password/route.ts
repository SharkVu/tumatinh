import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken, verifyPassword, hashPassword } from "@/lib/auth"

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

    const { oldPassword, newPassword, confirmPassword } = await request.json()

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Mật khẩu mới không khớp" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId: decoded.userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    const isValidOldPassword = verifyPassword(oldPassword, user.password)
    if (!isValidOldPassword) {
      return NextResponse.json({ error: "Mật khẩu cũ không đúng" }, { status: 400 })
    }

    const hashedNewPassword = hashPassword(newPassword)

    await db.collection("users").updateOne({ userId: decoded.userId }, { $set: { password: hashedNewPassword } })

    return NextResponse.json({ message: "Đổi mật khẩu thành công" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
