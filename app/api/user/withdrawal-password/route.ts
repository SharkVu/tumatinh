import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { userId, password, newPassword } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Thiếu thông tin người dùng" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    // If creating new withdrawal password
    if (!user.withdrawalPassword && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.collection("users").updateOne({ userId }, { $set: { withdrawalPassword: hashedPassword } })
      return NextResponse.json({ success: true, message: "Tạo mật khẩu rút tiền thành công" })
    }

    // If changing existing withdrawal password
    if (user.withdrawalPassword && password && newPassword) {
      const isValidPassword = await bcrypt.compare(password, user.withdrawalPassword)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Mật khẩu cũ không đúng" }, { status: 400 })
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      await db.collection("users").updateOne({ userId }, { $set: { withdrawalPassword: hashedNewPassword } })
      return NextResponse.json({ success: true, message: "Đổi mật khẩu rút tiền thành công" })
    }

    return NextResponse.json({ error: "Thông tin không hợp lệ" }, { status: 400 })
  } catch (error) {
    console.error("Withdrawal password error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Thiếu thông tin người dùng" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    return NextResponse.json({ hasWithdrawalPassword: !!user.withdrawalPassword })
  } catch (error) {
    console.error("Check withdrawal password error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
