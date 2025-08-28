import { NextResponse, type NextRequest } from "next/server"
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

    // Get user's monphai first
    const user = await db.collection("users").findOne({ userId: userId })
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 })
    }

    // Filter lessons by user's monphai
    const lessons = await db.collection("lessons").find({ monphai: user.monphai }).toArray()

    return NextResponse.json(lessons)
  } catch (error) {
    console.error("Lessons error:", error)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
