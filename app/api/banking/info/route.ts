import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Thiếu thông tin người dùng" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

    const bankInfo = await db.collection("bankings").findOne({ userId })

    return NextResponse.json({ bankInfo })
  } catch (error) {
    console.error("Get banking info error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, accountNumber, bankName, accountHolder } = await request.json()

    if (!userId || !accountNumber || !bankName || !accountHolder) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("tutien")

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
      { upsert: true },
    )

    return NextResponse.json({ success: true, message: "Cập nhật thông tin ngân hàng thành công" })
  } catch (error) {
    console.error("Update banking info error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
