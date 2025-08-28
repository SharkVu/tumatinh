import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken, verifyPassword } from "@/lib/auth"

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

    const { amount, password } = await request.json()

    if (!amount || !password) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Số tiền rút phải lớn hơn 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const user = await db.collection("users").findOne({ userId: decoded.userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    const isValidPassword = verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 400 })
    }

    if (user.linhthach < amount) {
      return NextResponse.json({ error: "Không đủ Linh Thạch để rút" }, { status: 400 })
    }

    if (!user.bankInfo || !user.bankInfo.accountNumber) {
      return NextResponse.json({ error: "Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền" }, { status: 400 })
    }

    // Update user's Linh Thạch
    await db.collection("users").updateOne({ userId: decoded.userId }, { $inc: { linhthach: -amount } })

    // Log withdrawal transaction
    await db.collection("withdrawals").insertOne({
      userId: decoded.userId,
      amount,
      vndAmount: amount * 1000,
      bankInfo: user.bankInfo,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "Yêu cầu rút tiền thành công",
      newBalance: user.linhthach - amount,
    })
  } catch (error) {
    console.error("Withdraw error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
