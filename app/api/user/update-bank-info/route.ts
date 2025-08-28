import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { userId, accountNumber, bankName, accountHolder } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 })
    }

    if (!accountNumber || !bankName || !accountHolder) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin ngân hàng" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    await db.collection("bankings").updateOne(
      { userId },
      {
        $set: {
          userId,
          accountNumber,
          bankName,
          accountHolder,
          updatedAt: new Date(),
        },
      },
      { upsert: true }, // Create if doesn't exist
    )

    return NextResponse.json({ message: "Cập nhật thông tin ngân hàng thành công" })
  } catch (error) {
    console.error("Update bank info error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
